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
        <h1 className="mt-2 text-4xl font-semibold text-coal md:text-5xl">Chinese Dealerships Near Me</h1>
        <p className="mt-4 text-base text-steel">
          Locate nearby Chery, Haval, Omoda, Jaecoo, BYD, and GWM dealerships using live Google Places data.
          You can select a dealership and instantly personalize your booking flow.
        </p>
      </section>

      <DealershipNearMe />
    </div>
  );
}
