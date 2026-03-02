import { getCanonicalInsightsSnapshot } from "@/lib/autora-dashboard";
import { requireDealerSession } from "@/lib/dealer-session";

export default async function OsInsightsPage() {
  const session = await requireDealerSession();
  const insights = await getCanonicalInsightsSnapshot(session);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Visibility</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Network discipline indicators</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Avg Response Time</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{insights.averageResponseTime}</p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Queue vs Execution</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{insights.leadsVsBookings}</p>
        </article>
        <article className="rounded-2xl border border-steel/12 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.13em] text-steel">Missed After-hours Opportunities</p>
          <p className="mt-2 text-2xl font-semibold text-coal">{insights.afterHoursMissedLeads}</p>
        </article>
      </section>

      <p className="text-xs text-steel">Snapshot generated: {insights.generatedAt}</p>
    </div>
  );
}
