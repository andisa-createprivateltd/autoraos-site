import type { Metadata } from "next";
import { EditorialHero } from "@/components/marketing/editorial-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/lib/site-metadata";
import { ADD_ONS, PRICING_TIERS } from "@/lib/constants";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "AUTORA OS pricing is aligned to enforcement depth, store complexity, and governance scope across single stores, dealer groups, and enterprise deployments.",
  path: "/pricing"
});

export default function PricingPage() {
  return (
    <div className="volvo-page">
      <EditorialHero
        eyebrow="Commercial architecture / governance scope"
        title={<>Price the control layer,<br /><em>not the seat count.</em></>}
        intro="AUTORA OS is priced against the complexity of the operation it governs: stores, response policy, escalation depth, and executive visibility."
        detail="The commercial question is not how many people can log in. It is how much execution has to be made visible, attributable, and non-optional across the network."
        actions={<ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "pricing_hero" }}>Request revenue audit</ButtonLink>}
      />

      <section className="volvo-section volvo-section--paper">
        <div className="volvo-container">
          <div className="volvo-section-heading">
            <div>
              <p className="volvo-overline">01 / Governance tiers</p>
              <h2>Commercial scope follows operating responsibility.</h2>
            </div>
            <p className="volvo-copy">
              Each tier defines who AUTORA governs, how deeply it enforces response, and what leadership can see across the network.
            </p>
          </div>

          <div className="volvo-pricing-grid">
            {PRICING_TIERS.map((tier) => (
              <article key={tier.name} className={`volvo-pricing-card${tier.highlighted ? " volvo-pricing-card--highlighted" : ""}`}>
                <div className="volvo-pricing-card__head">
                  <p className="volvo-overline">{tier.name}</p>
                  {tier.badge ? <span className="volvo-pricing-card__badge">{tier.badge}</span> : null}
                </div>
                <h3>{tier.price}</h3>
                <p className="volvo-pricing-card__description">{tier.description}</p>
                <dl>
                  <div><dt>Who it is for</dt><dd>{tier.bestFor}</dd></div>
                  <div><dt>Network scope</dt><dd>{tier.locationsIncluded}</dd></div>
                  <div><dt>Governance depth</dt><dd>{tier.slaLevel}</dd></div>
                  <div><dt>Operational impact</dt><dd>{tier.reporting}</dd></div>
                  <div><dt>Revenue protection</dt><dd>{tier.support}</dd></div>
                </dl>
                <ButtonLink
                  href="/request-audit"
                  className="volvo-pricing-card__action"
                  eventName="cta_request_audit_click"
                  eventParams={{ location: "pricing", tier: tier.name }}
                >
                  Scope this tier
                </ButtonLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="volvo-section volvo-section--white">
        <div className="volvo-container">
          <div className="volvo-section-heading">
            <div>
              <p className="volvo-overline">02 / Deployment depth</p>
              <h2>Additional scope without commercial noise.</h2>
            </div>
            <p className="volvo-copy">
              Add-ons extend rollout depth or connector coverage. They do not create a second product vocabulary or a discount-led pricing structure.
            </p>
          </div>
          <div className="volvo-pricing-addons">
            {ADD_ONS.map((addon, index) => (
              <article key={addon.label}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{addon.label}</h3>
                  <p>{addon.description}</p>
                </div>
                <strong>{addon.price}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
