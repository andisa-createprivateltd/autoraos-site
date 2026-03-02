import sgMail from "@sendgrid/mail";
import { env } from "@/lib/env";
import { AUTORA_WHATSAPP, PLATFORM_NAME } from "@/lib/constants";
import { formatDateTime, waLink } from "@/lib/utils";

function isEmailReady() {
  return Boolean(env.SENDGRID_API_KEY && env.ADMIN_EMAIL);
}

function parseEmailList(value?: string) {
  if (!value) return [];
  return value
    .split(/[,\n;]/g)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getContactAlertRecipients() {
  const set = new Set<string>();
  if (env.ADMIN_EMAIL) {
    set.add(env.ADMIN_EMAIL.trim().toLowerCase());
  }

  for (const email of parseEmailList(env.CONTACT_ALERT_EMAILS)) {
    set.add(email);
  }

  return Array.from(set);
}

function getMailFromAddress() {
  if (env.EMAIL_FROM) return env.EMAIL_FROM;
  if (env.ADMIN_EMAIL) return env.ADMIN_EMAIL;
  return null;
}

function normalizeWhatsappPhone(value?: string) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 ? digits : null;
}

async function sendWhatsAppAdminAlert(text: string) {
  const token = env.META_CLOUD_API_TOKEN;
  const phoneNumberId = env.META_WHATSAPP_PHONE_NUMBER_ID;
  const recipient = normalizeWhatsappPhone(env.CONTACT_ALERT_WHATSAPP || env.ADMIN_EMAIL);

  if (!token || !phoneNumberId || !recipient) return;

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipient,
      type: "text",
      text: {
        preview_url: false,
        body: text
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`WhatsApp admin alert failed: ${message}`);
  }
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
    subject: "Your Revenue Audit is booked",
    text: [
      `Hi ${payload.contactPerson},`,
      "",
      `Your 15-minute Revenue Audit is booked for ${prettyDate}.`,
      `Dealership: ${payload.dealershipName} (${payload.brand})`,
      "",
      "Reply to this email if you need to reschedule.",
      "",
      `${PLATFORM_NAME} OS`
    ].join("\n"),
    attachments: [
      {
        content: Buffer.from(payload.inviteIcs).toString("base64"),
        filename: "autora-revenue-audit.ics",
        type: "text/calendar",
        disposition: "attachment"
      }
    ]
  };

  const adminMsg = {
    to: env.ADMIN_EMAIL as string,
    from: env.ADMIN_EMAIL as string,
    subject: `New Revenue Audit Booking: ${payload.dealershipName}`,
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
}

export async function sendContactNotification(payload: {
  email: string;
  phone: string;
  dealershipName: string;
  role: string;
  groupSize: string;
  message: string;
}) {
  const tasks: Promise<unknown>[] = [];
  const recipients = getContactAlertRecipients();
  const fromAddress = getMailFromAddress();

  if (env.SENDGRID_API_KEY && fromAddress && recipients.length > 0) {
    sgMail.setApiKey(env.SENDGRID_API_KEY);

    const subject = `New Contact Lead: ${payload.dealershipName}`;
    const text = [
      `Dealership / Group: ${payload.dealershipName}`,
      `Role: ${payload.role}`,
      `Group size: ${payload.groupSize}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      "",
      payload.message
    ].join("\n");

    for (const to of recipients) {
      tasks.push(
        sgMail.send({
          to,
          from: fromAddress,
          subject,
          replyTo: payload.email,
          text
        })
      );
    }
  }

  const whatsappAlert = [
    "New contact submission",
    `Dealer: ${payload.dealershipName}`,
    `Role: ${payload.role}`,
    `Group size: ${payload.groupSize}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Message: ${payload.message.slice(0, 600)}`
  ].join("\n");

  tasks.push(sendWhatsAppAdminAlert(whatsappAlert).catch(() => undefined));

  if (!tasks.length) return;
  await Promise.all(tasks);
}
