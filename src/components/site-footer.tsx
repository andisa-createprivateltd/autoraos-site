import Link from "next/link";
import { NAV_LINKS, PARENT_COMPANY_NAME, PLATFORM_NAME, PLATFORM_SUBSIDIARY_LINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-steel/10 bg-coal text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-[2fr_1fr_1fr] md:px-6">
        <div>
          <p className="text-lg font-semibold">{PLATFORM_NAME}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/70">{PLATFORM_SUBSIDIARY_LINE}</p>
          <p className="mt-3 max-w-lg text-sm text-white/80">
            WhatsApp and lead operating system for automotive dealerships. Built to reduce response lag, increase
            bookings, and improve conversion outcomes.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-white/65">
            Private Beta • South Africa • Automotive-only platform
          </p>
          <p className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} {PARENT_COMPANY_NAME}. All rights reserved.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-white/70">Navigation</p>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/80 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-white/70">Legal</p>
          <Link href="/privacy" className="text-white/80 transition hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-white/80 transition hover:text-white">
            Terms of Service
          </Link>
          <Link href="/popia" className="text-white/80 transition hover:text-white">
            POPIA & Data Handling
          </Link>
        </div>
      </div>
    </footer>
  );
}
