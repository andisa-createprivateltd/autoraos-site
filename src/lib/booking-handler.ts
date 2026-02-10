/**
 * Simplified Booking Handler
 * 
 * This module provides a clean, reliable booking process that:
 * 1. Always accepts bookings via email
 * 2. Optionally stores in database if available
 * 3. Never fails the user due to technical issues
 * 
 * Philosophy: Email is the primary channel, database is an enhancement
 */

import { sendSimpleBookingEmail } from "@/lib/email";
import { hasSupabase } from "@/lib/env";
import { getSupabaseClient } from "@/lib/supabase";
import {
  bookingLeadStatus,
  captureLeadThread,
  ensureDealerAccount,
  mapLeadSource
} from "@/lib/beta-capture";

export type BookingData = {
  dealershipName: string;
  brand: string;
  contactPerson: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  preferredDateTime: string;
  notes?: string;
  source?: string;
};

export type BookingResult = {
  success: true;
  bookingId: string;
  savedToDatabase: boolean;
  emailSent: boolean;
};

export type BookingError = {
  success: false;
  error: string;
  details?: string;
};

/**
 * Process a booking with email-first approach
 * This function ALWAYS attempts to send email first, then optionally saves to database
 */
export async function processBooking(data: BookingData): Promise<BookingResult | BookingError> {
  const bookingId = generateBookingId();
  let emailSent = false;
  let savedToDatabase = false;

  // Step 1: ALWAYS send email notification (primary channel)
  try {
    await sendSimpleBookingEmail({
      dealershipName: data.dealershipName,
      brand: data.brand,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      province: data.province,
      city: data.city,
      preferredDateTime: data.preferredDateTime,
      notes: data.notes,
      source: data.source
    });
    emailSent = true;
    console.log(`✓ Booking email sent for ${bookingId}`);
  } catch (emailError) {
    console.error(`✗ Email sending failed for ${bookingId}:`, emailError);
    // Email failure is critical - we can't accept booking without notification
    return {
      success: false,
      error: "Could not send booking notification. Please try again or contact us via WhatsApp.",
      details: emailError instanceof Error ? emailError.message : "Unknown email error"
    };
  }

  // Step 2: Optionally save to database (enhancement, not required)
  if (hasSupabase()) {
    try {
      await saveBookingToDatabase(data, bookingId);
      savedToDatabase = true;
      console.log(`✓ Booking saved to database: ${bookingId}`);
    } catch (dbError) {
      // Database failure is non-critical - booking already accepted via email
      console.error(`✗ Database save failed for ${bookingId} (non-critical):`, dbError);
      // Continue - booking is still successful because email was sent
    }
  } else {
    console.log(`ℹ Database not configured - booking ${bookingId} is email-only`);
  }

  return {
    success: true,
    bookingId,
    savedToDatabase,
    emailSent
  };
}

/**
 * Save booking to database (optional enhancement)
 */
async function saveBookingToDatabase(data: BookingData, bookingId: string): Promise<void> {
  const supabase = getSupabaseClient();

  // Create dealer account
  const dealerId = await ensureDealerAccount(supabase, {
    dealershipName: data.dealershipName,
    brand: data.brand,
    city: data.city,
    plan: "growth"
  });

  // Check for existing booking at this time
  const { data: existing, error: existingError } = await supabase
    .from("bookings")
    .select("id")
    .eq("scheduled_for", data.preferredDateTime)
    .in("status", ["booked", "completed"])
    .limit(1);

  if (existingError) {
    throw new Error(`Database check failed: ${existingError.message}`);
  }

  if (existing?.length) {
    // Slot already booked - this is informational, not critical
    console.warn(`Slot ${data.preferredDateTime} already booked, but email already sent`);
    // Don't throw - booking email was sent, admin will handle conflict
    return;
  }

  // Create lead and conversation
  const leadCapture = await captureLeadThread(supabase, {
    dealerId,
    source: mapLeadSource(data.source),
    name: data.contactPerson,
    phone: data.phone,
    vehicleInterest: data.brand,
    status: bookingLeadStatus(),
    leadMessage: data.notes || `Booking request for ${data.dealershipName}.`,
    responseMessage: "Booking confirmed via email.",
    aiEventType: "booking"
  });

  // Create booking record
  const { error: insertError } = await supabase
    .from("bookings")
    .insert({
      id: bookingId,
      dealer_id: dealerId,
      lead_id: leadCapture.leadId,
      type: "appointment",
      requested_at: new Date().toISOString(),
      scheduled_for: data.preferredDateTime,
      status: "booked",
      created_by: "human"
    });

  if (insertError) {
    throw new Error(`Database insert failed: ${insertError.message}`);
  }
}

/**
 * Generate a unique booking ID
 */
function generateBookingId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `booking-${timestamp}-${random}`;
}
