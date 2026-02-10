import type { Metadata } from "next";
import { DealershipNearMe } from "@/components/dealership-near-me";

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
        <div className="mt-6 rounded-2xl border border-ember/20 bg-gradient-to-br from-ember/5 to-white p-5">
          <p className="text-sm font-semibold text-coal">Want this installed for your dealership?</p>
          <a
            href="/book"
            className="mt-3 inline-flex rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember/90"
          >
            Book Free 15-Minute Audit
          </a>
        </div>
      </section>

      <DealershipNearMe />
    </div>
  );
}
