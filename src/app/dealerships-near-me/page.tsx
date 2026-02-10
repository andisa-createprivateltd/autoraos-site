import type { Metadata } from "next";
import { DealershipNearMe } from "@/components/dealership-near-me";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Dealerships Near Me"
};

export default function DealershipsNearMePage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Find Dealerships</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Chinese Dealerships Near Me</h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-steel">
          Locate nearby Chery, Haval, Omoda, Jaecoo, BYD, and GWM dealerships using live Google Places data.
          You can select a dealership and instantly personalize your booking flow.
        </p>
      </section>

      <DealershipNearMe />

      <section className="rounded-3xl border border-tide/20 bg-gradient-to-br from-tide/5 to-white p-8 shadow-soft">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-coal">Want this for your dealership?</h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-steel">
            If you&apos;re a dealership principal looking to improve lead response times and booking conversion, 
            AUTORA can embed this same system into your operations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/book">
              Book Free 15-Minute Audit
            </ButtonLink>
            <ButtonLink href="/pricing" variant="ghost">
              View Platform Pricing
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
