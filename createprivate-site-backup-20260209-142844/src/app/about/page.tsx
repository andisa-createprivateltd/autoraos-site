import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">About CreatePrivate</p>
        <h1 className="mt-2 text-4xl font-semibold text-coal md:text-5xl">From agency distribution to vertical SaaS infrastructure</h1>
        <p className="mt-4 text-base text-steel">
          CreatePrivate started as an agency to earn trust and distribution with dealerships. The company is now focused
          on one mission: operating the WhatsApp and lead system that dealerships rely on every day.
        </p>
      </section>

      <section className="grid gap-6 rounded-3xl border border-steel/12 bg-white p-6 shadow-soft md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-tide">Founder</p>
          <h2 className="mt-2 text-2xl font-semibold text-coal">Andisa Mabilisa</h2>
          <p className="mt-3 text-sm text-steel">
            Andisa leads CreatePrivate as a platform founder focused on operational lock-in: response speed,
            conversation ownership, and booking conversion across dealership teams.
          </p>
          <p className="mt-3 text-sm text-steel">
            The company strategy is clear: dominate automotive dealership operations first, then choose expansion from a
            position of leverage.
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-tide to-coal p-5 text-white">
          <p className="text-sm uppercase tracking-[0.15em] text-gold">Positioning</p>
          <p className="mt-3 text-sm text-white/90">
            Infrastructure business, not service work. Embedded in dealership workflows where revenue is won or lost.
          </p>
        </div>
      </section>
    </div>
  );
}
