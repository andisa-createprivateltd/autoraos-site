import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "AUTORA OS"
};

const screens = [
  {
    title: "Login",
    bullets: [
      "platform_owner (all dealers + billing + logs + API keys)",
      "platform_support (setup + ops; no billing/logs/API keys)",
      "dealer_admin / dealer_sales / dealer_marketing"
    ]
  },
  {
    title: "Dashboard (Money View)",
    bullets: [
      "New Leads (last 24h)",
      "Response Time (avg)",
      "Bookings Created",
      "Missed Leads Alert",
      "Conversion Snapshot (basic)"
    ]
  },
  {
    title: "Conversations (Core Screen)",
    bullets: [
      "WhatsApp-style inbox",
      "One thread per lead",
      "AI + human messages inline",
      "Tags: New / Hot / Booked / Visited / Sold / Lost",
      "Lead source label: Ads / Website / OEM"
    ]
  },
  {
    title: "Bookings",
    bullets: [
      "Test drives, appointments, call-backs",
      "Calendar view",
      "Auto confirmations",
      "No-show reminders",
      "Status: Booked / Completed / No-show"
    ]
  },
  {
    title: "AI Assistant (Admin)",
    bullets: ["Business hours", "FAQs", "Booking rules", "Escalation logic handoff"]
  },
  {
    title: "Insights (Minimal)",
    bullets: ["Avg response time", "Leads vs bookings", "Missed after-hours leads"]
  },
  {
    title: "Settings",
    bullets: ["Users", "WhatsApp numbers", "Booking availability", "Billing plan"]
  }
] as const;

const notInV1 = [
  "White-labelling",
  "Multi-language",
  "Advanced analytics",
  "Custom workflows"
] as const;

export default function DealerOsPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">AUTORA OS V1</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Revenue control system for dealerships</h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-steel">
          AUTORA OS is intentionally narrow in V1: WhatsApp, CRM workflow, booking conversion, and operational visibility.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-tide/20 bg-gradient-to-br from-tide/5 to-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-coal">What changes in week 1</h2>
          <ul className="mt-4 space-y-3 text-sm text-steel">
            <li className="flex gap-3">
              <span className="text-tide">✓</span>
              <span><strong className="text-coal">Response time drops to &lt; 60 seconds</strong> — WhatsApp AI handles first contact instantly</span>
            </li>
            <li className="flex gap-3">
              <span className="text-tide">✓</span>
              <span><strong className="text-coal">After-hours coverage</strong> — AI responds 24/7, no more lost weekend leads</span>
            </li>
            <li className="flex gap-3">
              <span className="text-tide">✓</span>
              <span><strong className="text-coal">Bookings created automatically</strong> — Test drives scheduled without manual back-and-forth</span>
            </li>
            <li className="flex gap-3">
              <span className="text-tide">✓</span>
              <span><strong className="text-coal">Single unified inbox</strong> — All enquiries in one place, no more missed messages</span>
            </li>
          </ul>
        </article>

        <article className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-coal">What your team does differently</h2>
          <ul className="mt-4 space-y-3 text-sm text-steel">
            <li className="flex gap-3">
              <span className="text-coal">→</span>
              <span><strong className="text-coal">Work from one inbox</strong> — No more checking WhatsApp Web, SMS, and email separately</span>
            </li>
            <li className="flex gap-3">
              <span className="text-coal">→</span>
              <span><strong className="text-coal">AI handles qualification</strong> — Your team picks up where AI leaves off, with context</span>
            </li>
            <li className="flex gap-3">
              <span className="text-coal">→</span>
              <span><strong className="text-coal">Follow-up prompts</strong> — System reminds you when leads need attention</span>
            </li>
            <li className="flex gap-3">
              <span className="text-coal">→</span>
              <span><strong className="text-coal">Booking workflow built-in</strong> — Calendar, confirmations, and reminders automated</span>
            </li>
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-steel/10 bg-mist/30 p-6">
        <h2 className="text-2xl font-semibold text-coal">Platform Modules</h2>
        <p className="mt-2 text-sm text-steel">Complete feature breakdown by screen</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {screens.map((screen) => (
          <article key={screen.title} className="rounded-2xl border border-steel/12 bg-white p-6 shadow-sm">
            <h2 className="text-balance text-xl font-semibold text-coal">{screen.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-steel">
              {screen.bullets.map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-ember/20 bg-[#fffaf6] p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.14em] text-ember">Not In V1</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {notInV1.map((item) => (
            <span key={item} className="rounded-full border border-ember/25 px-3 py-1 text-xs font-semibold text-ember">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <ButtonLink href="/pricing">View AUTORA Pricing</ButtonLink>
        <ButtonLink href="/book" variant="ghost">
          Book Free 15-Minute Audit
        </ButtonLink>
      </section>
    </div>
  );
}
