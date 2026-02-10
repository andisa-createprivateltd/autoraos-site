import type { Metadata } from "next";
import { PLATFORM_NAME, PLATFORM_SUBSIDIARY_LINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">About {PLATFORM_NAME}</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">From agency distribution to vertical SaaS infrastructure</h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-steel">
          {PLATFORM_NAME} started as an agency model to earn trust and distribution with dealerships, and now operates as a
          focused vertical SaaS platform. {PLATFORM_SUBSIDIARY_LINE}.
        </p>
      </section>

      <section className="grid gap-6 rounded-3xl border border-steel/12 bg-white p-6 shadow-soft md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-tide">Founder</p>
          <h2 className="mt-2 text-balance text-2xl font-semibold text-coal">Andisa Mabilisa</h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-steel">
            Andisa leads {PLATFORM_NAME} as a platform founder focused on operational lock-in: response speed,
            conversation ownership, and booking conversion across dealership teams.
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-steel">
            The company strategy is clear: dominate automotive dealership operations first, then choose expansion from a
            position of leverage.
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-tide to-coal p-5 text-white">
          <p className="text-sm uppercase tracking-[0.15em] text-gold">Positioning</p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-white/90">
            Infrastructure business, not service work. Embedded in dealership workflows where revenue is won or lost.
          </p>
        </div>
      </section>
    </div>
  );
}
