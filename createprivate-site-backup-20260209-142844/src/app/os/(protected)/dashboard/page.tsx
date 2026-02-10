import { OsMetricCard } from "@/components/os/os-metric-card";
import { requireDealerSession } from "@/lib/dealer-session";
import { getDashboardMetrics, getUpcomingBookings } from "@/lib/os-data";

export default async function OsDashboardPage({
  searchParams
}: {
  searchParams: {
    denied?: string;
  };
}) {
  requireDealerSession();

  const [metrics, bookings] = await Promise.all([getDashboardMetrics(), getUpcomingBookings()]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Money View</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Are we losing money today?</h1>
        {metrics.mode === "sample" ? (
          <p className="mt-2 text-xs text-steel">Supabase not connected. Showing sample operational data.</p>
        ) : null}
      </header>

      {searchParams.denied ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Access restricted for your role on the requested screen.
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <OsMetricCard label="New Leads (24h)" value={metrics.newLeads24h} />
        <OsMetricCard label="Response Time (avg)" value={metrics.responseTimeAvg} />
        <OsMetricCard label="Bookings Created" value={metrics.bookingsCreated} />
        <OsMetricCard
          label="Missed Leads Alert"
          value={metrics.missedLeadsAlert}
          hint="After-hours and delayed follow-up risk"
          alert={metrics.missedLeadsAlert > 0}
        />
        <OsMetricCard label="Conversion Snapshot" value={metrics.conversionSnapshot} />
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
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.bookings.slice(0, 8).map((item) => (
                <tr key={item.id} className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">{item.dealershipName}</td>
                  <td className="px-3 py-2 text-steel">{item.contactPerson}</td>
                  <td className="px-3 py-2 text-steel">{new Date(item.preferredDateTime).toLocaleString("en-ZA")}</td>
                  <td className="px-3 py-2 text-steel">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
