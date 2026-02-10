import sgMail from "@sendgrid/mail";
import { env } from "@/lib/env";
import { formatDateTime, waLink } from "@/lib/utils";
import { CREATEPRIVATE_WHATSAPP } from "@/lib/constants";

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
  if (!isEmailReady()) return;

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
      "CreatePrivateLtd"
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
      `WhatsApp follow-up: ${waLink(CREATEPRIVATE_WHATSAPP, `New booking ${payload.bookingId} - ${payload.dealershipName}`)}`
    ].join("\n")
  };

  await Promise.all([sgMail.send(customerMsg), sgMail.send(adminMsg)]);
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
