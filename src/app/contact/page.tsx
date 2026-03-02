import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { AUTORA_WHATSAPP } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Request a revenue audit, ask an implementation question, or speak to the AUTORA OS team about dealership lead discipline and WhatsApp operations.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <div className="page-motion space-y-8">
      <section className="panel-dark p-7 md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-white/68">Contact</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
          Speak with the AUTORA OS team
        </h1>
        <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/78">
          Use this form for audit requests, rollout questions, and enterprise deployment discussions.
        </p>
      </section>

      <div className="stagger-grid grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="page-shell p-6">
          <h2 className="section-heading text-lg font-semibold text-coal">Contact paths</h2>
          <div className="mt-5 space-y-4 text-sm text-steel">
            <div className="rounded-2xl border border-steel/14 bg-white p-4">
              <p className="font-semibold text-coal">Revenue audit</p>
              <p className="mt-2">For a structured review of enquiry flow, SLA gaps, booking execution, and rollout readiness.</p>
            </div>
            <div className="rounded-2xl border border-steel/14 bg-white p-4">
              <p className="font-semibold text-coal">Enterprise deployment</p>
              <p className="mt-2">For dealer groups, governance rollouts, and multi-store implementation planning.</p>
            </div>
            <div className="rounded-2xl border border-steel/14 bg-white p-4">
              <p className="font-semibold text-coal">WhatsApp support</p>
              <p className="mt-2">Use WhatsApp for quick coordination during business hours.</p>
              <a
                href={`https://wa.me/${AUTORA_WHATSAPP}?text=${encodeURIComponent("Hi AUTORA OS, I need help with dealership lead operations.")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full border border-black/15 bg-[#25D366] px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="section-heading text-lg font-semibold text-coal">Submit your request</h2>
          <p className="mt-2 text-sm text-steel">
            We use this information to route your request, estimate rollout scope, and respond with the right next step.
          </p>
          <div className="mt-4">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
