import { addMinutes } from "date-fns";

function formatICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function createAuditInvite(details: {
  uid: string;
  startISO: string;
  dealershipName: string;
  contactPerson: string;
}) {
  const start = new Date(details.startISO);
  const end = addMinutes(start, 15);
  const dtstamp = formatICSDate(new Date());
  const dtstart = formatICSDate(start);
  const dtend = formatICSDate(end);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CreatePrivateLtd//Dealer Audit//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${details.uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    "SUMMARY:CreatePrivateLtd - 15 Minute Dealer Lead Audit",
    `DESCRIPTION:Audit for ${details.dealershipName} (${details.contactPerson}).`,
    "LOCATION:Google Meet / Phone (details sent by CreatePrivateLtd)",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
