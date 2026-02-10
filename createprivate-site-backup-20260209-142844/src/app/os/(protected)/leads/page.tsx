import { requireDealerSession } from "@/lib/dealer-session";
import { getLeadsOverview } from "@/lib/os-data";

type LeadsPageSearchParams = {
  status?: string | string[];
  source?: string | string[];
  assigned?: string | string[];
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "visited", label: "Visited" },
  { value: "sold", label: "Sold" },
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

function normalizeParam(value?: string | string[]) {
  if (!value || Array.isArray(value)) return "all";
  return value;
}

export default async function OsLeadsPage({ searchParams }: { searchParams: LeadsPageSearchParams }) {
  requireDealerSession();

  const status = normalizeParam(searchParams.status);
  const source = normalizeParam(searchParams.source);
  const assigned = normalizeParam(searchParams.assigned);

  const { leads, mode } = await getLeadsOverview({ status, source, assigned });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Leads</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Lead queue with operational tags</h1>
        <p className="mt-2 text-sm text-steel">Filter by status, source, and assignment to prioritize conversion work.</p>
        {mode === "sample" ? <p className="mt-1 text-xs text-steel">Sample data mode.</p> : null}
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-4" method="get">
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

          <button type="submit" className="rounded-full bg-coal px-4 py-2 text-sm font-semibold text-white hover:bg-coal/90">
            Apply filters
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Vehicle</th>
                <th className="px-3 py-2">Assigned</th>
                <th className="px-3 py-2">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">
                    <p>{lead.name}</p>
                    <p className="text-xs text-steel">First contact: {new Date(lead.firstContactAt).toLocaleString("en-ZA")}</p>
                  </td>
                  <td className="px-3 py-2 text-steel">{lead.phone}</td>
                  <td className="px-3 py-2 text-steel">{lead.source}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-steel/20 px-2 py-1 text-xs font-semibold text-coal">{lead.status}</span>
                  </td>
                  <td className="px-3 py-2 text-steel">{lead.vehicleInterest}</td>
                  <td className="px-3 py-2 text-steel">{lead.assignedTo}</td>
                  <td className="px-3 py-2 text-steel">{new Date(lead.lastActivityAt).toLocaleString("en-ZA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
