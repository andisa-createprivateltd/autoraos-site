import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Dealer OS V1",
  description:
    "A concise view of what AUTORA OS V1 gives dealership teams: dashboard control, inbox execution, bookings, policy controls, and operational reporting.",
  path: "/dealer-os"
});

const v1Items = [
  {
    title: "Dashboard",
    bullets: ["Revenue at risk", "SLA breaches", "Hot leads", "Bookings due today"]
  },
  {
    title: "Inbox",
    bullets: ["WhatsApp-style threads", "Assignment and handoff", "Quick replies", "AI on or off"]
  },
  {
    title: "Leads and bookings",
    bullets: ["Reply, call, assign, and book actions", "Confirm, reschedule, no-show, reminder workflows"]
  },
  {
    title: "Policy and governance",
    bullets: ["Business hours", "FAQ content", "Escalation rules", "Audit reporting"]
  }
] as const;

export default function DealerOsPage() {
  return (
    <div className="page-motion space-y-10">
      <section className="panel-dark p-7 md:p-9">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Dealer OS V1</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
          What you get in V1
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">
          AUTORA OS V1 focuses on one job: keeping dealership lead handling disciplined across inbox, bookings, and management review.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {v1Items.map((item) => (
          <article key={item.title} className="surface-card p-6">
            <h2 className="section-heading text-xl font-semibold text-coal">{item.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-steel">
              {item.bullets.map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="page-shell p-6">
        <h2 className="section-heading text-2xl font-semibold text-coal">V1 operating outcome</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-steel">
          Sales teams work from one queue. Managers see what is slipping. Leadership sees where response discipline is holding or failing. That is the V1 standard.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/platform" eventName="cta_view_platform_click" eventParams={{ location: "dealer_os" }}>
            View Platform
          </ButtonLink>
          <ButtonLink href="/request-audit" variant="ghost" eventName="cta_request_audit_click" eventParams={{ location: "dealer_os" }}>
            Request Revenue Audit
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
