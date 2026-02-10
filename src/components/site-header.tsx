"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, PLATFORM_NAME, PLATFORM_SUBSIDIARY_LINE } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

function shortMenuLabel(label: string) {
  if (label === "AUTORA OS") return "OS";
  if (label === "Dealerships Near Me") return "Near Me";
  return label;
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-steel/10 bg-white/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0" aria-label={`${PLATFORM_NAME} home`}>
          <div>
            <p className="text-[1.05rem] font-semibold tracking-[0.06em] text-coal">{PLATFORM_NAME}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-steel">{PLATFORM_SUBSIDIARY_LINE}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  active ? "bg-mist text-coal" : "text-steel hover:bg-mist/70 hover:text-coal"
                )}
              >
                {shortMenuLabel(link.label)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <ButtonLink href="/os/login" variant="ghost">
              Login
            </ButtonLink>
            <ButtonLink href="/book">Book Free 15-Minute Dealer Audit</ButtonLink>
          </div>
        </div>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-steel/28 bg-white px-4 py-2 text-sm font-semibold text-coal">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-steel/15 bg-white p-3 shadow-soft">
            <div className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium text-steel hover:bg-mist/85 hover:text-coal",
                    pathname === link.href && "bg-mist text-coal"
                  )}
                  >
                    {shortMenuLabel(link.label)}
                </Link>
              ))}
              <ButtonLink href="/os/login" variant="ghost" className="mt-2 w-full">
                Login
              </ButtonLink>
              <ButtonLink href="/book" className="mt-2 w-full">
                Book Free 15-Minute Dealer Audit
              </ButtonLink>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
