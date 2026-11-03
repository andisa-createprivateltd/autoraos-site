import type { Metadata } from "next";
import { EditorialHero } from "@/components/marketing/editorial-hero";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "How It Works",
  description:
    "See how AUTORA OS connects lead sources, centralizes conversations, prioritizes urgency, executes bookings, and measures revenue risk.",
  path: "/how-it-works"
});

const workflow = [
  ["01", "Connect your lead sources", "Website forms, Meta, Google, OEM feeds, and WhatsApp Cloud API feed one governed operating queue."],
  ["02", "Centralize conversations", "All enquiries appear in one shared inbox so sales and BDC teams work from one version of the truth."],
  ["03", "Prioritize urgency", "SLA timers and risk scoring determine what must happen next, by who, and how quickly."],
  ["04", "Execute bookings", "Confirm, reschedule, remind, and close opportunities with a full audit trail instead of scattered follow-up."],
  ["05", "Measure impact", "Revenue at risk, breach trends, and executive reporting show where response discipline is protecting revenue and where it is not."]
] as const;

const roles = [
  ["Sales and BDC", "See assigned enquiries, next actions, and countdown pressure in one shared queue."],
  ["Managers", "Track handoffs, hot leads not booked, and breaches before revenue leakage compounds."],
  ["Leadership", "Measure store discipline, booking execution, and risk concentration with clear accountability."]
] as const;

export default function HowItWorksPage() {
  return (
    <div className="volvo-page">
      <EditorialHero
        eyebrow="Operating model / enquiry to outcome"
        title={<>One governed flow from enquiry<br /><em>to booking outcome.</em></>}
        intro="AUTORA OS turns response discipline into a measurable operating loop instead of leaving lead handling to disconnected systems and memory."
        detail="The system follows the opportunity through capture, ownership, escalation, booking, confirmation, and review. Each transition has a visible owner."
        actions={
          <>
            <ButtonLink href="/platform" eventName="cta_view_platform_click" eventParams={{ location: "how_it_works" }}>View operations</ButtonLink>
            <ButtonLink href="/request-audit" variant="ghost" eventName="cta_request_audit_click" eventParams={{ location: "how_it_works" }}>Request revenue audit</ButtonLink>
          </>
        }
      />

      <section className="volvo-section volvo-section--paper">
        <div className="volvo-container">
          <div className="volvo-section-heading">
            <div>
              <p className="volvo-overline">01 / The operating loop</p>
              <h2>Execution is governed at every handoff.</h2>
            </div>
            <p className="volvo-copy">
              The operating model is deliberately simple: capture the demand, assign the next action, enforce the response window, and carry the booking through to attendance.
            </p>
          </div>
          <ScrollReveal className="volvo-flow-grid">
            {workflow.map(([step, title, detail]) => (
              <article key={step}>
                <span>{step}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="volvo-section volvo-section--white">
        <div className="volvo-container">
          <div className="volvo-section-heading">
            <div>
              <p className="volvo-overline">02 / Accountability</p>
              <h2>Every role works inside the same control model.</h2>
            </div>
            <p className="volvo-copy">
              AUTORA is designed around operational responsibility, not a generic user list. Each team sees the pressure it owns and the decision it needs to make next.
            </p>
          </div>
          <ScrollReveal className="volvo-role-grid">
            {roles.map(([title, detail], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
