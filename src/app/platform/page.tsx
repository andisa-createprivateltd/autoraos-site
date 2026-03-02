import type { Metadata } from "next";
import { KpiTooltip } from "@/components/os/kpi-tooltip";
import { ButtonLink } from "@/components/ui/button-link";
import { getMarketingMetrics, type MarketingMetric } from "@/lib/marketing-metrics";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Platform",
  description:
    "See how AUTORA OS centralizes dealership enquiries, enforces SLA response discipline, and turns booking execution into measurable governance.",
  path: "/platform"
});

const sections = [
  {
    id: "dashboard",
    title: "Revenue governance command",
    module: "Dashboard",
    bullets: [
      "Revenue at risk by lead state and response pressure",
      "Open SLA breaches, after-hours exposure, and hot leads left unbooked",
      "Store and manager accountability in one command layer"
    ],
    operational: "Leadership sees where revenue is slipping before it becomes an invisible reporting problem."
  },
  {
    id: "inbox",
    title: "Shared WhatsApp inbox control",
    module: "Inbox",
    bullets: [
      "Centralized enquiries from WhatsApp, website, ads, and OEM feeds",
      "Assignment, quick replies, and escalation logic on every thread",
      "AI on/off controls without exposing platform secrets"
    ],
    operational: "Sales and BDC teams operate from one queue with clear ownership instead of scattered handoffs."
  },
  {
    id: "leads-bookings",
    title: "Recovery queue and booking execution",
    module: "Execution",
    bullets: [
      "Reply, call, book, assign, and recover from one action flow",
      "Confirm, reschedule, reminder, and no-show controls",
      "Hot-opportunity follow-up under one governed workflow"
    ],
    operational: "Managers can enforce what happens next instead of relying on memory or manual spreadsheets."
  },
  {
    id: "assistant",
    title: "Policy engine and operating rules",
    module: "Policy Engine",
    bullets: [
      "Business hours and after-hours recovery behavior",
      "Dealer-editable FAQs, booking rules, and escalation paths",
      "Platform-controlled fields with audit traceability"
    ],
    operational: "Rules stay governed while stores can adjust the operating details they are responsible for."
  },
  {
    id: "insights",
    title: "Audit and leadership reporting",
    module: "Visibility",
    bullets: [
      "Response time, breach trends, and hot-lead pressure by time window",
      "Audit logs for overrides, assignment changes, and booking actions",
      "Store and group reporting designed for operational reviews"
    ],
    operational: "Leadership can measure discipline, not just activity."
  }
] as const;

function formatMetric(metric: MarketingMetric) {
  if (metric.value === null) return "Not configured";
  if (metric.unit === "ZAR") {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0
    }).format(metric.value);
  }
  if (metric.unit === "percent") return `${Math.round(metric.value)}%`;
  return new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(metric.value);
}

function provenanceChip(metric: MarketingMetric) {
  if (metric.provenance === "sample") {
    return <span className="rounded-full border border-white/18 bg-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/82">Sample Data</span>;
  }
  if (metric.provenance === "configured") {
    return <span className="rounded-full border border-white/14 bg-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/68">Configured</span>;
  }
  return null;
}

function MetricCard({ label, metric }: { label: string; metric: MarketingMetric }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_36px_rgba(4,9,14,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-white/70">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatMetric(metric)}</p>
        </div>
        <div className="flex items-center gap-2">
          {provenanceChip(metric)}
          <KpiTooltip
            label={label}
            definition={metric.definition}
            formula={metric.calculation_summary}
            timeframe={metric.time_window}
            lastUpdated={metric.computed_at}
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-white/64">
        Source: {metric.source}
        {metric.computed_at ? ` · Updated ${new Date(metric.computed_at).toLocaleString("en-ZA")}` : ""}
      </p>
    </div>
  );
}

export default async function PlatformPage() {
  const metrics = await getMarketingMetrics("7d");

  return (
    <div className="page-motion space-y-10">
      <section className="panel-dark p-7 md:p-9">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Platform</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
          The operating system that enforces what must happen next
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">
          AUTORA OS centralizes dealership enquiries, prioritizes urgency, and governs booking execution so response discipline is measured instead of assumed.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Revenue at Risk" metric={metrics.revenue_at_risk_zar} />
          <MetricCard label="SLA Breaches" metric={metrics.sla_breaches_count} />
          <MetricCard label="Urgency Covered" metric={metrics.urgency_covered_pct} />
          <MetricCard label="SLA Compliance" metric={metrics.sla_compliance_pct} />
        </div>
      </section>

      <section className="space-y-5">
        {sections.map((section) => (
          <article key={section.id} id={section.id} className="surface-card grid gap-5 p-6 md:grid-cols-[1fr_1.2fr] md:p-7">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-steel">{section.module}</p>
              <h2 className="section-heading mt-2 text-2xl font-semibold text-coal">{section.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-steel">
                {section.bullets.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-steel/14 bg-[#0f1318] p-5 text-white shadow-[0_18px_36px_rgba(4,9,14,0.22)]">
              <p className="text-xs uppercase tracking-[0.12em] text-white/60">What changes operationally</p>
              <p className="mt-3 text-lg font-semibold text-white">{section.operational}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/68">
                Every module on this page maps to a working AUTORA OS surface. No abstract feature list, no placeholder workflow, and no marketing-only module names.
              </p>
            </div>
          </article>
        ))}
      </section>

      <section id="metric-methodology" className="page-shell p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-steel">Metric methodology</p>
            <h2 className="section-heading mt-2 text-2xl font-semibold text-coal">How AUTORA OS calculates the numbers shown here</h2>
          </div>
          <p className="text-xs uppercase tracking-[0.12em] text-steel">
            {metrics.last_updated ? `Last updated ${new Date(metrics.last_updated).toLocaleString("en-ZA")}` : "Awaiting live source"}
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Revenue at Risk", metric: metrics.revenue_at_risk_zar },
            { label: "SLA Breaches", metric: metrics.sla_breaches_count },
            { label: "Urgency Covered", metric: metrics.urgency_covered_pct },
            { label: "SLA Compliance", metric: metrics.sla_compliance_pct }
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-steel/14 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-coal">{item.label}</p>
                {item.metric.provenance === "sample" ? (
                  <span className="rounded-full border border-coal/12 bg-mist/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-coal">Sample Data</span>
                ) : item.metric.provenance === "configured" ? (
                  <span className="rounded-full border border-coal/12 bg-mist/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-steel">Configured</span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-steel">{item.metric.definition}</p>
              <dl className="mt-4 space-y-2 text-xs text-steel">
                <div>
                  <dt className="font-semibold text-coal">Calculation</dt>
                  <dd>{item.metric.calculation_summary}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-coal">Timeframe</dt>
                  <dd>{item.metric.time_window}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-coal">Source</dt>
                  <dd>{item.metric.source}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="surface-card p-6 md:p-7">
          <h2 className="section-heading text-2xl font-semibold text-coal">Implementation fit</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            <li>• Connect WhatsApp Cloud API, website forms, Meta, Google, and OEM feeds once</li>
            <li>• Govern who owns the next action at store, manager, and group level</li>
            <li>• Recover bookings and follow-up under one measured operating model</li>
            <li>• Review response discipline without forcing a CRM replacement on day one</li>
          </ul>
        </article>

        <article className="surface-card p-6 md:p-7">
          <h2 className="section-heading text-2xl font-semibold text-coal">Next step</h2>
          <p className="mt-3 text-sm leading-relaxed text-steel">
            A revenue audit shows where slow responses, missed follow-ups, and booking gaps are already costing the dealership money before rollout begins.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "platform" }}>
              Request Revenue Audit
            </ButtonLink>
            <ButtonLink href="/security" variant="ghost" eventName="cta_security_click" eventParams={{ location: "platform" }}>
              Review Security
            </ButtonLink>
          </div>
        </article>
      </section>
    </div>
  );
}
