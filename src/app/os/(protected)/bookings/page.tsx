import { BookingActions } from "@/components/os/booking-actions";
import { SlaCountdown } from "@/components/os/sla-countdown";
import { getCanonicalDealerOptions, getCanonicalExecutionRows } from "@/lib/autora-dashboard";
import { requireDealerSession, sanitizeDealerIdForSession } from "@/lib/dealer-session";

type BookingsPageSearchParams = {
  dealer?: string | string[];
  window?: string | string[];
  lead?: string | string[];
  page?: string | string[];
};

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

function normalizePage(value?: string | string[]) {
  const parsed = Number(getSingleSearchParam(value) || "1");
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

export default async function OsBookingsPage({
  searchParams
}: {
  searchParams: Promise<BookingsPageSearchParams>;
}) {
  const session = await requireDealerSession({
    roles: ["platform_owner", "platform_support", "dealer_admin", "dealer_sales"]
  });
  const params = await searchParams;
  const dealerId = sanitizeDealerIdForSession(session, normalizeDealerId(params.dealer));
  const windowFilter = (getSingleSearchParam(params.window) as "today" | "7d" | "30d" | undefined) || "7d";
  const leadId = getSingleSearchParam(params.lead)?.trim() || undefined;
  const page = normalizePage(params.page);

  const [dealerOptions, execution] = await Promise.all([
    getCanonicalDealerOptions(session),
    getCanonicalExecutionRows(session, {
      dealerId,
      window: windowFilter,
      page,
      pageSize: 25,
      leadId
    })
  ]);

  const showBookingValue = execution.rows.some((row) => row.showBookingValue);
  const baseParams = {
    dealer: dealerId,
    window: windowFilter === "7d" ? undefined : windowFilter,
    lead: leadId
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Execution</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Execution and confirmation control</h1>
        <p className="mt-2 text-sm text-steel">
          Confirm, complete, reschedule, or mark no-show with audit-backed status changes and revenue discipline.
        </p>
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-4 xl:grid-cols-5" method="get">
          {dealerOptions.length > 1 ? (
            <select name="dealer" defaultValue={dealerId || "all"} className="input">
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

          <select name="window" defaultValue={windowFilter} className="input">
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          <input name="lead" defaultValue={leadId} placeholder="Lead ID" className="input" />

          <button type="submit" className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90">
            Apply filters
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-steel">Rows in view</p>
            <p className="text-2xl font-semibold text-coal">{execution.total}</p>
          </div>
          <p className="text-xs text-steel">
            Page {execution.page} of {execution.totalPages}
          </p>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Store</th>
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Vehicle</th>
                <th className="px-3 py-2">Scheduled</th>
                {showBookingValue ? <th className="px-3 py-2">Booking value</th> : null}
                <th className="px-3 py-2">SLA status</th>
                <th className="px-3 py-2">Countdown</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {execution.rows.length ? (
                execution.rows.map((booking) => (
                  <tr key={booking.id} className="border-b border-steel/10">
                    <td className="px-3 py-3">
                      <p className="font-medium text-coal">{booking.dealershipName}</p>
                      <p className="text-xs text-steel">{booking.city}</p>
                    </td>
                    <td className="px-3 py-3 text-steel">{booking.contactPerson}</td>
                    <td className="px-3 py-3 text-steel">{booking.vehicleInterest}</td>
                    <td className="px-3 py-3 text-steel">{new Date(booking.scheduledFor).toLocaleString("en-ZA")}</td>
                    {showBookingValue ? (
                      <td className="px-3 py-3 text-steel">
                        {booking.showBookingValue
                          ? new Intl.NumberFormat("en-ZA", {
                              style: "currency",
                              currency: "ZAR",
                              maximumFractionDigits: 0
                            }).format(booking.bookingValue)
                          : "Hidden"}
                      </td>
                    ) : null}
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${slaTone(booking.slaStatus)}`}>
                        {booking.slaStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-steel">
                      <SlaCountdown dueAt={booking.dueAt} breachedAt={booking.breachedAt} className="font-medium text-coal" />
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full border border-steel/20 px-2 py-1 text-xs font-semibold text-coal">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <BookingActions bookingId={booking.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={showBookingValue ? 9 : 8} className="px-3 py-6 text-center text-sm text-steel">
                    No bookings found for the selected view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <a
            href={`/os/bookings${queryString({ ...baseParams, page: Math.max(execution.page - 1, 1) })}`}
            className={`rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold ${execution.page <= 1 ? "pointer-events-none opacity-40" : "text-coal"}`}
          >
            Previous
          </a>
          <a
            href={`/os/bookings${queryString({ ...baseParams, page: Math.min(execution.page + 1, execution.totalPages) })}`}
            className={`rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold ${execution.page >= execution.totalPages ? "pointer-events-none opacity-40" : "text-coal"}`}
          >
            Next
          </a>
        </div>
      </section>
    </div>
  );
}

function slaTone(status: string) {
  if (status === "Breached") return "bg-red-100 text-red-800";
  if (status === "At Risk") return "bg-amber-100 text-amber-900";
  return "bg-emerald-100 text-emerald-800";
}
