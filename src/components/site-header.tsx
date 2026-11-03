"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AutoraLogo } from "@/components/autora-logo";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { label: "Operations", href: "/platform" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Security", href: "/security" }
] as const;

const utilityLinks = [
  { label: "Our networks", href: "/platform" },
  { label: "Contact us", href: "/contact" },
  { label: "Login", href: "/os/login" }
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="volvo-header">
      <div className="volvo-header__utility">
        <div className="volvo-container volvo-header__utility-inner">
          <span className="volvo-header__utility-note">Revenue control infrastructure</span>
          <div className="volvo-header__utility-links">
            <Link href="/platform">Our networks</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/os/login">Login</Link>
          </div>
        </div>
      </div>

      <div className="volvo-container volvo-header__main">
        <Link href="/" className="volvo-header__logo" aria-label="AUTORA OS home">
          <AutoraLogo className="text-[1.02rem] tracking-[0.38em]" />
        </Link>

        <nav className="volvo-header__nav" aria-label="Main navigation">
          {primaryLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={cn("volvo-header__nav-link", active && "is-active")}>
                {link.label}
              </Link>
            );
          })}
          <Link href="/pricing" className={cn("volvo-header__nav-link", pathname === "/pricing" && "is-active")}>
            Pricing
          </Link>
        </nav>

        <Link href="/request-audit" className="volvo-header__cta">
          Request audit
        </Link>

        <details className="volvo-header__mobile">
          <summary aria-label="Open navigation">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </summary>
          <div className="volvo-header__mobile-panel">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className={pathname === link.href ? "is-active" : ""}>
                {link.label}
              </Link>
            ))}
            <Link href="/pricing" className={pathname === "/pricing" ? "is-active" : ""}>Pricing</Link>
            {utilityLinks.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
            <Link href="/request-audit" className="volvo-header__mobile-cta">Request audit</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
