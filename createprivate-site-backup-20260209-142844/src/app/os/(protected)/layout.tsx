import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/os/logout-button";
import { OsShellNav } from "@/components/os/os-shell-nav";
import { requireDealerSession } from "@/lib/dealer-session";

function formatRole(role: string) {
  return role
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export default function OsProtectedLayout({ children }: { children: ReactNode }) {
  const session = requireDealerSession({ redirectTo: "/os/login" });

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-3xl border border-steel/12 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:h-fit">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Dealer OS</p>
        <p className="mt-1 text-sm font-semibold text-coal">{session.name}</p>
        <p className="text-xs uppercase tracking-[0.1em] text-steel">{formatRole(session.role)}</p>

        <div className="mt-4">
          <OsShellNav role={session.role} />
        </div>

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
