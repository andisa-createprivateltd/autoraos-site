import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Services"
};

const modules = [
  {
    title: "Conversations (Core Screen)",
    description:
      "WhatsApp-style inbox with one thread per lead, AI + human messages inline, lead-source labels, and stage tags (New, Hot, Booked, Visited, Sold, Lost)."
  },
  {
    title: "Bookings",
    description:
      "Test-drive, appointment, and callback workflows with calendar view, confirmations, no-show reminders, and status tracking for operational accountability."
  },
  {
    title: "AI Assistant Admin",
    description:
      "Dealers control business hours, FAQs, booking rules, and escalation triggers. Content is editable while system logic remains protected."
  },
  {
    title: "Money View Dashboard",
    description:
      "Instant visibility into new leads (24h), response time, bookings created, missed-lead alerts, and conversion snapshot to expose lost revenue quickly."
  },
  {
    title: "Minimal Insights",
    description:
      "Response time, leads vs bookings, and after-hours misses. No vanity metrics. Only what dealership operators and OEM stakeholders need."
  },
  {
    title: "Paid Demand Generation Add-on",
    description:
      "Optional growth lever after onboarding to feed high-intent demand into the platform pipeline without turning the product into an agency service."
  }
] as const;

export default function ServicesPage() {
  return (
    <div className="space-y-12">
      <section className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Platform Modules</p>
        <h1 className="mt-2 text-4xl font-semibold text-coal md:text-5xl">Dealer OS is infrastructure, not a marketing package</h1>
        <p className="mt-4 text-base text-steel">
          Every module exists to protect response speed, booking consistency, and dealership conversion outcomes.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.title} className="rounded-2xl border border-steel/12 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-coal">{module.title}</h2>
            <p className="mt-3 text-sm text-steel">{module.description}</p>
          </article>
        ))}
      </section>

      <CtaBanner />
    </div>
  );
}
