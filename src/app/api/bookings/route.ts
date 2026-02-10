import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { waLink } from "@/lib/utils";
import { processBooking } from "@/lib/booking-handler";

/**
 * Booking API - Reconstructed for Simplicity and Reliability
 * 
 * Architecture:
 * 1. Validate input
 * 2. Check rate limits
 * 3. Process booking (email-first approach)
 * 4. Return success/failure
 * 
 * Philosophy:
 * - Email is the primary booking channel
 * - Database is an optional enhancement
 * - Never fail the user due to database issues
 * - Simple, clear code flow
 */
export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const limit = checkRateLimit(`booking:${ip}:${userAgent.slice(0, 50)}`);

  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  // Parse and validate JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  // Validate booking data
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid booking data." },
      { status: 400 }
    );
  }

  const input = parsed.data;

  // Check honeypot (spam protection)
  if (input.honeypot) {
    return NextResponse.json(
      { message: "Spam detection triggered." },
      { status: 400 }
    );
  }

  // Validate booking time
  const preferredDate = new Date(input.preferredDateTime);
  if (preferredDate.getTime() < Date.now() + 10 * 60 * 1000) {
    return NextResponse.json(
      { message: "Please choose a time at least 10 minutes in the future." },
      { status: 400 }
    );
  }

  // Process the booking
  const result = await processBooking({
    dealershipName: input.dealershipName,
    brand: input.brand,
    contactPerson: input.contactPerson,
    phone: input.phone,
    email: input.email,
    province: input.province,
    city: input.city,
    preferredDateTime: input.preferredDateTime,
    notes: input.notes,
    source: input.source
  });

  // Handle failure
  if (!result.success) {
    return NextResponse.json(
      { message: result.error },
      { status: 500 }
    );
  }

  // Success! Generate WhatsApp confirmation link
  const whatsappConfirmationUrl = waLink(
    input.phone,
    `Hi ${input.contactPerson}, thank you for booking with AUTORA! Your 15-minute Dealer Lead Audit for ${
      input.dealershipName
    } is scheduled for ${new Date(input.preferredDateTime).toLocaleString("en-ZA", {
      dateStyle: "full",
      timeStyle: "short"
    })}. We'll send you a confirmation email shortly.`
  );

  // Return success response
  return NextResponse.json({
    success: true,
    bookingId: result.bookingId,
    message: result.savedToDatabase
      ? "Booking confirmed! Check your email for details."
      : "Booking request received! We'll confirm via email shortly.",
    booking: {
      dealershipName: input.dealershipName,
      brand: input.brand,
      contactPerson: input.contactPerson,
      preferredDateTime: input.preferredDateTime
    },
    whatsappConfirmationUrl,
    metadata: {
      emailSent: result.emailSent,
      savedToDatabase: result.savedToDatabase
    }
  });
}
