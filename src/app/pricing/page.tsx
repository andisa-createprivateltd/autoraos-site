import type { Metadata } from "next";
import { ADD_ONS, PRICING_TIERS } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Pricing"
};

const comparisonRows = [
  {
    feature: "WhatsApp AI Assistant",
    starter: "Included",
    growth: "Advanced follow-ups",
    scale: "Advanced + multi-location"
  },
  {
    feature: "Unified Inbox",
    starter: "Included",
    growth: "Included",
    scale: "Included"
  },
  {
    feature: "Booking Engine",
    starter: "Basic booking",
    growth: "Test-drive booking engine",
    scale: "Advanced booking + routing"
  },
  {
    feature: "Insights",
    starter: "Basic",
    growth: "Performance insights",
    scale: "OEM-ready reporting"
  },
  {
    feature: "Support",
    starter: "Email support",
    growth: "Priority routing",
    scale: "Dedicated success manager"
  }
] as const;

export default function PricingPage() {
  return (
    <div className="space-y-12">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Pricing</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">
          The Operating System for Dealership Leads & WhatsApp Sales
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-steel">
          Generate leads, respond instantly, and convert more test drives, all from one platform.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <article
            key={tier.name}
            className={`rounded-3xl border p-6 shadow-sm ${
              tier.highlighted
                ? "border-ember/40 bg-gradient-to-b from-[#fff7f3] to-white shadow-soft"
                : "border-steel/12 bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.16em] text-tide">{tier.name}</p>
              {tier.badge ? <span className="rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white">{tier.badge}</span> : null}
            </div>

            <p className="mt-3 text-3xl font-semibold text-coal">{tier.price}</p>
            <p className="mt-2 text-pretty text-sm text-steel">{tier.description}</p>

            <ul className="mt-5 space-y-2 text-sm text-coal">
              {tier.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>

            <p className="mt-5 text-xs uppercase tracking-[0.12em] text-tide">Best for: {tier.bestFor}</p>
            <p className="mt-2 text-xs text-steel">Designed for dealerships only.</p>

            <ButtonLink href="/book" className="mt-6 w-full">
              Book Free 15-Minute Audit
            </ButtonLink>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-coal">Plan Comparison</h2>
        <div className="mt-5 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-3">Feature</th>
                <th className="px-3 py-3">Starter</th>
                <th className="px-3 py-3">Growth</th>
                <th className="px-3 py-3">Scale</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-steel/10">
                  <td className="px-3 py-3 font-semibold text-coal">{row.feature}</td>
                  <td className="px-3 py-3 text-steel">{row.starter}</td>
                  <td className="px-3 py-3 text-steel">{row.growth}</td>
                  <td className="px-3 py-3 text-steel">{row.scale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-coal">Optional Growth Add-On (Post-Onboarding)</h2>
        <div className="mt-4 grid gap-3">
          {ADD_ONS.map((addon) => (
            <div key={addon.label} className="rounded-2xl border border-steel/12 bg-mist/30 p-4">
              <p className="text-sm font-semibold text-coal">{addon.label}</p>
              <p className="mt-1 text-sm text-steel">{addon.price}</p>
              <p className="mt-1 text-sm text-steel">{addon.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-ember/20 bg-[#fffaf6] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-coal">Pricing Rules</h2>
        <ul className="mt-4 space-y-2 text-sm text-steel">
          <li>• Annual contracts preferred</li>
          <li>• Monthly pricing higher</li>
          <li>• No discounts</li>
          <li>• No custom tiers</li>
        </ul>
      </section>
    </div>
  );
}
