import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-steel/10 bg-coal text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-[2fr_1fr] md:px-6">
        <div>
          <p className="text-lg font-semibold">CreatePrivate Dealer OS</p>
          <p className="mt-3 max-w-lg text-sm text-white/80">
            WhatsApp and lead operating system for automotive dealerships. Built to reduce response lag, increase
            bookings, and improve conversion outcomes.
          </p>
          <p className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} CreatePrivateLtd. All rights reserved.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/80 hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
