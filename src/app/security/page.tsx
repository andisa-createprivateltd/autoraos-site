import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Security",
  description:
    "Review AUTORA OS security controls for HTTPS and TLS transport, role-based access control, immutable audit logs, RLS-enforced store isolation, and POPIA-aligned handling.",
  path: "/security"
});

const roleMatrix = [
  {
    role: "Platform Owner",
    access: "All dealers, governance rules, audit logs, and implementation oversight.",
    restrictions: "No platform secrets are exposed client-side."
  },
  {
    role: "Platform Support",
    access: "Dealer setup, operational diagnostics, and scoped support actions.",
    restrictions: "No billing control, no raw key visibility, all actions audited."
  },
  {
    role: "Dealer Admin",
    access: "Users, local policies, reporting, and store configuration.",
    restrictions: "No cross-dealer visibility."
  },
  {
    role: "Dealer Sales",
    access: "Inbox, lead actions, bookings, and assigned workflows.",
    restrictions: "No governance or billing controls."
  },
  {
    role: "Dealer Marketing",
    access: "Metrics and compliance views only.",
    restrictions: "PII and message bodies can be redacted by policy."
  }
] as const;

const controls = [
  "Data encrypted in transit (HTTPS/TLS)",
  "Role-based access control",
  "Immutable audit trail",
  "Store-level data isolation with RLS enforcement",
  "POPIA-aligned data handling"
] as const;

const governanceNotes = [
  "Platform credentials are stored server-side and are not exposed to dealership users.",
  "Support actions are auditable and traceable by role, user, and timestamp.",
  "Data access is scoped by store or group membership before application-level access is granted.",
  "Incident review follows logged audit evidence rather than informal support access."
] as const;

export default function SecurityPage() {
  const updatedAt = new Date().toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="page-motion space-y-10">
      <section className="panel-dark p-7 md:p-9">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Security</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
          Security controls built for governed dealership operations
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">
          AUTORA OS is structured for dealership teams that require store isolation, auditable actions, and clear access boundaries between platform staff and dealership users.
        </p>
      </section>

      <section className="surface-card p-6 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-steel">Security summary</p>
            <h2 className="section-heading mt-2 text-2xl font-semibold text-coal">Core controls</h2>
          </div>
          <p className="text-xs uppercase tracking-[0.12em] text-steel">Last updated: {updatedAt}</p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {controls.map((item) => (
            <article key={item} className="rounded-2xl border border-steel/14 bg-white p-4">
              <p className="text-sm font-semibold text-coal">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card p-6 md:p-7">
        <h2 className="section-heading text-2xl font-semibold text-coal">Role-based access matrix</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Access scope</th>
                <th className="px-3 py-2">Restriction</th>
              </tr>
            </thead>
            <tbody>
              {roleMatrix.map((row) => (
                <tr key={row.role} className="border-b border-steel/10">
                  <td className="px-3 py-2 font-medium text-coal">{row.role}</td>
                  <td className="px-3 py-2 text-steel">{row.access}</td>
                  <td className="px-3 py-2 text-steel">{row.restrictions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="page-shell p-6 md:p-7">
          <h2 className="section-heading text-2xl font-semibold text-coal">Governance notes</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            {governanceNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="page-shell p-6 md:p-7">
          <h2 className="section-heading text-2xl font-semibold text-coal">Security contact</h2>
          <p className="mt-3 text-sm leading-relaxed text-steel">
            Security reviews, access questions, and incident coordination are handled through the platform team with auditable support procedures.
          </p>
          <p className="mt-4 text-sm text-steel">
            Contact:{" "}
            <a href="mailto:security@autoraos.company" className="font-semibold text-tide underline underline-offset-2">
              security@autoraos.company
            </a>
          </p>
        </article>
      </section>
    </div>
  );
}
