"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canAccessScreen, type DealerRole } from "@/lib/os-access";
import { cn } from "@/lib/utils";

type OsShellNavProps = {
  role: DealerRole;
};

const sections = [
  {
    heading: "Operations",
    items: [
      { id: "dashboard", href: "/os/dashboard", label: "Dashboard" },
      { id: "conversations", href: "/os/conversations", label: "Inbox" },
      { id: "leads", href: "/os/leads", label: "Queue" },
      { id: "bookings", href: "/os/bookings", label: "Execution" },
      { id: "assistant", href: "/os/assistant", label: "Policy Engine" },
      { id: "insights", href: "/os/insights", label: "Visibility" },
      { id: "reports", href: "/os/reports", label: "Reports" }
    ]
  },
  {
    heading: "Governance",
    items: [
      { id: "audit-logs", href: "/os/audit-logs", label: "Audit Logs" }
    ]
  },
  {
    heading: "Admin",
    items: [{ id: "settings", href: "/os/settings", label: "Settings" }]
  }
] as const;

export function OsShellNav({ role }: OsShellNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-5" aria-label="AUTORA OS navigation">
      {sections.map((section) => {
        const visibleItems = section.items.filter((item) => canAccessScreen(role, item.id));
        if (!visibleItems.length) return null;

        return (
          <div key={section.heading} className="space-y-2">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-steel/80">
              {section.heading}
            </p>
            <div className="grid gap-1">
              {visibleItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium text-steel transition hover:bg-mist hover:text-coal",
                    pathname === item.href && "bg-coal text-white hover:bg-coal hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
