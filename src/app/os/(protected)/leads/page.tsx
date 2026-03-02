import Link from "next/link";
import { QueueBulkActions } from "@/components/os/queue-bulk-actions";
import { SlaCountdown } from "@/components/os/sla-countdown";
import {
  getCanonicalAssignableUsers,
  getCanonicalDealerOptions,
  getCanonicalQueueRows
} from "@/lib/autora-dashboard";
import { requireDealerSession, sanitizeDealerIdForSession } from "@/lib/dealer-session";

type LeadsPageSearchParams = {
  status?: string | string[];
  source?: string | string[];
  assigned?: string | string[];
  dealer?: string | string[];
  queue?: string | string[];
  lead?: string | string[];
  page?: string | string[];
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
  { value: "lost", label: "Lost" }
] as const;

const SOURCE_OPTIONS = [
  { value: "all", label: "All sources" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "website", label: "Website" },
  { value: "ads", label: "Ads" },
  { value: "oem", label: "OEM" }
] as const;

const ASSIGNED_OPTIONS = [
  { value: "all", label: "All assignees" },
  { value: "unassigned", label: "Unassigned" }
] as const;

const QUEUE_OPTIONS = [
  { value: "all", label: "All queues" },
  { value: "slow", label: "Slow replies" },
  { value: "recover", label: "Recover now" },
  { value: "stuck", label: "Stuck opportunities" },
  { value: "hot", label: "Hot not booked" }
] as const;

function normalizeParam(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "all";
  const normalized = raw.trim();
  return normalized ? (normalized.toLowerCase() === "all" ? "all" : normalized) : "all";
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

export default async function OsLeadsPage({
  searchParams
}: {
  searchParams: Promise<LeadsPageSearchParams>;
}) {
  const session = await requireDealerSession({
    roles: ["platform_owner", "platform_support", "dealer_admin", "dealer_sales"]
  });
  const params = await searchParams;

  const status = normalizeParam(params.status);
  const source = normalizeParam(params.source);
  const assigned = normalizeParam(params.assigned);
  const requestedDealerId = normalizeParam(params.dealer);
  const queue = normalizeParam(params.queue);
  const leadId = normalizeParam(params.lead);
  const page = normalizePage(params.page);
  const dealerId = sanitizeDealerIdForSession(session, requestedDealerId === "all" ? undefined : requestedDealerId);
  const [dealerOptions, queueData, assignableUsers] = await Promise.all([
    getCanonicalDealerOptions(session),
    getCanonicalQueueRows(session, {
      dealerId,
      status,
      source,
      assigned,
      queue,
      leadId: leadId === "all" ? undefined : leadId,
      page,
      pageSize: 25
    }),
    getCanonicalAssignableUsers(session, dealerId)
  ]);

  if (!queueData) {
    return (
      <div className="rounded-3xl border border-red-300 bg-red-50 p-6 text-sm text-red-900">
        Canonical queue data requires Supabase configuration and canonical views. The queue is unavailable until the
        data layer is connected.
      </div>
    );
  }

  const baseParams = {
    status,
    source,
    assigned,
    dealer: dealerId,
    queue,
    lead: leadId === "all" ? undefined : leadId
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Queue</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Revenue risk queue</h1>
        <p className="mt-2 text-sm text-steel">
          Canonical action queue ordered by breach likelihood, response due time, and unresolved hot opportunities.
        </p>
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-5 xl:grid-cols-6" method="get">
          {dealerOptions.length > 1 ? (
            <select name="dealer" className="input" defaultValue={dealerId || "all"}>
              <option value="all">All stores in scope</option>
              {dealerOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input type="hidden" name="dealer" value={dealerId || ""} />
          )}

          <select name="status" className="input" defaultValue={status}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select name="source" className="input" defaultValue={source}>
            {SOURCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select name="assigned" className="input" defaultValue={assigned}>
            {ASSIGNED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select name="queue" className="input" defaultValue={queue}>
            {QUEUE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button type="submit" className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90">
            Apply filters
          </button>
        </form>
      </section>

      {session.role !== "dealer_sales" ? (
        <QueueBulkActions
          leads={queueData.rows.map((row) => ({
            id: row.id,
            name: row.name,
            dealershipName: row.dealershipName
          }))}
          assignableUsers={assignableUsers.map((user) => ({ id: user.id, name: user.name }))}
        />
      ) : null}

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-steel">Rows in view</p>
            <p className="text-2xl font-semibold text-coal">{queueData.total}</p>
          </div>
          <p className="text-xs text-steel">
            Page {queueData.page} of {queueData.totalPages}
          </p>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Opportunity</th>
                <th className="px-3 py-2">Store</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Risk Score</th>
                <th className="px-3 py-2">SLA</th>
                <th className="px-3 py-2">Last activity</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {queueData.rows.length ? (
                queueData.rows.map((lead) => (
                  <tr key={lead.id} className="border-b border-steel/10">
                    <td className="px-3 py-3 font-medium text-coal">
                      <p>{lead.name}</p>
                      <p className="text-xs text-steel">{lead.vehicleInterest}</p>
                    </td>
                    <td className="px-3 py-3 text-steel">{lead.dealershipName}</td>
                    <td className="px-3 py-3 text-steel">{lead.source}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-steel/20 px-2 py-1 text-xs font-semibold text-coal">
                          {lead.status}
                        </span>
                        {lead.hotNotBooked ? (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-900">
                            Hot
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskScoreTone(lead.riskScorePct)}`}>
                        {lead.riskScorePct}/100
                      </span>
                    </td>
                    <td className="px-3 py-3 text-steel">
                      <SlaCountdown dueAt={lead.dueAt} breachedAt={lead.breachedAt} className="font-medium text-coal" />
                    </td>
                    <td className="px-3 py-3 text-steel">{new Date(lead.lastActivityAt).toLocaleString("en-ZA")}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Link href={`/os/conversations?lead=${lead.id}`} className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal">
                          Reply
                        </Link>
                        <a href={`tel:${lead.phone}`} className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal">
                          Call
                        </a>
                        <Link href={`/os/bookings?lead=${lead.id}`} className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal">
                          Book
                        </Link>
                        <Link href={`/os/conversations?lead=${lead.id}`} className="rounded-full bg-coal px-2 py-1 text-xs font-semibold text-white">
                          Assign
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-sm text-steel">
                    No opportunities match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/os/leads${queryString({ ...baseParams, page: Math.max(queueData.page - 1, 1) })}`}
            className={`rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold ${queueData.page <= 1 ? "pointer-events-none opacity-40" : "text-coal"}`}
          >
            Previous
          </Link>
          <Link
            href={`/os/leads${queryString({ ...baseParams, page: Math.min(queueData.page + 1, queueData.totalPages) })}`}
            className={`rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold ${queueData.page >= queueData.totalPages ? "pointer-events-none opacity-40" : "text-coal"}`}
          >
            Next
          </Link>
        </div>
      </section>
    </div>
  );
}

function riskScoreTone(score: number) {
  if (score >= 80) return "bg-red-100 text-red-800";
  if (score >= 55) return "bg-amber-100 text-amber-900";
  return "bg-emerald-100 text-emerald-800";
}
