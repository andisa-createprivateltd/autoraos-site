import { ButtonLink } from "@/components/ui/button-link";
import { CtaBanner } from "@/components/cta-banner";
import {
  HOW_IT_WORKS,
  PLATFORM_NAME,
  SOCIAL_PROOF_PLACEHOLDERS
} from "@/lib/constants";

const strategicPoints = [
  "We own the WhatsApp layer",
  "We see conversion data OEMs do not",
  "We are embedded in operations, not optional software",
  "Switching costs are operational, not technical"
] as const;

const quickSignals = [
  { label: "Lead response target", value: "< 60 sec" },
  { label: "Booking workflow", value: "Built-in" },
  { label: "Dealer focus", value: "Chinese brands" }
] as const;

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="hero-panel p-8 md:p-12">
        <p className="relative z-10 section-kicker">{PLATFORM_NAME}</p>

        <h1 className="relative z-10 mt-6 max-w-3xl text-balance text-4xl font-semibold text-ink md:text-5xl">
          More Test Drives. Faster Responses. Fewer Missed Leads.
        </h1>

        <p className="relative z-10 mt-5 max-w-2xl text-pretty text-base leading-relaxed text-steel md:text-lg">
          WhatsApp + lead operating system built for dealership sales teams. Centralize enquiries, respond in seconds, and turn leads into booked test drives—without operational chaos.
        </p>
        <p className="relative z-10 mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-steel">
          Optional growth add-on available after onboarding (paid demand).
        </p>
        <p className="relative z-10 mt-3 inline-flex rounded-full border border-steel/16 bg-mist/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-steel">
          Private beta now onboarding dealership partners in Gauteng
        </p>

        <div className="relative z-10 mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/book">Book Free 15-Minute Dealer Audit</ButtonLink>
          <ButtonLink href="/pricing" variant="ghost">
            View Platform Pricing
          </ButtonLink>
        </div>

        <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
          {quickSignals.map((signal) => (
            <div key={signal.label} className="rounded-2xl border border-steel/12 bg-mist/45 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.12em] text-steel">{signal.label}</p>
              <p className="mt-1 text-lg font-semibold text-coal">{signal.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {SOCIAL_PROOF_PLACEHOLDERS.map((item) => (
          <article key={item} className="surface-card p-5">
            <p className="text-sm text-coal">{item}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-6">
          <p className="section-kicker">How AUTORA Works</p>
          <h2 className="mt-2 max-w-2xl text-balance text-3xl font-semibold text-coal">Built for revenue control, not vanity dashboards</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, idx) => (
            <article key={step.title} className="surface-card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-coal text-sm font-semibold text-white">
                {idx + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-coal">{step.title}</h3>
              <p className="mt-2 text-sm text-steel">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card p-7">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Why {PLATFORM_NAME}</p>
        <h2 className="mt-2 max-w-2xl text-balance text-3xl font-semibold text-coal">Infrastructure positioning for dealerships and investors</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {strategicPoints.map((point) => (
            <p key={point} className="rounded-2xl border border-steel/10 bg-mist/55 px-4 py-3 text-sm text-coal">
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
