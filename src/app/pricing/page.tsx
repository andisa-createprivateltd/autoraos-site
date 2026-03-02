import type { Metadata } from "next";
import { ADD_ONS, PRICING_TIERS } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "AUTORA OS pricing is aligned to enforcement depth, store complexity, and governance scope across single stores, dealer groups, and enterprise deployments.",
  path: "/pricing"
});

const comparisonRows = [
  { label: "Users included", key: "usersIncluded" },
  { label: "Locations included", key: "locationsIncluded" },
  { label: "WhatsApp numbers", key: "whatsappNumbers" },
  { label: "SLA enforcement level", key: "slaLevel" },
  { label: "Reporting", key: "reporting" },
  { label: "Support", key: "support" }
] as const;

export default function PricingPage() {
  return (
    <div className="page-motion space-y-8 md:space-y-12">
      <section className="hero-panel relative overflow-hidden p-6 sm:p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.15),transparent_45%),linear-gradient(112deg,#0b0c0d_0%,#111316_56%,#161a1f_100%)]" />
        <div className="relative z-10 max-w-4xl">
          <p className="section-kicker">Pricing</p>
          <h1 className="section-heading mt-4 text-balance text-3xl font-semibold sm:text-4xl md:text-5xl">
            Revenue governance infrastructure, priced by enforcement depth and store complexity.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82 sm:text-base">
            Pricing reflects operational enforcement, not seat licensing.
          </p>
        </div>
      </section>

      <section className="page-shell p-5 sm:p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-steel">Value anchor</p>
        <h2 className="section-heading mt-2 text-2xl font-semibold text-coal">What is one missed hot enquiry worth?</h2>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-steel">
          If your average margin per vehicle is R25,000 and 3 high-intent enquiries are lost weekly, that is R300,000+ in monthly revenue leakage. AUTORA OS enforces response discipline to recover what your marketing already generates.
        </p>
      </section>

      <section className="stagger-grid grid auto-rows-fr gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {PRICING_TIERS.map((tier) => (
          <article
            key={tier.name}
            className={`flex h-full min-w-0 flex-col rounded-3xl border p-5 sm:p-6 ${
              tier.highlighted
                ? "border-black/15 bg-black text-white shadow-[0_20px_42px_rgba(7,12,16,0.25)]"
                : "border-black/10 bg-white shadow-[0_14px_28px_rgba(7,12,16,0.05)]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className={`text-xs uppercase tracking-[0.16em] ${tier.highlighted ? "text-white/65" : "text-steel"}`}>{tier.name}</p>
              {tier.badge ? (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    tier.highlighted
                      ? "border border-white/30 bg-white/10 text-white"
                      : "border border-coal/20 bg-coal/5 text-coal"
                  }`}
                >
                  {tier.badge}
                </span>
              ) : null}
            </div>

            <p className="mt-3 text-2xl font-semibold sm:text-3xl">{tier.price}</p>
            <p className={`mt-2 text-sm leading-relaxed ${tier.highlighted ? "text-white/80" : "text-steel"}`}>{tier.description}</p>

            <ul className={`mt-5 flex-1 space-y-2 text-sm ${tier.highlighted ? "text-white/88" : "text-coal"}`}>
              {tier.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>

            <p className={`mt-5 text-xs uppercase tracking-[0.12em] ${tier.highlighted ? "text-white/65" : "text-steel"}`}>Best for: {tier.bestFor}</p>
            <ButtonLink
              href="/request-audit"
              className={`mt-6 w-full ${tier.highlighted ? "bg-white text-coal hover:bg-white/90" : ""}`}
              eventName="cta_request_audit_click"
              eventParams={{ location: "pricing", tier: tier.name }}
            >
              Request Revenue Audit
            </ButtonLink>
          </article>
        ))}
      </section>

      <section className="page-shell overflow-hidden p-5 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-heading text-2xl font-semibold text-coal">Comparison</h2>
            <p className="mt-2 max-w-3xl text-sm text-steel">
              Custom enterprise deployments are available, but the pricing logic stays tied to enforcement scope, store count, and governance depth.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.12em] text-steel">
            Taxes, WhatsApp message fees, and implementation scope are quoted separately where required.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-steel/15 text-steel">
                <th className="px-3 py-3">Scope</th>
                {PRICING_TIERS.map((tier) => (
                  <th key={tier.name} className="px-3 py-3 font-semibold text-coal">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-steel/10 align-top">
                  <td className="px-3 py-3 font-medium text-coal">{row.label}</td>
                  {PRICING_TIERS.map((tier) => (
                    <td key={`${tier.name}-${row.key}`} className="px-3 py-3 text-steel">
                      {tier[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-shell p-5 sm:p-6 md:p-8">
        <h2 className="section-heading text-2xl font-semibold text-coal">Add-ons</h2>
        <p className="mt-2 max-w-3xl text-sm text-steel">
          Add-ons expand rollout depth or connector coverage. They do not create conflicting tier names or discount-driven pricing structures.
        </p>
        <div className="stagger-grid mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {ADD_ONS.map((addon) => (
            <div key={addon.label} className="panel-muted p-4">
              <p className="text-sm font-semibold text-coal">{addon.label}</p>
              <p className="mt-1 text-sm text-steel">{addon.price}</p>
              <p className="mt-1 text-sm text-steel">{addon.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
