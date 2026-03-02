import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { PRICING_TIERS } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Enterprise",
  description:
    "AUTORA OS Enterprise standardizes lead handling, SLA governance, and executive reporting across dealership groups and multi-store networks.",
  path: "/enterprise"
});

type CapabilityCard = {
  title: string;
  what: string;
  why: string;
  operationalChanges: string[];
  executiveOutcome: string;
};

const heroOutcomes = [
  "SLA discipline across every store",
  "Margin protection through enforced response control",
  "Executive-level revenue reporting in real time"
] as const;

const enterpriseCapabilities: CapabilityCard[] = [
  {
    title: "Multi-Group Rollups",
    what: "A network command view that aggregates performance across groups, regions, brands, and stores in one governance layer.",
    why: "Group leadership needs enforcement reporting across the network, not disconnected store reports.",
    operationalChanges: [
      "Cross-store performance aggregation by region and brand",
      "Revenue-at-risk calculation by store and group",
      "Response-time ranking with leadership-level accountability",
      "Booking conversion tracking across network cohorts",
      "Network heatmaps for breach concentration and leakage patterns"
    ],
    executiveOutcome: "Leadership can identify where revenue leakage is concentrated and intervene by store, manager, and group."
  },
  {
    title: "Network SLA Governance",
    what: "An automated SLA enforcement engine that executes policy thresholds, escalations, and ownership rules at scale.",
    why: "In multi-store operations, advisory alerts are ignored. Enforcement must be automated and measurable.",
    operationalChanges: [
      "Custom SLA thresholds by policy (5 min, 10 min, 15 min)",
      "Store-level SLA performance tracking with breach accountability",
      "Escalation ladder execution from sales to manager to group",
      "Revenue-at-risk tagging tied to SLA state",
      "Escalation timers and auto-reassignment logic"
    ],
    executiveOutcome: "Response discipline becomes system-enforced and no longer depends on individual manager consistency."
  },
  {
    title: "Margin Forecasting",
    what: "Forecast controls that connect response behavior, booking velocity, and pipeline state to margin outcomes.",
    why: "Forecast reliability fails when lead handling discipline is weak. AUTORA ties forecast to observed execution.",
    operationalChanges: [
      "Pipeline-based margin reporting by store and brand",
      "Booking probability modeling based on response behavior",
      "Lead-to-sale velocity tracking across cohorts",
      "Revenue-at-risk projection windows",
      "Brand-level margin review"
    ],
    executiveOutcome: "Finance and operations can trust forecast movement because it is linked to measurable response discipline."
  },
  {
    title: "OEM Reporting",
    what: "A reporting layer that packages operational performance into OEM-ready governance outputs.",
    why: "OEM relationships require consistent compliance evidence across dealerships and brands.",
    operationalChanges: [
      "Brand performance breakdown by dealership and region",
      "SLA compliance reporting by OEM program",
      "After-hours response performance tracking",
      "Network reporting packs for governance review",
      "Board-ready exports for leadership and OEM stakeholders"
    ],
    executiveOutcome: "AUTORA OS functions as the governance layer between OEM expectations and dealership execution."
  },
  {
    title: "Custom Rule Architecture",
    what: "A configurable policy framework for enterprise-specific enforcement models across stores and brands.",
    why: "Large networks require local flexibility without losing central governance control.",
    operationalChanges: [
      "Store-level rule configuration",
      "Brand-level overrides",
      "Escalation path customization",
      "AI routing control by policy scope",
      "Compliance policy layering from group to store"
    ],
    executiveOutcome: "Enterprise clients control enforcement architecture while maintaining network standardization."
  },
  {
    title: "Dedicated Success Manager",
    what: "A named enterprise implementation and performance lead responsible for operational adoption and governance outcomes.",
    why: "Enterprise rollout requires execution management across stores, teams, and leadership routines.",
    operationalChanges: [
      "Implementation lead for phased deployment",
      "SLA optimization support and rule tuning",
      "Structured performance reviews with leadership",
      "Quarterly governance planning cycles",
      "Multi-store rollout strategy and adoption checkpoints"
    ],
    executiveOutcome: "Enterprise clients are deployed through managed governance programs, not self-serve configuration."
  }
];

const governancePillars = [
  {
    title: "Pillar 1 - Enforcement",
    items: [
      "Cross-store SLA compliance tracking",
      "Escalation ownership tracking",
      "AI urgency scoring",
      "Revenue-at-risk alerts",
      "Mandatory workflow steps"
    ],
    outcome: "Response discipline becomes non-optional."
  },
  {
    title: "Pillar 2 - Visibility",
    items: ["Executive dashboard", "Store ranking", "Heatmap performance", "Missed lead reporting", "After-hours audit tracking"],
    outcome: "Leadership sees operational leakage instantly."
  },
  {
    title: "Pillar 3 - Forecast Control",
    items: ["Booking pipeline intelligence", "Conversion performance tracking", "Margin modeling", "Response-time impact correlation"],
    outcome: "Revenue forecasting is tied to behavior, not assumptions."
  }
] as const;

const implementationPlan = [
  {
    day: "Days 1-7",
    title: "Workflow mapping",
    detail: "Audit lead sources, WhatsApp numbers, store ownership, booking pathways, and current SLA expectations."
  },
  {
    day: "Days 8-14",
    title: "Policy configuration",
    detail: "Set store routing, business hours, escalation ladders, quick replies, and manager reporting rules."
  },
  {
    day: "Days 15-21",
    title: "System activation",
    detail: "Connect messaging, booking, and reporting layers. Validate audit trails, isolation rules, and management workflows."
  },
  {
    day: "Days 22-30",
    title: "Operational rollout",
    detail: "Launch stores in sequence, tune SLA settings, and review the first governance report with leadership."
  }
] as const;

const dataIsolation = [
  "Store users are scoped to dealership-level data by row-level security.",
  "Group leadership sees only stores explicitly attached to their governance scope.",
  "Platform support actions are audited and do not expose platform keys to dealer teams.",
  "Audit logs capture routing changes, overrides, and booking state transitions across the network."
] as const;

const slaDefinitions = [
  "First response SLA: from inbound enquiry to first qualified team response within the configured policy window.",
  "Follow-up SLA: from latest customer reply to the next accountable team action when the customer is waiting.",
  "After-hours policy: pause, auto-acknowledge, or escalate at next open time based on the configured store rule.",
  "Recover-now queue: active breaches and near-breach opportunities that still require action today."
] as const;

const enterpriseTier = PRICING_TIERS.find((tier) => tier.name === "Enterprise Infrastructure");
const networkTier = PRICING_TIERS.find((tier) => tier.name === "OEM Network Deployment");

export default function EnterprisePage() {
  return (
    <div className="page-motion space-y-10 md:space-y-12">
      <section className="panel-dark p-7 md:p-9">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Enterprise</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
          Outcome-driven control for dealership groups and multi-store networks
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">
          AUTORA OS gives leadership one governance layer for lead handling, WhatsApp conversations, bookings, and SLA enforcement across 10 to 100+ stores.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-white/84">
          {heroOutcomes.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "enterprise_hero" }}>
            Request Revenue Audit
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" eventName="cta_contact_click" eventParams={{ location: "enterprise_hero" }}>
            Speak to Enterprise Team
          </ButtonLink>
        </div>
      </section>

      <section className="surface-card p-6 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-heading text-2xl font-semibold text-coal">Enterprise control includes</h2>
            <p className="mt-2 max-w-3xl text-sm text-steel">
              Each capability is tied to a concrete operating change and an executive outcome.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.12em] text-steel">
            Enterprise Infrastructure: {enterpriseTier?.price || "Custom deployment - typically R250,000+ / month"}
          </p>
        </div>

        <div className="stagger-grid mt-5 grid gap-4 xl:grid-cols-2">
          {enterpriseCapabilities.map((capability) => (
            <article key={capability.title} className="rounded-2xl border border-steel/14 bg-white p-5">
              <h3 className="text-lg font-semibold text-coal">{capability.title}</h3>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-steel">What it is</p>
              <p className="mt-1 text-sm text-steel">{capability.what}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-steel">Why it matters</p>
              <p className="mt-1 text-sm text-steel">{capability.why}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-steel">Operational change</p>
              <ul className="mt-1 space-y-1.5 text-sm text-steel">
                {capability.operationalChanges.map((item) => (
                  <li key={`${capability.title}-${item}`}>• {item}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-steel">Executive outcome</p>
              <p className="mt-1 text-sm font-medium text-coal">{capability.executiveOutcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell p-6 md:p-7">
        <h2 className="section-heading text-2xl font-semibold text-coal">The governance control layer</h2>
        <div className="stagger-grid mt-5 grid gap-4 xl:grid-cols-3">
          {governancePillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-steel/14 bg-white p-5">
              <h3 className="text-lg font-semibold text-coal">{pillar.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-steel">
                {pillar.items.map((item) => (
                  <li key={`${pillar.title}-${item}`}>• {item}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-coal">Outcome: {pillar.outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card p-6 md:p-7">
        <h2 className="section-heading text-2xl font-semibold text-coal">When 34 dealerships operate on one governance layer</h2>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-steel">
          AUTORA standardizes lead handling, escalation logic, and booking accountability across the network while preserving store-level execution ownership.
        </p>
        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <article className="rounded-2xl border border-steel/14 bg-white p-5">
            <h3 className="text-lg font-semibold text-coal">Network operating reality</h3>
            <ul className="mt-3 space-y-2 text-sm text-steel">
              <li>• Unified SLA standards across all stores</li>
              <li>• Centralized rule enforcement with local execution</li>
              <li>• Network-wide performance ranking by store and manager</li>
              <li>• Executive revenue-at-risk dashboard refreshed in real time</li>
              <li>• Cross-brand margin reporting for leadership review</li>
              <li>• Group-level WhatsApp governance and escalation controls</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-steel/14 bg-white p-5">
            <h3 className="text-lg font-semibold text-coal">Operational views</h3>
            <ul className="mt-3 space-y-2 text-sm text-steel">
              <li>• Group summary dashboard with SLA, risk, booking, and ranking views</li>
              <li>• Store drill-down by assignee ownership, queue delays, and escalation state</li>
              <li>• Revenue-at-risk heatmap by region and time window</li>
              <li>• Escalation trail from sales to manager to group on breach events</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="surface-card p-6 md:p-7">
          <h2 className="section-heading text-2xl font-semibold text-coal">30-day implementation path</h2>
          <div className="mt-4 space-y-4">
            {implementationPlan.map((item) => (
              <div key={item.day} className="rounded-2xl border border-steel/14 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-steel">{item.day}</p>
                <p className="mt-1 text-lg font-semibold text-coal">{item.title}</p>
                <p className="mt-2 text-sm text-steel">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6 md:p-7">
          <h2 className="section-heading text-2xl font-semibold text-coal">Data isolation model</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            {dataIsolation.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-lg font-semibold text-coal">SLA definitions</h3>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            {slaDefinitions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-shell p-6 md:p-7">
        <h2 className="section-heading text-2xl font-semibold text-coal">OEM Network Deployment</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-steel">
          For OEM programs and large dealer groups, this deployment layer adds policy design, program-specific reporting, and custom connector delivery without changing the governance model.
        </p>
        <p className="mt-3 text-sm font-semibold text-coal">{networkTier?.price || "Custom pricing"}</p>
      </section>

      <section className="panel-dark p-7 md:p-9">
        <h2 className="section-heading text-balance text-3xl font-semibold md:text-4xl">
          Built for leadership teams that require measurable operational control
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">
          AUTORA OS gives dealer groups response discipline, booking governance, forecast reliability, and multi-store accountability inside one operating system.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "enterprise_footer" }}>
            Request Enterprise Revenue Audit
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost" eventName="cta_contact_click" eventParams={{ location: "enterprise_footer" }}>
            Schedule Executive Walkthrough
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
