import { AUTORA_WHATSAPP } from "@/lib/constants";

export function WhatsAppFloat() {
  const text = encodeURIComponent("Hi AUTORA, I want more test-drive leads.");
  const href = `https://wa.me/${AUTORA_WHATSAPP}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center rounded-full bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-black shadow-soft transition hover:translate-y-[-2px] sm:px-4 sm:py-3 sm:text-sm"
      aria-label="Chat on WhatsApp"
    >
      Chat on WhatsApp
    </a>
  );
}
