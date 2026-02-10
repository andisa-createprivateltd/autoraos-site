import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Case Studies"
};

const caseStudies = [
  {
    title: "Chery Group Campaign",
    highlight: "+37% qualified leads",
    summary: "Campaign architecture and WhatsApp qualification improvements delivered measurable lead quality gains across multiple dealership locations."
  },
  {
    title: "Haval Multi-Branch Rollout",
    highlight: "2.1x faster response",
    summary: "Branch-level routing and lead speed optimization resulted in sub-60-second average response times across the dealership network."
  },
  {
    title: "BYD Launch Push",
    highlight: "Lower CPL, stronger bookings",
    summary: "Launch funnel testing and conversion-focused landing pages reduced cost per lead while increasing booking conversion rates."
  }
] as const;

export default function CaseStudiesPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Case Studies</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Real-World Dealership Outcomes</h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-steel">
          See how automotive dealerships are using AUTORA to improve lead response times, increase bookings, and drive more showroom traffic.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {caseStudies.map((study) => (
          <article key={study.title} className="rounded-2xl border border-steel/12 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.15em] text-tide">Case Study</p>
            <h2 className="mt-2 text-balance text-xl font-semibold text-coal">{study.title}</h2>
            <p className="mt-2 text-sm font-semibold text-ember">{study.highlight}</p>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-steel">{study.summary}</p>
          </article>
        ))}
      </section>

      <CtaBanner />
    </div>
  );
}
