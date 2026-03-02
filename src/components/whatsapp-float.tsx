import { AUTORA_WHATSAPP } from "@/lib/constants";

export function WhatsAppFloat() {
  const text = encodeURIComponent("Hi AUTORA, I need help with revenue governance rollout.");
  const href = `https://wa.me/${AUTORA_WHATSAPP}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="float-bob fixed bottom-5 right-5 z-40 inline-flex items-center rounded-full border border-black/20 bg-white px-4 py-3 text-sm font-semibold text-coal shadow-soft transition hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-black"
      aria-label="WhatsApp support"
    >
      WhatsApp Support
    </a>
  );
}
