"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canAccessScreen, type DealerRole } from "@/lib/os-access";
import { cn } from "@/lib/utils";

type OsShellNavProps = {
  role: DealerRole;
};

const items = [
  { id: "dashboard", href: "/os/dashboard", label: "Dashboard" },
  { id: "conversations", href: "/os/conversations", label: "Conversations" },
  { id: "leads", href: "/os/leads", label: "Leads" },
  { id: "bookings", href: "/os/bookings", label: "Bookings" },
  { id: "assistant", href: "/os/assistant", label: "AI Assistant" },
  { id: "insights", href: "/os/insights", label: "Insights" },
  { id: "settings", href: "/os/settings", label: "Settings" }
] as const;

export function OsShellNav({ role }: OsShellNavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1" aria-label="AUTORA OS navigation">
      {items
        .filter((item) => canAccessScreen(role, item.id))
        .map((item) => (
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
    </nav>
  );
}
