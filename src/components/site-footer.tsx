import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="footer-enter mt-20 border-t border-white/10 bg-[#0b0d10] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-[2fr_1fr_1fr] md:px-6">
        <div>
          <p className="text-lg font-semibold tracking-[0.09em]">{PLATFORM_NAME} OS</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/64">
            Revenue discipline for dealership leads
          </p>
          <p className="mt-3 max-w-lg text-sm text-white/80">
            WhatsApp-first lead operations, SLA enforcement, booking execution, and governance controls for dealership teams.
          </p>
          <p className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} AUTORA OS. All rights reserved.</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Navigation</p>
          <Link href="/" className="block text-white/80 transition hover:text-white">
            Home
          </Link>
          <Link href="/platform" className="block text-white/80 transition hover:text-white">
            Platform
          </Link>
          <Link href="/integrations" className="block text-white/80 transition hover:text-white">
            Integrations
          </Link>
          <Link href="/how-it-works" className="block text-white/80 transition hover:text-white">
            How It Works
          </Link>
          <Link href="/pricing" className="block text-white/80 transition hover:text-white">
            Pricing
          </Link>
          <Link href="/enterprise" className="block text-white/80 transition hover:text-white">
            Enterprise
          </Link>
          <Link href="/security" className="block text-white/80 transition hover:text-white">
            Security
          </Link>
          <Link href="/contact" className="block text-white/80 transition hover:text-white">
            Contact
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Legal</p>
          <Link href="/privacy" className="block text-white/80 transition hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="block text-white/80 transition hover:text-white">
            Terms
          </Link>
          <Link href="/popia" className="block text-white/80 transition hover:text-white">
            POPIA
          </Link>
          <Link href="/os/login" className="block text-white/80 transition hover:text-white">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
