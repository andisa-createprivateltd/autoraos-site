import Link from "next/link";
import { AnimatedNumber } from "@/components/os/animated-number";
import { requireDealerSession, sanitizeDealerIdForSession } from "@/lib/dealer-session";
import { getNetworkCommandSnapshot } from "@/lib/os-data";

const HEAT_BUCKET_ORDER = ["06-09", "09-12", "12-15", "15-18", "18-21", "21-06"] as const;
const REGION_OPTIONS = [
  "Gauteng North",
  "Gauteng South",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "North West"
] as const;

function getSingleSearchParam(value?: string | string[]) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}

function normalizeDealerId(value?: string | string[]) {
  const normalized = getSingleSearchParam(value)?.trim();
  if (!normalized || normalized.toLowerCase() === "all") return undefined;
  return normalized;
}

function normalizeRegion(value?: string | string[]) {
  const normalized = getSingleSearchParam(value)?.trim();
  if (!normalized || normalized.toLowerCase() === "all") return undefined;
  return normalized;
}

function formatZar(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(value);
}

function statusPillTone(status: "Healthy" | "Watch" | "Critical") {
  if (status === "Critical") return "status-pill-risk";
  if (status === "Watch") return "status-pill-warning";
  return "status-pill-positive";
}

function buildRegionHref(region: string, dealerId?: string) {
  const params = new URLSearchParams();
  if (region !== "all") {
    params.set("region", region);
  }
  if (dealerId) {
    params.set("dealer", dealerId);
  }
  const query = params.toString();
  return query ? `/os/network-command?${query}` : "/os/network-command";
}

export default async function OsNetworkCommandPage({
  searchParams
}: {
  searchParams: Promise<{
    region?: string | string[];
    dealer?: string | string[];
  }>;
}) {
  const session = await requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin", "dealer_marketing"] });

  const params = await searchParams;
  const region = normalizeRegion(params.region);
  const dealerId = sanitizeDealerIdForSession(session, normalizeDealerId(params.dealer));

  const snapshot = await getNetworkCommandSnapshot({ region, dealerId });

  const rankedStores = [...snapshot.stores].sort((a, b) => b.slaCompliance - a.slaCompliance);
  const heatmapRegions = Array.from(new Set(snapshot.heatmap.map((row) => row.region)));
  const heatmapByRegion = new Map<string, Map<string, number>>();

  for (const row of snapshot.heatmap) {
    if (!heatmapByRegion.has(row.region)) {
      heatmapByRegion.set(row.region, new Map());
    }
    heatmapByRegion.get(row.region)!.set(row.bucket, row.breaches);
  }

  const trendRows = snapshot.trends.map((point, index) => {
    const previous = index > 0 ? snapshot.trends[index - 1] : null;
    const slaDelta = previous ? point.slaCompliance - previous.slaCompliance : 0;
    const riskDelta = previous ? point.revenueAtRisk - previous.revenueAtRisk : 0;

    return {
      ...point,
      slaDelta,
      riskDelta
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Network Command</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">34-store revenue command view</h1>
        <p className="mt-2 text-sm text-steel">
          Compare store performance, enforce SLA discipline, and track revenue leakage concentration across the network.
        </p>
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.12em] text-steel">Region Filter</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href={buildRegionHref("all", dealerId)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              !region
                ? "border-coal bg-coal text-white"
                : "border-steel/25 text-coal hover:border-coal/45 hover:bg-mist/50"
            }`}
          >
            All Regions
          </Link>
          {REGION_OPTIONS.map((regionOption) => (
            <Link
              key={regionOption}
              href={buildRegionHref(regionOption, dealerId)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                region === regionOption
                  ? "border-coal bg-coal text-white"
                  : "border-steel/25 text-coal hover:border-coal/45 hover:bg-mist/50"
              }`}
            >
              {regionOption}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Stores</p>
          <p className="mt-2 text-2xl font-semibold text-coal">
            <AnimatedNumber value={snapshot.summary.stores} />
          </p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Active Reps</p>
          <p className="mt-2 text-2xl font-semibold text-coal">
            <AnimatedNumber value={snapshot.summary.reps} />
          </p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Active Leads</p>
          <p className="mt-2 text-2xl font-semibold text-coal">
            <AnimatedNumber value={snapshot.summary.activeLeads} />
          </p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Network SLA Compliance</p>
          <p className="mt-2 text-2xl font-semibold text-coal">
            <AnimatedNumber value={`${snapshot.summary.networkSlaCompliance}%`} />
          </p>
        </article>
        <article className="rounded-2xl border border-red-300 bg-red-50 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-red-800">Revenue at Risk</p>
          <p className="mt-2 text-2xl font-semibold text-red-900">{formatZar(snapshot.summary.revenueAtRisk)}</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Store SLA leaderboard</h2>
          <p className="mt-2 text-sm text-steel">Ranked by SLA compliance with revenue-at-risk context per store.</p>

          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-steel/15 text-steel">
                  <th className="px-3 py-2">Store</th>
                  <th className="px-3 py-2">Group</th>
                  <th className="px-3 py-2">SLA</th>
                  <th className="px-3 py-2">Breaches</th>
                  <th className="px-3 py-2">Revenue at Risk</th>
                  <th className="px-3 py-2">State</th>
                </tr>
              </thead>
              <tbody>
                {rankedStores.map((store) => (
                  <tr key={store.dealerId} className="border-b border-steel/10">
                    <td className="px-3 py-2 font-medium text-coal">{store.storeName}</td>
                    <td className="px-3 py-2 text-steel">{store.groupName}</td>
                    <td className="px-3 py-2 text-steel">{store.slaCompliance}%</td>
                    <td className="px-3 py-2 text-steel">{store.breaches}</td>
                    <td className="px-3 py-2 text-steel">{formatZar(store.revenueAtRisk)}</td>
                    <td className="px-3 py-2">
                      <span className={`status-pill ${statusPillTone(store.complianceState)}`}>{store.complianceState}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Underperforming stores</h2>
          <p className="mt-2 text-sm text-steel">Stores with the highest revenue leakage and policy pressure.</p>

          <div className="mt-4 space-y-2">
            {snapshot.underperformingStores.slice(0, 10).map((store) => (
              <div key={`${store.dealerId}-risk`} className="rounded-xl border border-steel/12 bg-mist/35 px-3 py-2">
                <p className="text-sm font-semibold text-coal">{store.storeName}</p>
                <p className="text-xs text-steel">{store.managerName} · {store.region}</p>
                <p className="mt-1 text-xs text-steel">
                  SLA {store.slaCompliance}% · Breaches {store.breaches} · Risk {formatZar(store.revenueAtRisk)}
                </p>
              </div>
            ))}
            {!snapshot.underperformingStores.length ? (
              <p className="text-sm text-steel">No stores currently flagged as watch or critical.</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-coal">Breach heatmap by region and time window</h2>
        <p className="mt-2 text-sm text-steel">Higher counts indicate SLA pressure concentration by region and operating window.</p>

        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Region</th>
                {HEAT_BUCKET_ORDER.map((bucket) => (
                  <th key={bucket} className="px-3 py-2">
                    {bucket}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapRegions.map((heatRegion) => (
                <tr key={heatRegion} className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">{heatRegion}</td>
                  {HEAT_BUCKET_ORDER.map((bucket) => {
                    const value = heatmapByRegion.get(heatRegion)?.get(bucket) || 0;
                    return (
                      <td key={`${heatRegion}-${bucket}`} className="px-3 py-2 text-steel">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Store leaders</h2>
          <div className="mt-4 space-y-2">
            {snapshot.leaderboards.stores.slice(0, 8).map((row) => (
              <div key={`${row.name}-${row.rank}`} className="rounded-xl border border-steel/12 bg-mist/35 px-3 py-2">
                <p className="text-sm font-semibold text-coal">#{row.rank} {row.name}</p>
                <p className="text-xs text-steel">{row.value} · {row.context}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Managers with highest overrides</h2>
          <div className="mt-4 space-y-2">
            {snapshot.leaderboards.managers.slice(0, 8).map((row) => (
              <div key={`${row.name}-${row.rank}`} className="rounded-xl border border-steel/12 bg-mist/35 px-3 py-2">
                <p className="text-sm font-semibold text-coal">#{row.rank} {row.name}</p>
                <p className="text-xs text-steel">{row.value} · {row.context}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Execution leaderboard</h2>
          <div className="mt-4 space-y-2">
            {snapshot.leaderboards.reps.slice(0, 8).map((row) => (
              <div key={`${row.name}-${row.rank}`} className="rounded-xl border border-steel/12 bg-mist/35 px-3 py-2">
                <p className="text-sm font-semibold text-coal">#{row.rank} {row.name}</p>
                <p className="text-xs text-steel">{row.value} · {row.context}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Month-over-month trend</h2>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-steel/15 text-steel">
                  <th className="px-3 py-2">Period</th>
                  <th className="px-3 py-2">SLA Compliance</th>
                  <th className="px-3 py-2">MoM Delta</th>
                  <th className="px-3 py-2">Revenue at Risk</th>
                  <th className="px-3 py-2">Risk Delta</th>
                </tr>
              </thead>
              <tbody>
                {trendRows.map((row) => (
                  <tr key={row.period} className="border-b border-steel/10">
                    <td className="px-3 py-2 font-medium text-coal">{row.period}</td>
                    <td className="px-3 py-2 text-steel">{row.slaCompliance}%</td>
                    <td className="px-3 py-2 text-steel">{row.slaDelta >= 0 ? `+${row.slaDelta}` : row.slaDelta}%</td>
                    <td className="px-3 py-2 text-steel">{formatZar(row.revenueAtRisk)}</td>
                    <td className="px-3 py-2 text-steel">{row.riskDelta >= 0 ? `+${formatZar(row.riskDelta)}` : formatZar(row.riskDelta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Revenue leakage by region</h2>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-steel/15 text-steel">
                  <th className="px-3 py-2">Region</th>
                  <th className="px-3 py-2">Stores</th>
                  <th className="px-3 py-2">Breaches</th>
                  <th className="px-3 py-2">Revenue at Risk</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.leakageByRegion.map((row) => (
                  <tr key={row.region} className="border-b border-steel/10">
                    <td className="px-3 py-2 font-medium text-coal">{row.region}</td>
                    <td className="px-3 py-2 text-steel">{row.stores}</td>
                    <td className="px-3 py-2 text-steel">{row.breaches}</td>
                    <td className="px-3 py-2 text-steel">{formatZar(row.revenueAtRisk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
