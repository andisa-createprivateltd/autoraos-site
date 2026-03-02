import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Product Modules",
  description:
    "AUTORA OS modules cover dashboard control, WhatsApp inbox handling, booking execution, policy controls, and governance reporting for dealership teams.",
  path: "/services"
});

const modules = [
  {
    title: "Revenue Risk Dashboard",
    href: "/platform#dashboard",
    detail: "Revenue at risk, hot leads, bookings due today, and recover-now pressure in one view."
  },
  {
    title: "WhatsApp Inbox Control",
    href: "/platform#inbox",
    detail: "Conversation handling, assignment, quick replies, and SLA countdowns."
  },
  {
    title: "Lead and Booking Execution",
    href: "/platform#leads-bookings",
    detail: "Reply, call, book, confirm, reschedule, and no-show recovery workflows."
  },
  {
    title: "AI Assistant Controls",
    href: "/platform#assistant",
    detail: "Business hours, FAQs, booking rules, and escalation logic controlled at dealership level."
  },
  {
    title: "Governance and Insights",
    href: "/platform#insights",
    detail: "Operational indicators, policy outcomes, and audit reporting for managers and leadership."
  }
] as const;

export default function ServicesPage() {
  return (
    <div className="page-motion space-y-10">
      <section className="panel-dark p-7 md:p-9">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Product Modules</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
          The operating modules behind AUTORA OS
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">
          These are platform modules, not agency services. Each maps directly to a working operating surface in AUTORA OS.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <article key={module.title} className="surface-card p-6">
            <h2 className="section-heading text-xl font-semibold text-coal">{module.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-steel">{module.detail}</p>
            <Link href={module.href} className="mt-5 inline-flex text-sm font-semibold text-tide hover:underline">
              View module
            </Link>
          </article>
        ))}
      </section>

      <section className="page-shell p-6">
        <h2 className="section-heading text-2xl font-semibold text-coal">Implementation starts with workflow, not design slides</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-steel">
          The rollout sequence maps current lead sources, WhatsApp handling, booking ownership, and escalation rules before the system goes live.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "services" }}>
            Request Revenue Audit
          </ButtonLink>
          <ButtonLink href="/pricing" variant="ghost" eventName="cta_pricing_click" eventParams={{ location: "services" }}>
            View Pricing
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
