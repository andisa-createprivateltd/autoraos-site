"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { AutoraLogo } from "@/components/autora-logo";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#081019] text-white">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-[clamp(20px,4vw,48px)] py-[15px]">
        <Link href="/" className="hidden shrink-0 md:block" aria-label="AUTORA OS home">
          <AutoraLogo variant="light" className="text-[1rem] tracking-[0.32em]" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.filter((link) => link.href !== "/").map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} data-active={active} className="autora-nav-link">
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link href="/os/login" className="autora-header-link text-white/58 transition hover:text-white">Login</Link>
          <Link href="/request-audit" className="autora-button autora-button--accent min-h-[46px] px-[1.45rem]">Request Audit</Link>
        </div>

        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <Link href="/request-audit" className="autora-button autora-button--accent min-h-[46px] px-[1.2rem] text-[9px]">
            Request Audit
          </Link>
          <details className="relative">
          <summary aria-label="Open navigation" className="flex h-[46px] w-[46px] list-none cursor-pointer items-center justify-center border border-white/35 text-white [&::-webkit-details-marker]:hidden">
            <span className="grid w-[19px] gap-[4px]" aria-hidden="true">
              <span className="h-px bg-white" />
              <span className="h-px bg-white" />
              <span className="h-px bg-white" />
            </span>
          </summary>
          <div className="absolute right-0 mt-3 w-72 border border-white/15 bg-[#081019] p-4">
            <div className="grid gap-1">
              {NAV_LINKS.filter((link) => link.href !== "/").map((link) => (
                <Link key={link.href} href={link.href} className={cn("border-b border-white/10 py-3 font-mono-ap text-[10px] uppercase tracking-[0.18em] text-white/75", pathname === link.href && "text-white")}>
                  {link.label}
                </Link>
              ))}
              <ButtonLink href="/os/login" variant="ghost" className="mt-4 w-full">Login</ButtonLink>
              <ButtonLink href="/request-audit" className="mt-2 w-full">Request Audit</ButtonLink>
            </div>
          </div>
          </details>
        </div>
      </div>
    </header>
  );
}
