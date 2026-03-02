import { AssistantSettingsForm } from "@/components/os/assistant-settings-form";
import { requireDealerSession } from "@/lib/dealer-session";

export default async function OsAssistantPage() {
  await requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin"] });

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs uppercase tracking-[0.14em] text-tide">Policy Engine</p>
          <span className="rounded-full border border-steel/20 bg-mist/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-coal">
            System controlled
          </span>
        </div>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Operational policy controls</h1>
        <p className="mt-2 text-sm text-steel">
          Configure SLA definitions, escalation rules, and governance policies while core enforcement logic remains
          platform-controlled.
        </p>
      </header>

      <AssistantSettingsForm />
    </div>
  );
}
