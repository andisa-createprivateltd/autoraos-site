import { AssistantSettingsForm } from "@/components/os/assistant-settings-form";
import { requireDealerSession } from "@/lib/dealer-session";

export default function OsAssistantPage() {
  requireDealerSession({ roles: ["platform_owner", "platform_support", "dealer_admin"] });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.14em] text-tide">AI Assistant Admin</p>
        <h1 className="mt-1 text-3xl font-semibold text-coal">Dealer-editable content controls</h1>
        <p className="mt-2 text-sm text-steel">
          Dealers can adjust business context and messaging rules. Core automation logic remains controlled by the AUTORA platform team.
        </p>
      </header>

      <AssistantSettingsForm />
    </div>
  );
}
