import { getCanonicalGovernanceSnapshot } from "@/lib/autora-dashboard";
import { requireDealerSession, sanitizeDealerIdForSession } from "@/lib/dealer-session";

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

export default async function OsGovernancePage({
  searchParams
}: {
  searchParams: Promise<{
    dealer?: string | string[];
  }>;
}) {
  const session = await requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin"] });

  const params = await searchParams;
  const dealerId = sanitizeDealerIdForSession(session, normalizeDealerId(params.dealer));
  const snapshot = await getCanonicalGovernanceSnapshot(session, dealerId);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Governance</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Network governance and policy compliance</h1>
        <p className="mt-2 text-sm text-steel">
          Govern policy inheritance, track store overrides, and enforce audit accountability across the network.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Total Audit Events (30d)</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{snapshot.auditSummary.totalEvents30d}</p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Override Events (30d)</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{snapshot.auditSummary.overrideEvents30d}</p>
        </article>
        <article className="rounded-2xl border border-red-300 bg-red-50 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-red-800">Breach Events (30d)</p>
          <p className="mt-2 text-2xl font-semibold text-red-900">{snapshot.auditSummary.breachEvents30d}</p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Last Generated</p>
          <p className="mt-2 text-sm font-semibold text-coal">{snapshot.auditSummary.lastGeneratedAt}</p>
        </article>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-coal">Policy inheritance and compliance</h2>
        <p className="mt-2 text-sm text-steel">
          Group policy inheritance with store-level override visibility and compliance-state tracking.
        </p>

        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Store</th>
                <th className="px-3 py-2">Group</th>
                <th className="px-3 py-2">Inherited Policy</th>
                <th className="px-3 py-2">Overrides</th>
                <th className="px-3 py-2">Compliance Flag</th>
                <th className="px-3 py-2">State</th>
                <th className="px-3 py-2">Last Audit</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.policies.map((row) => (
                <tr key={row.dealerId} className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">{row.storeName}</td>
                  <td className="px-3 py-2 text-steel">{row.groupName}</td>
                  <td className="px-3 py-2 text-steel">{row.inheritedPolicy}</td>
                  <td className="px-3 py-2 text-steel">{row.overrideFields}</td>
                  <td className="px-3 py-2 text-steel">{row.complianceFlag}</td>
                  <td className="px-3 py-2">
                    <span className={`status-pill ${statusPillTone(row.complianceState)}`}>{row.complianceState}</span>
                  </td>
                  <td className="px-3 py-2 text-steel">{row.lastAuditAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Compliance flags</h2>
          <div className="mt-4 space-y-2">
            {snapshot.flags.map((flag) => (
              <div key={`${flag.storeName}-${flag.flag}`} className="rounded-xl border border-steel/12 bg-mist/35 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`status-pill ${flag.severity === "Critical" ? "status-pill-risk" : "status-pill-warning"}`}>
                    {flag.severity}
                  </span>
                  <p className="text-sm font-semibold text-coal">{flag.storeName}</p>
                </div>
                <p className="mt-1 text-xs text-steel">Manager: {flag.managerName}</p>
                <p className="mt-1 text-sm text-steel">{flag.flag}</p>
                <p className="mt-1 text-xs font-medium text-coal">Next action: {flag.nextAction}</p>
              </div>
            ))}
            {!snapshot.flags.length ? <p className="text-sm text-steel">No active governance flags in this scope.</p> : null}
          </div>
        </article>

        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">Managers with highest SLA overrides</h2>
          <div className="mt-4 overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-steel/15 text-steel">
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Manager</th>
                  <th className="px-3 py-2">Overrides</th>
                  <th className="px-3 py-2">Store</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.overrideLeaders.map((row) => (
                  <tr key={`${row.name}-${row.rank}`} className="border-b border-steel/10">
                    <td className="px-3 py-2 text-steel">#{row.rank}</td>
                    <td className="px-3 py-2 font-medium text-coal">{row.name}</td>
                    <td className="px-3 py-2 text-steel">{row.value}</td>
                    <td className="px-3 py-2 text-steel">{row.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-coal">Revenue leakage concentration</h2>
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
      </section>
    </div>
  );
}
