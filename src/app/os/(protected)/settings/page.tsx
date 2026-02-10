import { SystemSettingsForm } from "@/components/os/system-settings-form";
import { requireDealerSession } from "@/lib/dealer-session";

export default function OsSettingsPage() {
  requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin"] });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">Settings</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Users, WhatsApp, availability, billing</h1>
      </header>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-coal">Users</h2>
        <div className="mt-3 grid gap-2 text-sm text-steel">
          <p>• Platform Owner: all-dealer controls, billing, logs, API-key governance</p>
          <p>• Platform Support: setup + operations, no billing/logs/API-key access</p>
          <p>• Dealer Admin: dealership settings + operations</p>
          <p>• Dealer Sales: inbox, leads, bookings, insights</p>
          <p>• Dealer Marketing: metrics-only access</p>
        </div>
      </section>

      <SystemSettingsForm />
    </div>
  );
}
