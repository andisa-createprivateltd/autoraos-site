import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { AUTORA_WHATSAPP, PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <section className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Contact</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Speak with {PLATFORM_NAME}</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-steel">
          Share your dealership response and conversion targets. We will reply with practical platform-fit next steps.
        </p>

        <a
          href={`https://wa.me/${AUTORA_WHATSAPP}?text=${encodeURIComponent("Hi AUTORA, I need help with dealership leads.")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-black"
        >
          Chat on WhatsApp
        </a>
      </section>

      <section>
        <ContactForm />
      </section>
    </div>
  );
}
