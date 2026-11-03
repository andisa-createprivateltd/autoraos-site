"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AutoraLogo } from "@/components/autora-logo";
import { NAV_LINKS } from "@/lib/constants";

const headerLinks = NAV_LINKS.filter((link) => link.href !== "/");

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#081019] text-white">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] py-[15px]">
        <Link href="/" className="shrink-0" aria-label="AUTORA OS home">
          <AutoraLogo variant="light" className="text-[0.92rem]" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {headerLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} data-active={active} className="autora-nav-link">
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/os/login" className="autora-header-link text-white/58 transition hover:text-white">
            Login
          </Link>
          <Link href="/request-audit" className="autora-button autora-button--accent min-h-[46px] px-[1.45rem]">
            Request Audit
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/request-audit" className="autora-button autora-button--accent hidden min-h-[46px] px-[1.45rem] sm:inline-flex">
            Request Audit
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            aria-expanded={mobileOpen}
            aria-controls="autora-mobile-nav"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-white transition hover:bg-white/5"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id="autora-mobile-nav" className="border-t border-white/10 px-[clamp(20px,4vw,48px)] py-4 lg:hidden">
          <nav className="grid" aria-label="Mobile navigation">
            {headerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/10 py-4 font-mono-ap text-[10px] font-medium uppercase tracking-[0.2em] text-white/80"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/os/login" onClick={() => setMobileOpen(false)} className="border-b border-white/10 py-4 font-mono-ap text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
              Login
            </Link>
            <Link href="/request-audit" onClick={() => setMobileOpen(false)} className="autora-button autora-button--accent mt-5 w-full">
              Request Audit
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
