import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Case Studies"
};

const placeholders = [
  {
    title: "Chery Group Campaign",
    highlight: "+37% qualified leads",
    summary: "Placeholder: campaign architecture and WhatsApp qualification improvements."
  },
  {
    title: "Haval Multi-Branch Rollout",
    highlight: "2.1x faster response",
    summary: "Placeholder: branch-level routing and lead speed optimization results."
  },
  {
    title: "BYD Launch Push",
    highlight: "Lower CPL, stronger bookings",
    summary: "Placeholder: launch funnel testing and conversion-focused landing pages."
  }
] as const;

export default function CaseStudiesPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Case Studies</p>
        <h1 className="mt-2 text-4xl font-semibold text-coal md:text-5xl">Proof framework (results coming soon)</h1>
        <p className="mt-4 text-base text-steel">
          We are actively building measurable dealership case studies. Cards below are placeholders for upcoming live outcomes.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {placeholders.map((study) => (
          <article key={study.title} className="rounded-2xl border border-steel/12 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.15em] text-tide">Placeholder</p>
            <h2 className="mt-2 text-xl font-semibold text-coal">{study.title}</h2>
            <p className="mt-2 text-sm font-semibold text-ember">{study.highlight}</p>
            <p className="mt-3 text-sm text-steel">{study.summary}</p>
          </article>
        ))}
      </section>

      <CtaBanner />
    </div>
  );
}
