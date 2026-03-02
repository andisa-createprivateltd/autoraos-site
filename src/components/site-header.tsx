"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, PLATFORM_NAME } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="header-enter sticky top-0 z-40 border-b border-black/10 bg-[#f5f6f8]/88 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0" aria-label={`${PLATFORM_NAME} home`}>
          <div>
            <p className="text-[1.05rem] font-semibold tracking-[0.11em] text-coal">{PLATFORM_NAME} OS</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-steel">Revenue Discipline for Dealership Leads</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-[13px] font-medium tracking-[0.01em] transition",
                  active ? "bg-coal text-white" : "text-steel hover:bg-black/5 hover:text-coal"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <ButtonLink href="/os/login" variant="ghost" eventName="cta_login_click" eventParams={{ location: "header" }}>
              Login
            </ButtonLink>
            <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "header" }}>
              Request Revenue Audit
            </ButtonLink>
          </div>
        </div>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-coal/30 bg-white px-4 py-2 text-sm font-semibold text-coal">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-coal/15 bg-white p-3 shadow-soft">
            <div className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium text-steel hover:bg-black/5 hover:text-coal",
                    pathname === link.href && "bg-black text-white hover:bg-black hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <ButtonLink href="/os/login" variant="ghost" className="mt-2 w-full" eventName="cta_login_click" eventParams={{ location: "mobile_menu" }}>
                Login
              </ButtonLink>
              <ButtonLink href="/request-audit" className="mt-2 w-full" eventName="cta_request_audit_click" eventParams={{ location: "mobile_menu" }}>
                Request Revenue Audit
              </ButtonLink>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
