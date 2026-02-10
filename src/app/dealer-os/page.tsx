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
          Schedule Platform Audit
        </ButtonLink>
      </section>
    </div>
  );
}
