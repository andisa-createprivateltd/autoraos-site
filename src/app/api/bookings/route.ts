import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { bookingSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAuditInvite } from "@/lib/calendar";
import { sendBookingEmails } from "@/lib/email";
import { getSupabaseClient } from "@/lib/supabase";
import { hasSupabase } from "@/lib/env";
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

  let mode: "live" | "fallback" = "fallback";
  let bookingId: `${string}-${string}-${string}-${string}-${string}` = randomUUID();

  if (hasSupabase()) {
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
        leadMessage: input.notes || `Contact requested a revenue audit booking for ${input.dealershipName}.`,
        responseMessage: "Thanks, your revenue audit request has been received. We are confirming your slot now.",
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

      bookingId = created.id as typeof bookingId;
      mode = "live";
    } catch (error) {
      console.error("Booking persistence failed, using fallback mode", error);
    }
  }

  const bookingUidDomain = process.env.BOOKING_UID_DOMAIN || "autoraos.company";
  const inviteIcs = createAuditInvite({
    uid: `${bookingId}@${bookingUidDomain}`,
    startISO: input.preferredDateTime,
    dealershipName: input.dealershipName,
    contactPerson: input.contactPerson
  });

  try {
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
  } catch (error) {
    console.error("Booking notification failed", error);
  }

  const whatsappConfirmationUrl = waLink(
    input.phone,
    `Hi ${input.contactPerson}, your 15-minute Revenue Audit with AUTORA is confirmed for ${new Date(
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
    mode,
    booking: {
      dealershipName: input.dealershipName,
      brand: input.brand,
      contactPerson: input.contactPerson,
      preferredDateTime: input.preferredDateTime
    },
    whatsappConfirmationUrl
  });
}
