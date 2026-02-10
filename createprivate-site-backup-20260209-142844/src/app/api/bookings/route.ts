import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAuditInvite } from "@/lib/calendar";
import { sendBookingEmails } from "@/lib/email";
import { getSupabaseClient } from "@/lib/supabase";
import { loadAvailabilityWindows, isSlotWithinAvailability } from "@/lib/scheduling";
import { waLink } from "@/lib/utils";
import {
  bookingLeadStatus,
  captureLeadThread,
  ensureDealerAccount,
  mapLeadSource
} from "@/lib/beta-capture";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const limit = checkRateLimit(`booking:${ip}:${userAgent.slice(0, 50)}`);

  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid booking payload." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  if (input.honeypot) {
    return NextResponse.json({ message: "Spam detection triggered." }, { status: 400 });
  }

  const preferredDate = new Date(input.preferredDateTime);
  if (preferredDate.getTime() < Date.now() + 10 * 60 * 1000) {
    return NextResponse.json({ message: "Choose a future slot at least 10 minutes from now." }, { status: 400 });
  }

  const windows = await loadAvailabilityWindows();
  if (!isSlotWithinAvailability(input.preferredDateTime, windows)) {
    return NextResponse.json(
      { message: "Selected time is outside configured booking availability." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseClient();
    const dealerId = await ensureDealerAccount(supabase, {
      dealershipName: input.dealershipName,
      brand: input.brand,
      city: input.city,
      plan: "growth"
    });

    const { data: existing, error: existingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("scheduled_for", input.preferredDateTime)
      .in("status", ["booked", "completed"])
      .limit(1);

    if (existingError) {
      throw existingError;
    }

    if (existing?.length) {
      return NextResponse.json(
        { message: "That slot has already been booked. Please choose a different time." },
        { status: 409 }
      );
    }

    const leadCapture = await captureLeadThread(supabase, {
      dealerId,
      source: mapLeadSource(input.source),
      name: input.contactPerson,
      phone: input.phone,
      vehicleInterest: input.brand,
      status: bookingLeadStatus(),
      leadMessage: input.notes || `Lead requested an audit booking for ${input.dealershipName}.`,
      responseMessage: "Thanks, your booking request has been received. We are confirming your slot now.",
      aiEventType: "booking"
    });

    const { data: created, error: insertError } = await supabase
      .from("bookings")
      .insert({
        dealer_id: dealerId,
        lead_id: leadCapture.leadId,
        type: "appointment",
        requested_at: new Date().toISOString(),
        scheduled_for: input.preferredDateTime,
        status: "booked",
        created_by: "human"
      })
      .select("id")
      .single();

    if (insertError) {
      throw insertError;
    }

    const bookingId = created.id as string;
    const inviteIcs = createAuditInvite({
      uid: `${bookingId}@createprivateltd.co.za`,
      startISO: input.preferredDateTime,
      dealershipName: input.dealershipName,
      contactPerson: input.contactPerson
    });

    await sendBookingEmails({
      bookingId,
      dealershipName: input.dealershipName,
      brand: input.brand,
      contactPerson: input.contactPerson,
      phone: input.phone,
      email: input.email,
      province: input.province,
      city: input.city,
      preferredDateTime: input.preferredDateTime,
      inviteIcs
    });

    const whatsappConfirmationUrl = waLink(
      input.phone,
      `Hi ${input.contactPerson}, your 15-minute Dealer Lead Audit with CreatePrivateLtd is confirmed for ${new Date(
        input.preferredDateTime
      ).toLocaleString("en-ZA", {
        dateStyle: "full",
        timeStyle: "short"
      })}.`
    );

    return NextResponse.json({
      success: true,
      bookingId,
      message: "Booking confirmed.",
      booking: {
        dealershipName: input.dealershipName,
        brand: input.brand,
        contactPerson: input.contactPerson,
        preferredDateTime: input.preferredDateTime
      },
      whatsappConfirmationUrl
    });
  } catch (error) {
    console.error("Booking submission failed", error);
    return NextResponse.json(
      { message: "Booking failed. Please try again or contact us on WhatsApp." },
      { status: 500 }
    );
  }
}
