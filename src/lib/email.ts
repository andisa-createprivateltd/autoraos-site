/**
 * Email notification module for AUTORA booking and contact forms
 * 
 * Booking emails are sent to:
 * - Customer: Confirmation email with calendar invite (.ics file)
 * - Admin: Full booking details sent to ADMIN_EMAIL (andisa@createprivateltd.com)
 * 
 * Requires:
 * - SENDGRID_API_KEY: SendGrid API key for email delivery
 * - ADMIN_EMAIL: Recipient for booking notifications (andisa@createprivateltd.com)
 */
import sgMail from "@sendgrid/mail";
import { env } from "@/lib/env";
import { AUTORA_WHATSAPP, PARENT_COMPANY_NAME, PLATFORM_NAME } from "@/lib/constants";
import { formatDateTime, waLink } from "@/lib/utils";

function isEmailReady() {
  return Boolean(env.SENDGRID_API_KEY && env.ADMIN_EMAIL);
}

export async function sendBookingEmails(payload: {
  bookingId: string;
  dealershipName: string;
  brand: string;
  contactPerson: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  preferredDateTime: string;
  inviteIcs: string;
}) {
  if (!isEmailReady()) {
    console.warn("Email not configured. Skipping email notifications. Set SENDGRID_API_KEY and ADMIN_EMAIL to enable.");
    return;
  }

  try {
    sgMail.setApiKey(env.SENDGRID_API_KEY as string);

    const prettyDate = formatDateTime(payload.preferredDateTime);

    const customerMsg = {
      to: payload.email,
      from: env.ADMIN_EMAIL as string,
      subject: "Your Dealer Lead Audit is booked",
      text: [
        `Hi ${payload.contactPerson},`,
        "",
        `Your 15-minute Dealer Lead Audit is booked for ${prettyDate}.`,
        `Dealership: ${payload.dealershipName} (${payload.brand})`,
        "",
        "Reply to this email if you need to reschedule.",
        "",
        `${PLATFORM_NAME} (${PARENT_COMPANY_NAME})`
      ].join("\n"),
      attachments: [
        {
          content: Buffer.from(payload.inviteIcs).toString("base64"),
          filename: "dealer-lead-audit.ics",
          type: "text/calendar",
          disposition: "attachment"
        }
      ]
    };

    // Admin notification with all booking details
    // Recipient is configured via ADMIN_EMAIL environment variable (should be andisa@createprivateltd.com)
    const adminMsg = {
      to: env.ADMIN_EMAIL as string,
      from: env.ADMIN_EMAIL as string,
      subject: `New Audit Booking: ${payload.dealershipName}`,
      text: [
        `Booking ID: ${payload.bookingId}`,
        `Dealership: ${payload.dealershipName}`,
        `Brand: ${payload.brand}`,
        `Contact: ${payload.contactPerson}`,
        `Phone: ${payload.phone}`,
        `Email: ${payload.email}`,
        `Location: ${payload.city}, ${payload.province}`,
        `Preferred time: ${prettyDate}`,
        `WhatsApp follow-up: ${waLink(AUTORA_WHATSAPP, `New booking ${payload.bookingId} - ${payload.dealershipName}`)}`
      ].join("\n")
    };

    await Promise.all([sgMail.send(customerMsg), sgMail.send(adminMsg)]);
    console.log(`Booking emails sent successfully for booking ${payload.bookingId}`);
  } catch (error) {
    console.error("Failed to send booking emails:", error);
    // Don't throw - let the caller handle email failure gracefully
  }
}

/**
 * Send booking notification via email only (no database required)
 * This is a fallback mode when Supabase is not configured
 */
export async function sendSimpleBookingEmail(payload: {
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
}) {
  if (!isEmailReady()) {
    console.error("Cannot send simple booking email: Email not configured");
    throw new Error("Email system not configured. Set SENDGRID_API_KEY and ADMIN_EMAIL.");
  }

  try {
    sgMail.setApiKey(env.SENDGRID_API_KEY as string);
    
    const prettyDate = formatDateTime(payload.preferredDateTime);
    const timestamp = new Date().toISOString();

    // Send to admin with all details
    const adminMsg = {
      to: env.ADMIN_EMAIL as string,
      from: env.ADMIN_EMAIL as string,
      subject: `[EMAIL-ONLY MODE] NEW BOOKING: ${payload.dealershipName}`,
      text: [
        `[ALERT] BOOKING RECEIVED (Database not available - Email-only mode)`,
        ``,
        `Timestamp: ${timestamp}`,
        `Dealership: ${payload.dealershipName}`,
        `Brand: ${payload.brand}`,
        `Contact: ${payload.contactPerson}`,
        `Phone: ${payload.phone}`,
        `Email: ${payload.email}`,
        `Location: ${payload.city}, ${payload.province}`,
        `Preferred time: ${prettyDate}`,
        `Source: ${payload.source || "website"}`,
        `Notes: ${payload.notes || "None"}`,
        ``,
        `[ACTION REQUIRED] This booking was not saved to database.`,
        `Please follow up with the customer directly.`,
        ``,
        `WhatsApp link: ${waLink(AUTORA_WHATSAPP, `Follow up on booking request from ${payload.dealershipName}`)}`,
        ``,
        `To enable full booking functionality with database storage,`,
        `configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.`
      ].join("\n")
    };

    // Send simple confirmation to customer
    const customerMsg = {
      to: payload.email,
      from: env.ADMIN_EMAIL as string,
      subject: "Booking Request Received - AUTORA",
      text: [
        `Hi ${payload.contactPerson},`,
        "",
        `Thank you for your booking request for ${payload.dealershipName}.`,
        `We have received your request for ${prettyDate}.`,
        "",
        `Our team will contact you shortly to confirm your appointment.`,
        `If you need immediate assistance, please contact us via WhatsApp.`,
        "",
        `${PLATFORM_NAME} (${PARENT_COMPANY_NAME})`
      ].join("\n")
    };

    await Promise.all([sgMail.send(adminMsg), sgMail.send(customerMsg)]);
    console.log(`Simple booking email sent for ${payload.dealershipName}`);
  } catch (error) {
    console.error("Failed to send simple booking email:", error);
    throw new Error("Email delivery failed");
  }
}

export async function sendContactNotification(payload: {
  contactPerson: string;
  email: string;
  phone: string;
  dealershipName?: string;
  message: string;
}) {
  if (!isEmailReady()) return;

  sgMail.setApiKey(env.SENDGRID_API_KEY as string);

  await sgMail.send({
    to: env.ADMIN_EMAIL as string,
    from: env.ADMIN_EMAIL as string,
    subject: `New Contact Lead: ${payload.contactPerson}`,
    text: [
      `Name: ${payload.contactPerson}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      payload.dealershipName ? `Dealership: ${payload.dealershipName}` : "Dealership: n/a",
      "",
      payload.message
    ].join("\n")
  });
}
