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
