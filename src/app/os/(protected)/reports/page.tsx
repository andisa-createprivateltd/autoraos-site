import {
  ForecastMethodologyModal
} from "@/components/os/forecast-methodology-modal";
import { getCanonicalDashboardData, getCanonicalDealerOptions, getDashboardQuery, resolveDashboardScope } from "@/lib/autora-dashboard";
import { requireDealerSession } from "@/lib/dealer-session";

type ReportsSearchParams = {
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

export default async function OsReportsPage({
  searchParams
}: {
  searchParams: Promise<ReportsSearchParams>;
}) {
  const session = await requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin", "dealer_marketing"] });
  const params = await searchParams;
  const scope = resolveDashboardScope(session, {
    dealer: single(params.dealer),
    range: single(params.range),
    from: single(params.from),
    to: single(params.to),
    simulation: single(params.simulation)
  });
  const [dealerOptions, data] = await Promise.all([
    getCanonicalDealerOptions(session),
    getCanonicalDashboardData(session, scope)
  ]);
  const query = getDashboardQuery(scope);
  const insufficientHistory = data.responseTimeCount < 10;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Reports</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Board-ready reporting suite</h1>
        <p className="mt-2 text-sm text-steel">
          Export executive packs and governance metrics with explicit methodology, scope, and last-updated context.
        </p>
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-5 xl:grid-cols-6" method="get">
          {dealerOptions.length > 1 ? (
            <select name="dealer" defaultValue={scope.dealerId || "all"} className="input">
              <option value="all">All stores in scope</option>
              {dealerOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input type="hidden" name="dealer" value={scope.dealerId || ""} />
          )}

          <select name="range" defaultValue={scope.range} className="input">
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          <input type="date" name="from" defaultValue={scope.from} className="input" />
          <input type="date" name="to" defaultValue={scope.to} className="input" />

          <select name="simulation" defaultValue={String(scope.simulationDeltaPct)} className="input">
            <option value="0">Baseline</option>
            <option value="3">+3 pts</option>
            <option value="5">+5 pts</option>
            <option value="8">+8 pts</option>
            <option value="10">+10 pts</option>
          </select>

          <button type="submit" className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90">
            Recalculate
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-coal">Forecast outlook</h2>
            <p className="mt-2 text-sm text-steel">
              Forecasts tie expected revenue impact to current SLA compliance, baseline conversion, and configured opportunity values.
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

        {insufficientHistory ? (
          <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Insufficient history. Forecast outputs are withheld until at least 10 satisfied SLA events exist in the selected window.
          </div>
        ) : (
          <div className="mt-5 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-steel/15 text-steel">
                  <th className="px-3 py-2">Window</th>
                  <th className="px-3 py-2">Forecasted revenue at risk</th>
                  <th className="px-3 py-2">Projected conversion impact</th>
                  <th className="px-3 py-2">Recovery potential</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">30 days</td>
                  <td className="px-3 py-2 text-steel">{data.forecast.revenueAtRisk30dFormatted}</td>
                  <td className="px-3 py-2 text-steel">See methodology</td>
                  <td className="px-3 py-2 text-steel">See 90-day forecast</td>
                </tr>
                <tr className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">60 days</td>
                  <td className="px-3 py-2 text-steel">{data.forecast.conversionImpact60dFormatted}</td>
                  <td className="px-3 py-2 text-steel">Hot lead drop-off model</td>
                  <td className="px-3 py-2 text-steel">See methodology</td>
                </tr>
                <tr className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">90 days</td>
                  <td className="px-3 py-2 text-steel">{data.forecast.recoveryPotential90dFormatted}</td>
                  <td className="px-3 py-2 text-steel">SLA improvement scenario</td>
                  <td className="px-3 py-2 text-steel">{scope.simulationDeltaPct}% simulated uplift</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-coal">Methodology</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Metric label="Baseline conversion rate" value={`${data.forecast.baselineCloseRatePct}%`} />
          <Metric label="Current SLA compliance" value={`${data.forecast.currentSlaCompliancePct}%`} />
          <Metric label="Degraded conversion delta" value={`${data.forecast.degradationFactorPct}%`} />
          <Metric label="Avg opportunity value" value={data.forecast.averageOpportunityValueFormatted} />
        </div>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-coal">Export controls</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`/api/os/reports/exports?type=executive&format=csv${query ? `&${query}` : ""}`}
            className="rounded-full border border-steel/25 px-3 py-1 text-xs font-semibold text-coal"
          >
            Export Executive Pack (CSV)
          </a>
          <a
            href={`/api/os/reports/exports?type=oem&format=csv${query ? `&${query}` : ""}`}
            className="rounded-full border border-steel/25 px-3 py-1 text-xs font-semibold text-coal"
          >
            Export OEM Compliance (CSV)
          </a>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-steel/12 bg-mist/30 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-steel">{label}</p>
      <p className="mt-2 text-lg font-semibold text-coal">{value}</p>
    </div>
  );
}
