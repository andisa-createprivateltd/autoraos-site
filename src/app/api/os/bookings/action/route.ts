import { NextResponse } from "next/server";
import { addHours } from "date-fns";
import { recordAutoraAuditLog } from "@/lib/autora-audit";
import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import { osBookingActionSchema } from "@/lib/validation";
import { requireWebSessionAuth } from "@/lib/web-api-auth";

async function sendReminderViaMeta(phone: string, content: string) {
  const token = process.env.META_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return "mock";
  }

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone.replace(/\D/g, ""),
      type: "text",
      text: {
        preview_url: false,
        body: content
      }
    })
  });

  if (!response.ok) {
    throw new Error("Reminder delivery failed.");
  }

  return "sent";
}

export async function POST(request: Request) {
  const auth = await requireWebSessionAuth({
    allowedRoles: [
      "platform_owner",
      "platform_support",
      "dealer_admin",
      "dealer_sales"
    ]
  });

  if (!auth.ok) {
    return auth.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = osBookingActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid booking action payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;

  if (!hasSupabase()) {
    return NextResponse.json({ message: "Canonical data path is not configured." }, { status: 503 });
  }

  try {
    const supabase = getSupabaseClient();
    const autoraBookingResult = await supabase
      .from("autora_bookings")
      .select("id,dealership_id,group_id,lead_id,scheduled_for,status")
      .eq("id", input.booking_id)
      .limit(1)
      .maybeSingle();

    const shouldFallbackToLegacy = !autoraBookingResult.data && (!autoraBookingResult.error || autoraBookingResult.status === 406);
    const legacyBookingResult = shouldFallbackToLegacy
      ? await supabase
          .from("bookings")
          .select("id,dealer_id,group_id,lead_id,scheduled_for,status")
          .eq("id", input.booking_id)
          .limit(1)
          .maybeSingle()
      : null;

    if ((autoraBookingResult.error && autoraBookingResult.status !== 406) || legacyBookingResult?.error) {
      throw autoraBookingResult.error || legacyBookingResult?.error;
    }

    const booking = (autoraBookingResult.data
      ? {
          id: autoraBookingResult.data.id,
          dealer_id: autoraBookingResult.data.dealership_id,
          group_id: autoraBookingResult.data.group_id,
          lead_id: autoraBookingResult.data.lead_id,
          scheduled_for: autoraBookingResult.data.scheduled_for,
          status: autoraBookingResult.data.status,
          canonical: true
        }
      : legacyBookingResult?.data
        ? {
            id: legacyBookingResult.data.id,
            dealer_id: legacyBookingResult.data.dealer_id,
            group_id: legacyBookingResult.data.group_id,
            lead_id: legacyBookingResult.data.lead_id,
            scheduled_for: legacyBookingResult.data.scheduled_for,
            status: legacyBookingResult.data.status,
            canonical: false
          }
        : null) as null | {
      id: string;
      dealer_id: string;
      group_id: string | null;
      lead_id: string;
      scheduled_for: string;
      status: string | null;
      canonical: boolean;
    };

    if (!booking) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    if (input.action === "send_reminder") {
      const leadResult = booking.canonical
        ? await supabase
            .from("autora_leads")
            .select("id,full_name,phone")
            .eq("id", booking.lead_id)
            .limit(1)
            .maybeSingle()
        : await supabase
            .from("leads")
            .select("id,name,phone")
            .eq("id", booking.lead_id)
            .limit(1)
            .maybeSingle();

      if (leadResult.error || !leadResult.data) {
        return NextResponse.json({ message: "Lead not found for reminder." }, { status: 404 });
      }

      const lead = leadResult.data as {
        id: string;
        name?: string | null;
        full_name?: string | null;
        phone: string;
      };

      const reminderText = `Hi ${lead.full_name || lead.name || "there"}, reminder: your AUTORA appointment is scheduled for ${new Date(
        booking.scheduled_for
      ).toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}.`;

      const deliveryMode = await sendReminderViaMeta(lead.phone, reminderText);

      if (!booking.canonical) {
        await supabase.from("followups").insert({
          dealer_id: booking.dealer_id,
          lead_id: booking.lead_id,
          type: "reminder",
          sent_via: deliveryMode === "sent" ? "template" : "freeform",
          sent_at: new Date().toISOString(),
          responded: false
        });
      }

      await recordAutoraAuditLog({
        role: auth.session.role,
        email: auth.session.email,
        action: "booking_send_reminder",
        entityType: "booking",
        entityId: booking.id,
        dealershipId: booking.dealer_id,
        groupId: booking.group_id || null,
        metadata: {
          lead_id: booking.lead_id,
          delivery_mode: deliveryMode
        }
      });

      return NextResponse.json({ success: true });
    }

    if (input.action === "confirm") {
      const result = booking.canonical
        ? await supabase.from("autora_bookings").update({ status: "confirmed" }).eq("id", booking.id)
        : await supabase.from("bookings").update({ status: "booked" }).eq("id", booking.id);
      if (result.error) throw result.error;
      if (booking.canonical) {
        await supabase
          .from("autora_leads")
          .update({ status: "booked", last_activity_at: new Date().toISOString() })
          .eq("id", booking.lead_id);
      }
      await recordAutoraAuditLog({
        role: auth.session.role,
        email: auth.session.email,
        action: "booking_confirm",
        entityType: "booking",
        entityId: booking.id,
        dealershipId: booking.dealer_id,
        groupId: booking.group_id || null,
        metadata: { lead_id: booking.lead_id }
      });
      return NextResponse.json({ success: true });
    }

    if (input.action === "reschedule") {
      const nextSlot = addHours(new Date(booking.scheduled_for), 24).toISOString();
      const result = booking.canonical
        ? await supabase.from("autora_bookings").update({ scheduled_for: nextSlot, status: "rescheduled" }).eq("id", booking.id)
        : await supabase.from("bookings").update({ scheduled_for: nextSlot, status: "booked" }).eq("id", booking.id);
      if (result.error) throw result.error;
      if (booking.canonical) {
        await supabase
          .from("autora_leads")
          .update({ last_activity_at: new Date().toISOString() })
          .eq("id", booking.lead_id);
      }
      await recordAutoraAuditLog({
        role: auth.session.role,
        email: auth.session.email,
        action: "booking_reschedule",
        entityType: "booking",
        entityId: booking.id,
        dealershipId: booking.dealer_id,
        groupId: booking.group_id || null,
        metadata: {
          lead_id: booking.lead_id,
          scheduled_for: nextSlot
        }
      });
      return NextResponse.json({ success: true, scheduled_for: nextSlot });
    }

    if (input.action === "complete") {
      const result = booking.canonical
        ? await supabase.from("autora_bookings").update({ status: "completed" }).eq("id", booking.id)
        : await supabase.from("bookings").update({ status: "completed" }).eq("id", booking.id);
      if (result.error) throw result.error;
      if (booking.canonical) {
        await supabase
          .from("autora_leads")
          .update({ status: "completed", last_activity_at: new Date().toISOString() })
          .eq("id", booking.lead_id);
      }
      await recordAutoraAuditLog({
        role: auth.session.role,
        email: auth.session.email,
        action: "booking_complete",
        entityType: "booking",
        entityId: booking.id,
        dealershipId: booking.dealer_id,
        groupId: booking.group_id || null,
        metadata: { lead_id: booking.lead_id }
      });
      return NextResponse.json({ success: true });
    }

    if (input.action === "no_show") {
      const result = booking.canonical
        ? await supabase.from("autora_bookings").update({ status: "no_show" }).eq("id", booking.id)
        : await supabase.from("bookings").update({ status: "no_show" }).eq("id", booking.id);
      if (result.error) throw result.error;
      if (booking.canonical) {
        await supabase
          .from("autora_leads")
          .update({ last_activity_at: new Date().toISOString() })
          .eq("id", booking.lead_id);
      }
      await recordAutoraAuditLog({
        role: auth.session.role,
        email: auth.session.email,
        action: "booking_no_show",
        entityType: "booking",
        entityId: booking.id,
        dealershipId: booking.dealer_id,
        groupId: booking.group_id || null,
        metadata: { lead_id: booking.lead_id }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Unsupported booking action." }, { status: 400 });
  } catch (error) {
    console.error("Booking action failed", error);
    return NextResponse.json({ message: "Failed to process booking action." }, { status: 500 });
  }
}
