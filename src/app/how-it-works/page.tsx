import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "How It Works",
  description:
    "See how AUTORA OS connects lead sources, centralizes conversations, prioritizes urgency, executes bookings, and measures revenue risk.",
  path: "/how-it-works"
});

const workflow = [
  {
    step: "01",
    title: "Connect your lead sources",
    detail: "Website forms, Meta, Google, OEM feeds, and WhatsApp Cloud API feed one governed operating queue."
  },
  {
    step: "02",
    title: "Centralize conversations",
    detail: "All enquiries appear in one shared inbox so sales and BDC teams work from one version of the truth."
  },
  {
    step: "03",
    title: "Prioritize urgency",
    detail: "SLA timers and risk scoring determine what must happen next, by who, and how quickly."
  },
  {
    step: "04",
    title: "Execute bookings",
    detail: "Confirm, reschedule, remind, and close opportunities with a full audit trail instead of scattered follow-up."
  },
  {
    step: "05",
    title: "Measure impact",
    detail: "Revenue at risk, breach trends, and executive reporting show where response discipline is protecting revenue and where it is not."
  }
] as const;

export default function HowItWorksPage() {
  return (
    <div className="page-motion space-y-10">
      <section className="hero-panel relative overflow-hidden p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.15),transparent_45%),linear-gradient(112deg,#0b0c0d_0%,#111316_56%,#161a1f_100%)]" />
        <div className="relative z-10 max-w-3xl">
          <p className="section-kicker">How It Works</p>
          <h1 className="section-heading mt-4 text-balance text-4xl font-semibold md:text-5xl">
            One governed flow from enquiry to booking outcome
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/82">
            AUTORA OS turns response discipline into a measurable operating loop instead of leaving lead handling to disconnected systems and memory.
          </p>
        </div>
      </section>

      <section className="stagger-grid grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {workflow.map((item) => (
          <article key={item.step} className="surface-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">{item.step}</p>
            <h2 className="section-heading mt-2 text-xl font-semibold text-coal">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-steel">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="page-shell p-6">
        <h2 className="section-heading text-2xl font-semibold text-coal">Who works inside the flow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-steel/14 bg-white p-4">
            <p className="text-sm font-semibold text-coal">Sales and BDC</p>
            <p className="mt-2 text-sm text-steel">See assigned enquiries, next actions, and countdown pressure in one shared queue.</p>
          </div>
          <div className="rounded-xl border border-steel/14 bg-white p-4">
            <p className="text-sm font-semibold text-coal">Managers</p>
            <p className="mt-2 text-sm text-steel">Track handoffs, hot leads not booked, and breaches before revenue leakage compounds.</p>
          </div>
          <div className="rounded-xl border border-steel/14 bg-white p-4">
            <p className="text-sm font-semibold text-coal">Leadership</p>
            <p className="mt-2 text-sm text-steel">Measure store discipline, booking execution, and risk concentration with clear accountability.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/platform" eventName="cta_view_platform_click" eventParams={{ location: "how_it_works" }}>
            See Platform
          </ButtonLink>
          <ButtonLink href="/request-audit" variant="ghost" eventName="cta_request_audit_click" eventParams={{ location: "how_it_works" }}>
            Request Revenue Audit
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
