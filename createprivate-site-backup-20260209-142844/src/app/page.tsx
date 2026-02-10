import { ButtonLink } from "@/components/ui/button-link";
import { CtaBanner } from "@/components/cta-banner";
import { HOW_IT_WORKS, SOCIAL_PROOF_PLACEHOLDERS } from "@/lib/constants";

const strategicPoints = [
  "We own the WhatsApp layer",
  "We see conversion data OEMs do not",
  "We are embedded in operations, not optional software",
  "Switching costs are operational, not technical"
] as const;

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-steel/15 bg-white p-8 shadow-soft md:p-12">
        <div className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden />
        <div className="absolute bottom-[-90px] left-[-60px] h-60 w-60 rounded-full bg-tide/20 blur-3xl" aria-hidden />

        <p className="relative z-10 inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-tide">
          CreatePrivate Dealer OS
        </p>

        <h1
          className="relative z-10 mt-6 max-w-4xl text-4xl leading-tight text-ink md:text-6xl"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          The Operating System for Dealership Leads & WhatsApp Sales
        </h1>

        <p className="relative z-10 mt-5 max-w-3xl text-base text-steel md:text-lg">
          Generate leads, respond instantly, and convert more test drives from one platform built for Chinese vehicle dealerships in South Africa.
        </p>

        <div className="relative z-10 mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/book">Book Free 15-Minute Dealer Lead Audit</ButtonLink>
          <ButtonLink href="/pricing" variant="ghost">
            View Platform Pricing
          </ButtonLink>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {SOCIAL_PROOF_PLACEHOLDERS.map((item) => (
          <article key={item} className="rounded-2xl border border-steel/12 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-tide">Operational Outcome</p>
            <p className="mt-2 text-sm text-coal">{item}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.15em] text-tide">How Dealer OS Works</p>
          <h2 className="mt-2 text-3xl font-semibold text-coal">Built for revenue control, not vanity dashboards</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, idx) => (
            <article key={step.title} className="rounded-2xl border border-steel/12 bg-white p-6 shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coal text-sm font-semibold text-white">
                {idx + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-coal">{step.title}</h3>
              <p className="mt-2 text-sm text-steel">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-steel/15 bg-white p-7 shadow-sm">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Why CreatePrivate</p>
        <h2 className="mt-2 text-3xl font-semibold text-coal">Infrastructure positioning for dealerships and investors</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {strategicPoints.map((point) => (
            <p key={point} className="rounded-2xl border border-steel/10 bg-mist/35 px-4 py-3 text-sm text-coal">
              {point}
            </p>
          ))}
        </div>
        <div className="mt-5">
          <ButtonLink href="/founder-narrative" variant="secondary">
            Read Founder Narrative
          </ButtonLink>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
