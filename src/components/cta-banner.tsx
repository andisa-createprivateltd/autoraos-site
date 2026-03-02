import { ButtonLink } from "@/components/ui/button-link";

export function CtaBanner() {
  return (
    <section className="panel-dark mt-16 p-8 md:p-10">
      <p className="text-xs uppercase tracking-[0.22em] text-white/65">Revenue Audit</p>
      <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold leading-tight md:text-3xl">
        See where enquiries are leaking and what your team must fix next.
      </h2>
      <p className="mt-4 max-w-xl text-pretty text-sm text-white/80">
        We map WhatsApp response gaps, booking execution pressure, and store-level accountability in one audit.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/request-audit" eventName="cta_request_audit_click" eventParams={{ location: "cta_banner" }}>
          Request Revenue Audit
        </ButtonLink>
        <ButtonLink href="/pricing" variant="ghost" className="border-white/25 bg-transparent text-white hover:bg-white hover:text-coal" eventName="cta_pricing_click" eventParams={{ location: "cta_banner" }}>
          View Pricing
        </ButtonLink>
      </div>
    </section>
  );
}
