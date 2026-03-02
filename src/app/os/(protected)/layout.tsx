import Link from "next/link";
import type { ReactNode } from "react";
import { getCanonicalDealerOptions } from "@/lib/autora-dashboard";
import { DealerContextSwitch } from "@/components/os/dealer-context-switch";
import { LogoutButton } from "@/components/os/logout-button";
import { OsShellNav } from "@/components/os/os-shell-nav";
import {
  filterDealerOptionsForSession,
  getSessionDefaultDealerId,
  getSessionDealerScope,
  requireDealerSession
} from "@/lib/dealer-session";

function formatRole(role: string) {
  return role
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export default async function OsProtectedLayout({ children }: { children: ReactNode }) {
  const session = await requireDealerSession({ redirectTo: "/os/login" });
  const canCrossStore = ["platform_owner", "platform_support", "dealer_admin", "dealer_marketing"].includes(
    session.role
  );
  const allDealerOptions = canCrossStore ? await getCanonicalDealerOptions(session) : [];
  const dealerOptions = filterDealerOptionsForSession(session, allDealerOptions);
  const scopedDealerIds = getSessionDealerScope(session);
  const defaultDealerId = getSessionDefaultDealerId(session);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:h-fit">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">AUTORA OS</p>
        <p className="mt-1 text-sm font-semibold text-coal">{session.name}</p>
        <p className="text-xs uppercase tracking-[0.1em] text-steel">{formatRole(session.role)}</p>

        <div className="mt-4">
          <OsShellNav role={session.role} />
        </div>

        {canCrossStore ? (
          <div className="mt-4">
            <DealerContextSwitch
              options={dealerOptions}
              selectedDealerId={defaultDealerId}
              label="Store"
              allowAllOption={!scopedDealerIds || scopedDealerIds.length > 1}
            />
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between">
          <Link href="/" className="text-xs font-semibold text-tide underline underline-offset-2">
            Marketing site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <section className="space-y-6">{children}</section>
    </div>
  );
}
