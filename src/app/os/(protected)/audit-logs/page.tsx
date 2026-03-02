import Link from "next/link";
import { getCanonicalAuditFeed, getCanonicalDealerOptions, resolveDashboardScope } from "@/lib/autora-dashboard";
import { requireDealerSession } from "@/lib/dealer-session";

type AuditLogsSearchParams = {
  dealer?: string | string[];
  range?: string | string[];
  from?: string | string[];
  to?: string | string[];
  sla?: string | string[];
  user?: string | string[];
  page?: string | string[];
};

function single(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function normalizePage(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === "all") return;
    query.set(key, String(value));
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export default async function OsAuditLogsPage({
  searchParams
}: {
  searchParams: Promise<AuditLogsSearchParams>;
}) {
  const session = await requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin"] });
  const params = await searchParams;
  const scope = resolveDashboardScope(session, {
    dealer: single(params.dealer),
    range: single(params.range),
    from: single(params.from),
    to: single(params.to)
  });
  const page = normalizePage(params.page);
  const filters = {
    sla: single(params.sla),
    user: single(params.user)
  };
  const [dealerOptions, audit] = await Promise.all([
    getCanonicalDealerOptions(session),
    getCanonicalAuditFeed(session, scope, filters, { page, pageSize: 25 })
  ]);

  const baseParams = {
    dealer: scope.dealerId,
    range: scope.range === "7d" ? undefined : scope.range,
    from: scope.range === "custom" ? scope.from : undefined,
    to: scope.range === "custom" ? scope.to : undefined,
    sla: filters.sla,
    user: filters.user
  };
  const exportQuery = queryString(baseParams);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs uppercase tracking-[0.14em] text-tide">Audit Logs</p>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">
            Immutable Log
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-coal">Full operational audit trail</h1>
        <p className="text-sm text-steel">
          Append-only event history for compliance review, operational review, and board reporting.
        </p>
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
        <form className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]" method="get">
          <select name="dealer" defaultValue={scope.dealerId || "all"} className="input">
            <option value="all">All stores in scope</option>
            {dealerOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <select name="sla" defaultValue={filters.sla || "all"} className="input">
            <option value="all">All SLA types</option>
            <option value="sla_breached">SLA Breach</option>
            <option value="sla_satisfied">SLA Satisfied</option>
            <option value="support_action">Support Action</option>
          </select>

          <select name="user" defaultValue={filters.user || "all"} className="input">
            <option value="all">All users</option>
            {audit.users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <select name="range" defaultValue={scope.range} className="input">
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input type="date" name="from" defaultValue={scope.from} className="input" />
            <input type="date" name="to" defaultValue={scope.to} className="input" />
          </div>

          <button type="submit" className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90">
            Apply
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-steel">Rows in view</p>
            <p className="text-2xl font-semibold text-coal">{audit.total}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/api/os/reports?type=executive&format=csv${exportQuery ? `&${exportQuery.slice(1)}` : ""}`}
              className="rounded-full border border-steel/25 px-3 py-1 text-xs font-semibold text-coal"
            >
              Export CSV
            </Link>
            <Link href={`/os/dashboard${exportQuery}`} className="text-sm font-semibold text-coal underline-offset-4 hover:underline">
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Entity</th>
                <th className="px-3 py-2">Context</th>
              </tr>
            </thead>
            <tbody>
              {audit.rows.length ? (
                audit.rows.map((row) => (
                  <tr key={row.id} className="border-b border-steel/10">
                    <td className="px-3 py-2 text-steel">{new Date(row.created_at).toLocaleString("en-ZA")}</td>
                    <td className="px-3 py-2 font-medium text-coal">{row.action}</td>
                    <td className="px-3 py-2 text-steel">{row.entity_type}</td>
                    <td className="px-3 py-2 text-steel">{JSON.stringify(row.metadata || {})}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm text-steel">
                    No audit entries match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/os/audit-logs${queryString({ ...baseParams, page: Math.max(audit.page - 1, 1) })}`}
            className={`rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold ${audit.page <= 1 ? "pointer-events-none opacity-40" : "text-coal"}`}
          >
            Previous
          </Link>
          <p className="text-xs text-steel">
            Page {audit.page} of {audit.totalPages}
          </p>
          <Link
            href={`/os/audit-logs${queryString({ ...baseParams, page: Math.min(audit.page + 1, audit.totalPages) })}`}
            className={`rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold ${audit.page >= audit.totalPages ? "pointer-events-none opacity-40" : "text-coal"}`}
          >
            Next
          </Link>
        </div>
      </section>
    </div>
  );
}
