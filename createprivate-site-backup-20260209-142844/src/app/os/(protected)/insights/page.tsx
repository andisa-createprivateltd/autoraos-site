import { requireDealerSession } from "@/lib/dealer-session";
import { getInsightsSnapshot } from "@/lib/os-data";

export default async function OsInsightsPage() {
  requireDealerSession();

  const insights = await getInsightsSnapshot();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Insights (Minimal)</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Operational indicators only</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Avg Response Time</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{insights.averageResponseTime}</p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Leads vs Bookings</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{insights.leadsVsBookings}</p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Missed After-hours Leads</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{insights.afterHoursMissedLeads}</p>
        </article>
      </section>

      <p className="text-xs text-steel">
        Snapshot generated: {insights.generatedAt} ({insights.mode === "live" ? "live data" : "sample data"})
      </p>
    </div>
  );
}
