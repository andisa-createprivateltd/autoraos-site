import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "full",
    timeStyle: "short"
  });
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export function waLink(phone: string, message: string) {
  const normalized = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
