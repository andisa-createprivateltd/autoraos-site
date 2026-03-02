import Link from "next/link";
import { AnimatedNumber } from "@/components/os/animated-number";
import { ForecastMethodologyModal } from "@/components/os/forecast-methodology-modal";
import { KpiTooltip } from "@/components/os/kpi-tooltip";
import { SlaCountdown } from "@/components/os/sla-countdown";
import {
  getCanonicalDashboardData,
  getCanonicalDealerOptions,
  getDashboardQuery,
  resolveDashboardScope
} from "@/lib/autora-dashboard";
import { requireDealerSession } from "@/lib/dealer-session";

type DashboardSearchParams = {
  dealer?: string | string[];
  range?: string | string[];
  from?: string | string[];
  to?: string | string[];
  simulation?: string | string[];
};

function single(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function severityTone(compliancePct: number) {
  if (compliancePct >= 95) return "border-emerald-300 bg-emerald-50";
  if (compliancePct >= 85) return "border-amber-300 bg-amber-50";
  return "border-red-300 bg-red-50";
}

function severityLabel(compliancePct: number) {
  if (compliancePct >= 95) return "Compliant";
  if (compliancePct >= 85) return "Watch";
  return "Critical";
}

function riskCardTone(revenueAtRisk: number) {
  if (revenueAtRisk >= 450000) return "border-red-300 bg-red-50";
  if (revenueAtRisk >= 180000) return "border-amber-300 bg-amber-50";
  return "border-emerald-300 bg-emerald-50";
}

export default async function OsDashboardPage({
  searchParams
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const session = await requireDealerSession();
  const params = await searchParams;
  const scope = resolveDashboardScope(session, {
    dealer: single(params.dealer),
    range: single(params.range),
    from: single(params.from),
    to: single(params.to),
    simulation: single(params.simulation)
  });
  const [data, dealerOptions] = await Promise.all([
    getCanonicalDashboardData(session, scope),
    getCanonicalDealerOptions(session)
  ]);
  const query = getDashboardQuery(scope);
  const querySuffix = query ? `?${query}` : "";
  const canCrossStore = ["platform_owner", "platform_support", "dealer_admin", "dealer_marketing"].includes(session.role);
  const canOpenRecoverQueue = session.role !== "dealer_marketing";
  const lastUpdatedLabel = new Date(data.lastUpdated).toLocaleString("en-ZA");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Revenue Governance</p>
        <h1 className="text-3xl font-semibold text-coal">Revenue Risk Command Center</h1>
        <p className="text-sm text-steel">
          Live governance view of revenue exposure, SLA discipline, and recovery actions across your network.
        </p>
        <p className="text-xs text-steel">Last updated: {lastUpdatedLabel}</p>
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
        <form className="grid gap-3 lg:grid-cols-[1.15fr_1.15fr_1fr_1fr_1fr_auto]" method="get">
          <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
            <span>Time range</span>
            <select name="range" defaultValue={scope.range} className="input">
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </label>

          {canCrossStore ? (
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              <span>Store filter</span>
              <select name="dealer" defaultValue={scope.dealerId || "all"} className="input">
                <option value="all">Network View</option>
                {dealerOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <input type="hidden" name="dealer" value={scope.dealerId || ""} />
          )}

          <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
            <span>From</span>
            <input type="date" name="from" defaultValue={scope.from} className="input" />
          </label>

          <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
            <span>To</span>
            <input type="date" name="to" defaultValue={scope.to} className="input" />
          </label>

          <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
            <span>SLA simulation</span>
            <select name="simulation" defaultValue={String(scope.simulationDeltaPct)} className="input">
              <option value="0">Baseline</option>
              <option value="3">+3 pts</option>
              <option value="5">+5 pts</option>
              <option value="8">+8 pts</option>
              <option value="10">+10 pts</option>
            </select>
          </label>

          <button type="submit" className="mt-5 rounded-full bg-coal px-5 py-3 text-sm font-semibold text-white hover:bg-coal/90">
            Recalculate
          </button>
        </form>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          title="Revenue at Risk"
          tone={riskCardTone(data.revenueAtRisk)}
          value={data.revenueAtRiskFormatted}
          meta={`${data.revenueAtRiskCount} open opportunities`}
          supporting={`${data.averageDealValueFormatted} avg value · ${data.averageCloseProbabilityPct}% close rate`}
          tooltip={data.tooltips.revenueAtRisk}
        />
        <MetricCard
          title="SLA Compliance"
          tone={severityTone(data.slaCompliancePct)}
          value={`${data.slaCompliancePct}%`}
          meta={`${data.slaComplianceCount}/${data.slaComplianceTotal} compliant`}
          supporting={`${severityLabel(data.slaCompliancePct)} · ${data.openBreaches} open breaches`}
          tooltip={data.tooltips.slaCompliance}
          animated
        />
        <MetricCard
          title="Breaches (7d)"
          tone={data.openBreaches7d > 0 ? "border-red-300 bg-red-50" : "border-steel/12 bg-white"}
          value={data.breachCount7d}
          meta={`${data.openBreaches7d} open`}
          supporting="Canonical seven-day breach count"
          tooltip={data.tooltips.breaches7d}
          animated
        />
        <MetricCard
          title="Hot Unbooked"
          tone={data.hotUnbooked > 0 ? "border-amber-300 bg-amber-50" : "border-steel/12 bg-white"}
          value={data.hotUnbooked}
          meta={`${data.totalHot} hot in scope`}
          supporting={`${data.predictedRiskPct}% average risk score`}
          tooltip={data.tooltips.hotUnbooked}
          animated
        />
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-tide">Risk Heatmap</p>
            <h2 className="mt-1 text-2xl font-semibold text-coal">Store-level exposure and compliance</h2>
            <p className="mt-2 text-sm text-steel">
              Severity is system-scored from SLA compliance. Risk score reflects canonical breach weighting from active opportunities.
            </p>
          </div>
          <div className="rounded-2xl border border-steel/12 bg-mist/30 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.12em] text-steel">Scope</p>
            <p className="mt-1 text-sm font-semibold text-coal">{data.scope.label}</p>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Store</th>
                <th className="px-3 py-2">Revenue at Risk</th>
                <th className="px-3 py-2">SLA</th>
                <th className="px-3 py-2">Breaches</th>
                <th className="px-3 py-2">Hot Unbooked</th>
                <th className="px-3 py-2">Risk Score</th>
                <th className="px-3 py-2">Median Response</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.heatmap.length ? (
                data.heatmap.map((row) => (
                  <tr key={`${row.timeframe}-${row.dealership_id}`} className="border-b border-steel/10">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-coal">{row.dealership_name}</p>
                      <p className="text-xs text-steel">{row.dealership_city || "Location not set"}</p>
                    </td>
                    <td className="px-3 py-3 font-medium text-coal">{row.revenue_at_risk_formatted}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityPill(row.severity)}`}>
                          {severityLabel(Number(row.sla_compliance_pct))}
                        </span>
                        <span className="text-steel">{Math.round(Number(row.sla_compliance_pct))}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-steel">{row.breach_count}</td>
                    <td className="px-3 py-3 text-steel">{row.hot_unbooked_count}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskScoreTone(Number(row.risk_score_pct))}`}>
                        {Math.round(Number(row.risk_score_pct))}/100
                      </span>
                    </td>
                    <td className="px-3 py-3 text-steel">{row.median_response_label}</td>
                    <td className="px-3 py-3 text-steel">{new Date(row.last_refreshed_at).toLocaleString("en-ZA")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-steel">
                    No store heatmap rows are available for the selected filter window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-tide">Recover Now</p>
              <h2 className="mt-1 text-2xl font-semibold text-coal">Immediate revenue-saving actions</h2>
              <p className="mt-2 text-sm text-steel">
                Actionable only. Default queue excludes items outside the 48-hour recover window and closed or written-off escalations.
              </p>
            </div>
            {canOpenRecoverQueue ? (
              <Link href={`/os/leads${querySuffix}`} className="text-sm font-semibold text-coal underline-offset-4 hover:underline">
                Open queue
              </Link>
            ) : null}
          </div>

          <div className="mt-5 space-y-3">
            {!canOpenRecoverQueue ? (
              <div className="rounded-2xl border border-steel/12 bg-mist/30 p-4 text-sm text-steel">
                Queue detail is restricted for metrics-only roles. Review aggregate KPIs and reports only.
              </div>
            ) : data.recoverNow.length ? (
              data.recoverNow.map((item) => (
                <div key={item.sla_event_id} className="grid gap-3 rounded-2xl border border-steel/12 bg-mist/30 p-4 md:grid-cols-[1.2fr_0.9fr_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-coal">{item.lead_name}</p>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${queueStateTone(item.queue_state)}`}>
                        {item.queueStateLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-steel">{item.dealership_name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-red-700">{item.issue_type}</p>
                  </div>
                  <div className="space-y-1 text-sm text-steel">
                    <p>Risk score: {item.risk_score_pct}/100</p>
                    <p>Revenue at risk: {item.revenue_at_risk_formatted}</p>
                    <p>
                      <SlaCountdown
                        dueAt={item.due_at}
                        breachedAt={item.breached_at}
                        className="font-medium text-coal"
                      />
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Link href={`/os/conversations?lead=${item.lead_id}`} className="rounded-full border border-steel/20 px-3 py-2 text-xs font-semibold text-coal">
                      Reply
                    </Link>
                    <Link href={`/os/bookings?lead=${item.lead_id}`} className="rounded-full border border-steel/20 px-3 py-2 text-xs font-semibold text-coal">
                      Book
                    </Link>
                    <Link href={`/os/leads?lead=${item.lead_id}`} className="rounded-full bg-coal px-3 py-2 text-xs font-semibold text-white">
                      Assign
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
                No actionable revenue recoveries are open inside the active 48-hour queue window.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-tide">Forecast Impact</p>
              <h2 className="mt-1 text-2xl font-semibold text-coal">SLA improvement simulation</h2>
              <p className="mt-2 text-sm text-steel">
                Forecasts are tied to baseline store performance, current compliance, and the selected SLA improvement delta.
              </p>
            </div>
            <ForecastMethodologyModal
              baselineCloseRatePct={data.forecast.baselineCloseRatePct}
              currentSlaCompliancePct={data.forecast.currentSlaCompliancePct}
              simulatedSlaCompliancePct={data.forecast.simulatedSlaCompliancePct}
              degradationFactorPct={data.forecast.degradationFactorPct}
              averageOpportunityValueFormatted={data.forecast.averageOpportunityValueFormatted}
              formula30d={data.forecast.formula_30d}
              formula60d={data.forecast.formula_60d}
              formula90d={data.forecast.formula_90d}
            />
          </div>

          <div className="mt-5 grid gap-3">
            <ForecastCard
              label="30-Day Revenue at Risk"
              value={data.forecast.revenueAtRisk30dFormatted}
              formula={data.forecast.formula_30d}
            />
            <ForecastCard
              label="60-Day Conversion Impact"
              value={data.forecast.conversionImpact60dFormatted}
              formula={data.forecast.formula_60d}
            />
            <ForecastCard
              label="90-Day Recovery Potential"
              value={data.forecast.recoveryPotential90dFormatted}
              formula={data.forecast.formula_90d}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <TransparencyCard label="Baseline close rate" value={`${data.forecast.baselineCloseRatePct}%`} />
            <TransparencyCard label="Current SLA compliance" value={`${data.forecast.currentSlaCompliancePct}%`} />
            <TransparencyCard label="Simulated SLA compliance" value={`${data.forecast.simulatedSlaCompliancePct}%`} />
            <TransparencyCard label="Degradation factor" value={`${data.forecast.degradationFactorPct}%`} />
            <TransparencyCard label="Avg opportunity value" value={data.forecast.averageOpportunityValueFormatted} />
            <TransparencyCard label="Last updated" value={lastUpdatedLabel} />
          </div>
        </article>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  tone,
  value,
  meta,
  supporting,
  tooltip,
  animated
}: {
  title: string;
  tone: string;
  value: string | number;
  meta: string;
  supporting: string;
  tooltip: {
    definition: string;
    formula: string;
    timeframe: string;
    lastUpdated: string;
  };
  animated?: boolean;
}) {
  return (
    <article className={`rounded-2xl border p-5 ${tone}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-steel">{title}</p>
        <KpiTooltip
          label={title}
          definition={tooltip.definition}
          formula={tooltip.formula}
          timeframe={tooltip.timeframe}
          lastUpdated={tooltip.lastUpdated}
        />
      </div>
      <p className="mt-3 text-3xl font-semibold text-coal">
        {animated ? <AnimatedNumber value={value} /> : value}
      </p>
      <p className="mt-2 text-xs text-steel">{meta}</p>
      <p className="mt-1 text-xs text-steel">{supporting}</p>
    </article>
  );
}

function ForecastCard({ label, value, formula }: { label: string; value: string; formula: string }) {
  return (
    <div className="rounded-2xl border border-steel/12 bg-mist/30 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-tide">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-coal">{value}</p>
      <p className="mt-2 text-xs text-steel">{formula}</p>
    </div>
  );
}

function TransparencyCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-steel/12 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-steel">{label}</p>
      <p className="mt-2 text-lg font-semibold text-coal">{value}</p>
    </div>
  );
}

function severityPill(severity: string) {
  if (severity === "green") return "bg-emerald-100 text-emerald-800";
  if (severity === "amber") return "bg-amber-100 text-amber-900";
  return "bg-red-100 text-red-800";
}

function riskScoreTone(score: number) {
  if (score >= 80) return "bg-red-100 text-red-800";
  if (score >= 55) return "bg-amber-100 text-amber-900";
  return "bg-emerald-100 text-emerald-800";
}

function queueStateTone(state: string) {
  if (state === "breached") return "bg-red-100 text-red-800";
  if (state === "due_now") return "bg-amber-100 text-amber-900";
  return "bg-orange-100 text-orange-900";
}
