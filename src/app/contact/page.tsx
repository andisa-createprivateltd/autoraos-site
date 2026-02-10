import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { AUTORA_WHATSAPP, PLATFORM_NAME, PLATFORM_SUBSIDIARY_LINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <section className="max-w-2xl space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-tide">Contact</p>
          <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Speak with {PLATFORM_NAME}</h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-steel">
            Share your dealership response and conversion targets. We will reply with practical platform-fit next steps.
          </p>
        </div>

        <div className="rounded-2xl border border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/5 to-white p-6">
          <p className="text-sm font-semibold text-coal">Prefer WhatsApp?</p>
          <p className="mt-2 text-sm text-steel">Start a conversation now for immediate response.</p>
          <a
            href={`https://wa.me/${AUTORA_WHATSAPP}?text=${encodeURIComponent("Hi AUTORA, I need help with dealership leads.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#20BA5A]"
          >
            Chat on WhatsApp
          </a>
        </div>

        <p className="text-xs text-steel">{PLATFORM_SUBSIDIARY_LINE}</p>
      </section>

      <section>
        <ContactForm />
      </section>
    </div>
  );
}
