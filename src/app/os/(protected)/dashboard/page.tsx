import Link from "next/link";
import { BookingActions } from "@/components/os/booking-actions";
import { OsMetricCard } from "@/components/os/os-metric-card";
import { requireDealerSession } from "@/lib/dealer-session";
import { getDashboardMetrics, getRecoverNowQueue, getUpcomingBookings } from "@/lib/os-data";

export default async function OsDashboardPage({
  searchParams
}: {
  searchParams: {
    denied?: string;
    dealer?: string;
  };
}) {
  const session = requireDealerSession();
  const dealerId = searchParams.dealer;

  const [metrics, bookings, recoverQueue] = await Promise.all([
    getDashboardMetrics({ dealerId }),
    getUpcomingBookings({ dealerId, window: "week" }),
    getRecoverNowQueue({ dealerId })
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Money View</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Are we losing money today?</h1>
        {metrics.mode === "sample" && session.role === "platform_owner" ? (
          <p className="mt-2 inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
            Demo Mode
          </p>
        ) : null}
      </header>

      {searchParams.denied ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Access restricted for your role on the requested screen.
        </div>
      ) : null}

      <section className="grid gap-2 md:grid-cols-3">
        <Link
          href={`/os/leads?queue=slow${dealerId ? `&dealer=${dealerId}` : ""}`}
          className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
        >
          ⚠ Leads not answered in 5 min: {metrics.unansweredFiveMinutes}
        </Link>
        <Link
          href={`/os/leads?queue=recover${dealerId ? `&dealer=${dealerId}` : ""}`}
          className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
        >
          ⚠ After-hours leads pending: {metrics.afterHoursPending}
        </Link>
        <Link
          href={`/os/leads?queue=hot${dealerId ? `&dealer=${dealerId}` : ""}`}
          className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
        >
          ⚠ Hot leads not booked: {metrics.hotLeadsNotBooked}
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <OsMetricCard
          label="New Leads (24h)"
          value={metrics.newLeads24h}
          href={`/os/leads?recent=24h${dealerId ? `&dealer=${dealerId}` : ""}`}
        />
        <OsMetricCard
          label="Response Time (avg)"
          value={metrics.responseTimeAvg}
          href={`/os/leads?queue=slow${dealerId ? `&dealer=${dealerId}` : ""}`}
        />
        <OsMetricCard
          label="Bookings Created"
          value={metrics.bookingsCreated}
          href={`/os/bookings?window=week${dealerId ? `&dealer=${dealerId}` : ""}`}
        />
        <OsMetricCard
          label="Missed Leads Alert"
          value={metrics.missedLeadsAlert}
          hint="After-hours and delayed follow-up risk"
          alert={metrics.missedLeadsAlert > 0}
          href={`/os/leads?queue=recover${dealerId ? `&dealer=${dealerId}` : ""}`}
        />
        <OsMetricCard
          label="Conversion Snapshot"
          value={metrics.conversionSnapshot}
          href={`/os/leads?queue=stuck${dealerId ? `&dealer=${dealerId}` : ""}`}
        />
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-coal">Recover Now ({recoverQueue.rows.length})</h2>
          <Link
            href={`/os/leads?queue=recover${dealerId ? `&dealer=${dealerId}` : ""}`}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-tide"
          >
            View full queue
          </Link>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Issue</th>
                <th className="px-3 py-2">Age</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recoverQueue.rows.map((item) => (
                <tr key={item.id} className="border-b border-steel/10">
                  <td className="px-3 py-2">
                    <p className="font-medium text-coal">{item.leadName}</p>
                    <p className="text-xs text-steel">{item.dealershipName}</p>
                  </td>
                  <td className="px-3 py-2 text-steel">{item.issueType}</td>
                  <td className="px-3 py-2 text-steel">{item.ageLabel}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      <Link href={`/os/conversations?lead=${item.leadId}${dealerId ? `&dealer=${dealerId}` : ""}`} className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal">
                        Reply
                      </Link>
                      <a href={`tel:${item.phone}`} className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal">
                        Call
                      </a>
                      <Link href={`/os/bookings?lead=${item.leadId}${dealerId ? `&dealer=${dealerId}` : ""}`} className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal">
                        Book
                      </Link>
                      <Link href={`/os/leads?assigned=unassigned&lead=${item.leadId}${dealerId ? `&dealer=${dealerId}` : ""}`} className="rounded-full border border-steel/25 px-2 py-1 text-xs font-semibold text-coal">
                        Assign
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-coal">Upcoming Bookings</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Dealership</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Assigned</th>
                <th className="px-3 py-2">Notes</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Workflow</th>
              </tr>
            </thead>
            <tbody>
              {bookings.bookings.slice(0, 8).map((item) => (
                <tr key={item.id} className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">{item.dealershipName}</td>
                  <td className="px-3 py-2 text-steel">{item.contactPerson}</td>
                  <td className="px-3 py-2 text-steel">{new Date(item.preferredDateTime).toLocaleString("en-ZA")}</td>
                  <td className="px-3 py-2 text-steel">{item.source}</td>
                  <td className="px-3 py-2 text-steel">{item.assignedTo}</td>
                  <td className="px-3 py-2 text-steel">{item.notes}</td>
                  <td className="px-3 py-2 text-steel">{item.status}</td>
                  <td className="px-3 py-2">
                    <BookingActions bookingId={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
