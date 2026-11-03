import Link from "next/link";
import { AutoraLogo } from "@/components/autora-logo";

const navigation = [
  ["Platform", "/platform"],
  ["How It Works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["Enterprise", "/enterprise"],
  ["Security", "/security"],
  ["Founder", "/founder-narrative"],
  ["Integrations", "/integrations"],
  ["Contact", "/contact"],
  ["Revenue Audit", "/request-audit"]
] as const;

const access = [
  ["Login", "/os/login"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["POPIA", "/popia"]
] as const;

function FooterColumn({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div>
      <p className="mb-5 font-mono-ap text-[10px] uppercase tracking-[0.2em] text-white/45">{title}</p>
      <div className="grid gap-3">
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="font-mono-ap text-[10px] uppercase tracking-[0.16em] text-white/70 transition hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-[clamp(24px,5vw,80px)] py-[clamp(64px,8vw,104px)]">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <AutoraLogo variant="light" className="text-[0.96rem]" />
            <p className="mt-7 max-w-[520px] font-sans-ap text-[14px] font-light leading-[1.85] text-white/56">
              Operational command infrastructure for dealership networks. Govern urgency, booking execution, auditability, and revenue accountability across every store in the group.
            </p>
            <p className="mt-9 font-mono-ap text-[10px] uppercase tracking-[0.16em] text-white/45">© 2026 AUTORA OS. ALL RIGHTS RESERVED.</p>
          </div>
          <FooterColumn title="Navigation" links={navigation} />
          <FooterColumn title="Access" links={access} />
        </div>
      </div>
    </footer>
  );
}
