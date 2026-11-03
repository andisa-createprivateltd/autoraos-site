import Link from "next/link";
import { AutoraLogo } from "@/components/autora-logo";

const columns = [
  {
    title: "Operations",
    links: [
      ["Platform", "/platform"],
      ["How it works", "/how-it-works"],
      ["Integrations", "/integrations"],
      ["Pricing", "/pricing"]
    ]
  },
  {
    title: "Company",
    links: [
      ["Enterprise", "/enterprise"],
      ["Security", "/security"],
      ["Founder", "/founder-narrative"],
      ["Contact us", "/contact"]
    ]
  },
  {
    title: "Access",
    links: [
      ["Login", "/os/login"],
      ["Request audit", "/request-audit"],
      ["Privacy", "/privacy"],
      ["POPIA", "/popia"]
    ]
  }
] as const;

export function SiteFooter() {
  return (
    <footer className="volvo-footer">
      <div className="volvo-container volvo-footer__main">
        <div className="volvo-footer__identity">
          <AutoraLogo className="text-[1.02rem] tracking-[0.38em]" />
          <p>
            Operational command infrastructure for dealership networks. Govern urgency, booking execution, auditability,
            and revenue accountability across every store in the group.
          </p>
        </div>
        <div className="volvo-footer__columns">
          {columns.map((column) => (
            <div key={column.title} className="volvo-footer__column">
              <h2>{column.title}</h2>
              {column.links.map(([label, href]) => (
                <Link key={label} href={href}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="volvo-footer__legal">
        <div className="volvo-container volvo-footer__legal-inner">
          <span>Copyright 2026 AUTORA OS</span>
          <span>Revenue control infrastructure for dealership networks</span>
          <div>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/popia">POPIA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
