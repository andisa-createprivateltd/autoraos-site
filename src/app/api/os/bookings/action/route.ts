import { NextResponse } from "next/server";
import { addHours } from "date-fns";
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
  const auth = requireWebSessionAuth({
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

  try {
    const supabase = getSupabaseClient();
    const bookingResult = await supabase
      .from("bookings")
      .select("id,dealer_id,lead_id,scheduled_for,status")
      .eq("id", input.booking_id)
      .limit(1)
      .maybeSingle();

    if (bookingResult.error || !bookingResult.data) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    const booking = bookingResult.data as {
      id: string;
      dealer_id: string;
      lead_id: string;
      scheduled_for: string;
      status: string | null;
    };

    if (input.action === "send_reminder") {
      const leadResult = await supabase
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
        name: string | null;
        phone: string;
      };

      const reminderText = `Hi ${lead.name || "there"}, reminder: your AUTORA appointment is scheduled for ${new Date(
        booking.scheduled_for
      ).toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}.`;

      const deliveryMode = await sendReminderViaMeta(lead.phone, reminderText);

      await supabase.from("followups").insert({
        dealer_id: booking.dealer_id,
        lead_id: booking.lead_id,
        type: "reminder",
        sent_via: deliveryMode === "sent" ? "template" : "freeform",
        sent_at: new Date().toISOString(),
        responded: false
      });

      return NextResponse.json({ success: true });
    }

    if (input.action === "confirm") {
      const result = await supabase
        .from("bookings")
        .update({ status: "booked" })
        .eq("id", booking.id);
      if (result.error) throw result.error;
      return NextResponse.json({ success: true });
    }

    if (input.action === "reschedule") {
      const nextSlot = addHours(new Date(booking.scheduled_for), 24).toISOString();
      const result = await supabase
        .from("bookings")
        .update({ scheduled_for: nextSlot, status: "booked" })
        .eq("id", booking.id);
      if (result.error) throw result.error;
      return NextResponse.json({ success: true, scheduled_for: nextSlot });
    }

    if (input.action === "complete") {
      const result = await supabase
        .from("bookings")
        .update({ status: "completed" })
        .eq("id", booking.id);
      if (result.error) throw result.error;
      return NextResponse.json({ success: true });
    }

    if (input.action === "no_show") {
      const result = await supabase
        .from("bookings")
        .update({ status: "no_show" })
        .eq("id", booking.id);
      if (result.error) throw result.error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Unsupported booking action." }, { status: 400 });
  } catch (error) {
    console.error("Booking action failed", error);
    return NextResponse.json({ message: "Failed to process booking action." }, { status: 500 });
  }
}
