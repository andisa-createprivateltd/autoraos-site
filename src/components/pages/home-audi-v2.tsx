import { KpiTooltip } from "@/components/os/kpi-tooltip";
import { ButtonLink } from "@/components/ui/button-link";
import { getMarketingMetrics, type MarketingMetric } from "@/lib/marketing-metrics";

const valueColumns = [
  {
    title: "What we detect",
    items: [
      "Slow responses and SLA breaches",
      "After-hours enquiries not handled",
      "Hot opportunities left unbooked"
    ]
  },
  {
    title: "Who is accountable",
    items: [
      "Tracks actions by role, store, and timestamp",
      "Shared queues enforce ownership"
    ]
  },
  {
    title: "What happens next",
    items: ["Recover Now queue", "Prioritized action flow", "Automated reminders and escalation"]
  }
] as const;

const trustSignals = [
  "Security and POPIA-aligned operating model",
  "Used by growing dealership groups",
  "WhatsApp-first control for sales and BDC teams"
] as const;

const outcomeCards = [
  {
    title: "Recover what marketing already generates",
    detail: "AUTORA OS forces follow-up and booking accountability across WhatsApp, website, ads, and OEM leads."
  },
  {
    title: "Prioritize the opportunities that matter",
    detail: "SLA timers, queue ranking, and hot-lead logic show what needs action now instead of leaving urgency to chance."
  },
  {
    title: "Measure store execution without guesswork",
    detail: "Leadership sees response pressure, recover-now actions, and booking gaps by store, manager, and time window."
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
    return <span className="rounded-full border border-white/20 bg-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">Sample Data</span>;
  }
  if (metric.provenance === "configured") {
    return <span className="rounded-full border border-white/16 bg-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/68">Configured</span>;
  }
  return null;
}

function MarketingMetricCard({
  label,
  metric
}: {
  label: string;
  metric: MarketingMetric;
}) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/65">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-white">{formatMetric(metric)}</p>
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
      <p className="mt-2 text-xs text-white/68">
        Source: {metric.source}
        {metric.computed_at ? ` · Updated ${new Date(metric.computed_at).toLocaleString("en-ZA")}` : ""}
      </p>
    </article>
  );
}

export async function HomeAudiV2() {
  const metrics = await getMarketingMetrics("7d");

  return (
    <div className="page-motion space-y-12 md:space-y-16">
      <section className="hero-panel relative overflow-hidden p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.15),transparent_45%),linear-gradient(112deg,#0b0c0d_0%,#111316_56%,#161a1f_100%)]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="section-kicker">AUTORA OS</p>
            <h1 className="section-heading mt-4 text-balance text-4xl font-semibold md:text-5xl">
              Control every lead. Enforce response discipline. Recover revenue you&apos;re losing today.
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/80">
              AUTORA OS detects slow responses, missed follow-ups, and booking gaps, enforcing <abbr title="service-level agreement">SLA</abbr> discipline across WhatsApp, website, ads, and OEM leads so dealerships convert more and lose less.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/64">
              Optional deployment focus includes Chinese automotive brands in South Africa, but the operating model is designed for any dealership group that needs tighter lead discipline.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "home_hero" }}>
                Request Revenue Audit
              </ButtonLink>
              <ButtonLink href="/platform" variant="ghost" eventName="cta_view_platform_click" eventParams={{ location: "home_hero" }}>
                See Platform
              </ButtonLink>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {trustSignals.map((item) => (
                <span key={item} className="rounded-full border border-white/14 bg-white/6 px-3 py-1.5 text-[11px] font-medium text-white/78">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="stagger-grid grid gap-3 sm:grid-cols-2">
            <MarketingMetricCard label="Revenue at Risk" metric={metrics.revenue_at_risk_zar} />
            <MarketingMetricCard label="SLA Breaches" metric={metrics.sla_breaches_count} />
            <MarketingMetricCard label="Urgency Covered" metric={metrics.urgency_covered_pct} />
            <MarketingMetricCard label="Stores Active" metric={metrics.stores_active_count} />
          </div>
        </div>
      </section>

      <section className="stagger-grid grid gap-4 md:grid-cols-3">
        {valueColumns.map((column) => (
          <article key={column.title} className="surface-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-steel">{column.title}</p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-steel">
              {column.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="page-shell p-7 md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-steel">Why teams buy</p>
        <h2 className="section-heading mt-2 text-balance text-3xl font-semibold text-coal md:text-4xl">
          A WhatsApp-first operating system built to enforce, protect, and measure.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-steel">
          AUTORA OS is not an agency layer. It is the system that forces response ownership, prioritizes recoverable revenue, and keeps bookings moving under one operating standard.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {outcomeCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-steel/14 bg-white p-5">
              <h3 className="text-lg font-semibold text-coal">{card.title}</h3>
              <p className="mt-2 text-sm text-steel">{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <article className="surface-card p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-steel">Operational outcomes</p>
          <h2 className="section-heading mt-2 text-3xl font-semibold text-coal">What leadership gets</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            <li>• One queue for sales and BDC instead of scattered inboxes</li>
            <li>• Measurable <abbr title="service-level agreement">SLA</abbr> discipline by user, store, and time window</li>
            <li>• Recover-now workflows for hot leads and overdue follow-up</li>
            <li>• Reporting that ties response behavior to bookings and revenue exposure</li>
          </ul>
        </article>

        <article className="surface-card p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-steel">Next step</p>
          <h2 className="section-heading mt-2 text-3xl font-semibold text-coal">Audit the leakage first</h2>
          <p className="mt-3 text-sm leading-relaxed text-steel">
            We map where enquiries slow down, where ownership breaks, and how much recoverable revenue is being left in the queue before we scope rollout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/pricing" variant="secondary" eventName="cta_pricing_click" eventParams={{ location: "home_next_step" }}>
              View Pricing
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" eventName="cta_contact_click" eventParams={{ location: "home_next_step" }}>
              Contact AUTORA OS
            </ButtonLink>
          </div>
        </article>
      </section>
    </div>
  );
}
