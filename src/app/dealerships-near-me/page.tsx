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

      <section className="rounded-3xl border border-steel/15 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-coal">Want this installed for your dealership?</h2>
        <p className="mt-2 text-sm text-steel">
          Get AUTORA running at your dealership — respond faster, book more test drives, and stop losing leads.
        </p>
        <div className="mt-4">
          <ButtonLink href="/book">Book Free 15-Minute Dealer Audit</ButtonLink>
        </div>
      </section>
    </div>
  );
}
