import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { CREATEPRIVATE_WHATSAPP } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <section>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Contact</p>
        <h1 className="mt-2 text-4xl font-semibold text-coal md:text-5xl">Speak with CreatePrivate Dealer OS</h1>
        <p className="mt-4 text-base text-steel">
          Share your dealership response and conversion targets. We will reply with practical platform-fit next steps.
        </p>

        <a
          href={`https://wa.me/${CREATEPRIVATE_WHATSAPP}?text=${encodeURIComponent("Hi CreatePrivateLtd, I need help with dealership leads.")}`}
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
