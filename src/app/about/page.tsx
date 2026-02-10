import type { Metadata } from "next";
import { PLATFORM_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="max-w-4xl space-y-6">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">About {PLATFORM_NAME}</p>
        <h1 className="text-balance text-4xl font-semibold text-coal md:text-5xl">
          From agency distribution to vertical SaaS infrastructure
        </h1>
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-steel">
          {PLATFORM_NAME} was not started as a software experiment. It began as an agency-led distribution model — deliberately — to earn trust inside automotive dealerships, understand real operational failure points, and observe where revenue is consistently lost or recovered. That frontline exposure shaped everything that followed.
        </p>
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-steel">
          What emerged was not another marketing tool, chatbot, or dashboard — but the need for <strong>infrastructure</strong>: a system embedded directly in dealership workflows where response speed, conversation ownership, and booking execution determine revenue outcomes.
        </p>
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-steel font-medium text-coal">
          {PLATFORM_NAME} exists to operate in that layer.
        </p>
      </section>

      {/* Why Infrastructure */}
      <section className="max-w-4xl space-y-4 border-t border-steel/12 pt-12">
        <h2 className="text-2xl font-semibold text-coal">Why infrastructure, not services</h2>
        <p className="text-pretty text-base leading-relaxed text-steel">
          Dealerships don&apos;t fail because of a lack of tools. They fail because execution breaks down between:
        </p>
        <ul className="space-y-2 pl-6 text-base text-steel">
          <li className="flex gap-3">
            <span className="text-tide">→</span>
            <span>Inbound leads</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">→</span>
            <span>Response time</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">→</span>
            <span>Follow-up consistency</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">→</span>
            <span>Booking accountability</span>
          </li>
        </ul>
        <p className="pt-2 text-pretty text-base leading-relaxed text-steel">
          <strong>{PLATFORM_NAME} was built to sit inside that gap.</strong> Rather than offering campaigns, manual optimisations, or custom work, {PLATFORM_NAME} standardises the operational layer where sales performance is won or lost — across WhatsApp, web, and internal handoffs.
        </p>
        <p className="text-pretty text-base leading-relaxed text-steel">
          This makes {PLATFORM_NAME} durable, measurable, and deeply embedded.
        </p>
      </section>

      {/* Focused Vertical */}
      <section className="max-w-4xl space-y-4 border-t border-steel/12 pt-12">
        <h2 className="text-2xl font-semibold text-coal">A focused vertical, by design</h2>
        <p className="text-pretty text-base leading-relaxed text-steel">
          {PLATFORM_NAME} is a vertical SaaS platform, not a horizontal product. We focus exclusively on automotive dealerships, starting with new-vehicle sales operations. This focus allows us to:
        </p>
        <ul className="space-y-2 pl-6 text-base text-steel">
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Design workflows specific to dealership teams</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Measure performance in operational terms, not vanity metrics</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Build systems that scale across branches, dealer groups, and networks</span>
          </li>
        </ul>
        <p className="pt-2 text-pretty text-base leading-relaxed text-steel">
          Expansion is intentional and depth-first — not feature-driven.
        </p>
      </section>

      {/* Built for Operators */}
      <section className="max-w-4xl space-y-4 border-t border-steel/12 pt-12">
        <h2 className="text-2xl font-semibold text-coal">Built for operators, trusted by leadership</h2>
        <p className="text-pretty text-base leading-relaxed text-steel">
          {PLATFORM_NAME} is used daily by:
        </p>
        <ul className="space-y-2 pl-6 text-base text-steel">
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Sales teams handling live conversations</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Managers overseeing response and bookings</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Leadership tracking conversion and leakage</span>
          </li>
        </ul>
        <p className="pt-4 text-pretty text-base leading-relaxed text-steel">
          At the same time, the platform is designed to surface structured, aggregate insight for dealer principals, groups, and — over time — OEM and importer stakeholders.
        </p>
        <p className="text-pretty text-base leading-relaxed text-steel font-medium text-coal">
          Operational control stays with dealerships. Visibility scales upward.
        </p>
      </section>

      {/* Ownership & Security */}
      <section className="max-w-4xl space-y-4 border-t border-steel/12 pt-12">
        <h2 className="text-2xl font-semibold text-coal">Ownership, security, and discipline</h2>
        <p className="text-pretty text-base leading-relaxed text-steel">
          {PLATFORM_NAME} is operated as a platform business:
        </p>
        <ul className="space-y-2 pl-6 text-base text-steel">
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Conversation ownership remains with dealerships</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Infrastructure access is tightly controlled</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>Client data is isolated by design</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">•</span>
            <span>System logic is protected while content remains configurable</span>
          </li>
        </ul>
        <p className="pt-2 text-pretty text-base leading-relaxed text-steel">
          This discipline is critical for long-term trust and scale.
        </p>
      </section>

      {/* Our Position */}
      <section className="max-w-4xl space-y-4 border-t border-steel/12 pt-12">
        <h2 className="text-2xl font-semibold text-coal">Our position</h2>
        <div className="space-y-3 text-base text-steel">
          <p className="text-pretty">
            <strong>{PLATFORM_NAME} is not a marketing service.</strong>
          </p>
          <p className="text-pretty">
            It is not a chatbot vendor.
          </p>
          <p className="text-pretty">
            It is not a collection of tools.
          </p>
          <p className="text-pretty font-medium text-coal pt-2">
            {PLATFORM_NAME} is infrastructure for dealership lead handling and WhatsApp sales — embedded where execution actually happens.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="grid gap-6 rounded-3xl border border-steel/12 bg-white p-6 shadow-soft md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-tide">Founder</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold text-coal">Andisa Mabilisa</h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-steel">
            {PLATFORM_NAME} is led by a platform founder focused on operational leverage, system discipline, and long-term infrastructure value.
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-steel">
            The strategy is simple: dominate dealership operations first, then expand from a position of embedded leverage.
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-tide to-coal p-5 text-white">
          <p className="text-sm uppercase tracking-[0.15em] text-gold">Philosophy</p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-white/90">
            Infrastructure business, not service work. Embedded in dealership workflows where revenue is won or lost. Built quietly, deliberately, and for the long term.
          </p>
        </div>
      </section>

      {/* Where We're Going */}
      <section className="max-w-4xl space-y-4 border-t border-steel/12 pt-12">
        <h2 className="text-2xl font-semibold text-coal">Where we&apos;re going</h2>
        <p className="text-pretty text-base leading-relaxed text-steel">
          {PLATFORM_NAME} expands by depth, not by noise.
        </p>
        <ul className="space-y-2 pl-6 text-base text-steel">
          <li className="flex gap-3">
            <span className="text-tide">→</span>
            <span>From single dealerships → dealer groups</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">→</span>
            <span>From execution → network-level insight</span>
          </li>
          <li className="flex gap-3">
            <span className="text-tide">→</span>
            <span>From tools → operational standard</span>
          </li>
        </ul>
        <p className="pt-4 text-pretty text-base leading-relaxed text-steel">
          The long-term vision is to power the invisible layer of dealership sales operations — the layer that already exists, but has never been systemised correctly.
        </p>
      </section>
    </div>
  );
}
