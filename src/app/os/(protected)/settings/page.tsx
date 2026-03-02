import { getSettingsSnapshot } from "@/lib/autora-dashboard";
import { requireDealerSession } from "@/lib/dealer-session";

export default async function OsSettingsPage() {
  const session = await requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin"] });
  const snapshot = await getSettingsSnapshot(session);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Settings</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Operational administration</h1>
        <p className="mt-2 text-sm text-steel">
          User roles, store scope, integration health, SLA context, and billing visibility for governed dealership operations.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 rounded-3xl border border-steel/12 bg-white p-3 shadow-sm">
        {[
          ["users-roles", "Users & Roles"],
          ["stores-hours", "Stores & Business Hours"],
          ["whatsapp-status", "WhatsApp Integration Status"],
          ["sla-policies", "SLA Policies"],
          ["billing", "Billing"]
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-steel/20 px-3 py-1.5 text-xs font-semibold text-coal">
            {label}
          </a>
        ))}
      </nav>

      <section id="users-roles" className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-coal">Users & Roles</h2>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Store</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.users.length ? (
                snapshot.users.map((user) => (
                  <tr key={user.user_id} className="border-b border-steel/10">
                    <td className="px-3 py-2 font-medium text-coal">{user.full_name || user.user_id}</td>
                    <td className="px-3 py-2 text-steel">{formatRole(user.role)}</td>
                    <td className="px-3 py-2 text-steel">{user.dealership_id || "Group scope"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-steel">
                    {snapshot.provenance === "live" ? "No users found in scope." : "Not configured"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="stores-hours" className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-coal">Stores & Business Hours</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {snapshot.stores.length ? (
            snapshot.stores.map((store) => (
              <div key={store.id} className="rounded-2xl border border-steel/12 bg-mist/30 p-4">
                <p className="font-semibold text-coal">{store.name}</p>
                <p className="mt-1 text-sm text-steel">{store.city || "City not configured"}</p>
                <p className="mt-2 text-xs text-steel">Business hours governed by canonical SLA policy configuration.</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-steel/12 bg-mist/30 p-4 text-sm text-steel">Not configured</div>
          )}
        </div>
      </section>

      <section id="whatsapp-status" className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-coal">WhatsApp Integration Status</h2>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${snapshot.whatsapp.status === "configured" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
            {snapshot.whatsapp.status}
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Connection" value={snapshot.whatsapp.status} />
          <InfoCard
            label="Last webhook received"
            value={snapshot.whatsapp.lastWebhookAt ? new Date(snapshot.whatsapp.lastWebhookAt).toLocaleString("en-ZA") : "Not configured"}
          />
          <InfoCard
            label="Message volume today"
            value={snapshot.whatsapp.messageVolumeToday === null ? "Not configured" : String(snapshot.whatsapp.messageVolumeToday)}
          />
          <InfoCard label="Phone number ID" value={snapshot.whatsapp.maskedPhoneNumberId || "Masked / unavailable"} />
        </div>
        <p className="mt-4 text-sm text-steel">{snapshot.whatsapp.reconnectInstructions}</p>
      </section>

      <section id="sla-policies" className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-coal">SLA Policies</h2>
          <span className="rounded-full border border-steel/20 bg-mist/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-coal">
            Platform controlled
          </span>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-steel">
          <p>First-response, after-hours, hot-booking, and no-show reminder rules are enforced from the canonical SLA engine.</p>
          <p>Policy edits, overrides, and governance changes are traceable through the immutable audit log.</p>
          <a href="/os/audit-logs?action=policy_update" className="font-semibold text-coal underline-offset-4 hover:underline">
            View change history
          </a>
        </div>
      </section>

      <section id="billing" className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-coal">Billing</h2>
        <div className="mt-4 rounded-2xl border border-steel/12 bg-mist/30 p-4 text-sm text-steel">
          Billing is display-only until live billing is connected. Store-level platform access, SLA enforcement, and audit governance remain active.
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-steel/12 bg-mist/30 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-steel">{label}</p>
      <p className="mt-2 text-sm font-semibold text-coal">{value}</p>
    </div>
  );
}

function formatRole(role: string) {
  return role
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}
