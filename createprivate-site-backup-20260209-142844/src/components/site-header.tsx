"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-steel/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0" aria-label="CreatePrivateLtd home">
          <Image src="/createprivate-logo.svg" alt="CreatePrivateLtd" width={170} height={48} priority />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-steel transition hover:text-coal",
                  active && "text-coal"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <ButtonLink href="/os/login" variant="ghost">
              Dealer OS Login
            </ButtonLink>
            <ButtonLink href="/book">Book Audit</ButtonLink>
          </div>
        </div>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-steel/30 px-3 py-2 text-sm font-semibold text-coal">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-steel/15 bg-white p-3 shadow-soft">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm text-steel hover:bg-mist hover:text-coal",
                    pathname === link.href && "bg-mist text-coal"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <ButtonLink href="/os/login" variant="ghost" className="mt-2 w-full">
                Dealer OS Login
              </ButtonLink>
              <ButtonLink href="/book" className="mt-2 w-full">
                Book Audit
              </ButtonLink>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
