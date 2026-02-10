import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder Narrative"
};

const whyUs = [
  "We own the WhatsApp layer",
  "We see conversion data OEMs do not",
  "We are embedded, not optional",
  "Switching costs are operational, not technical"
] as const;

const exitPathways = [
  "Strategic acquisition by OEM tech arms",
  "Dealer group rollups",
  "Messaging and CRM platforms expanding into automotive"
] as const;

const identityShift = [
  "Platform founder",
  "Infrastructure builder",
  "Vertical SaaS CEO"
] as const;

const sevenDayPlan = [
  "Rename everything internally to Dealer OS",
  "Stop custom work immediately",
  "Build the inbox and booking first",
  "Make WhatsApp AI unavoidable",
  "Sell the platform, not services"
] as const;

export default function FounderNarrativePage() {
  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Founder Narrative</p>
        <h1 className="mt-2 text-4xl font-semibold text-coal md:text-5xl">Investor and acquirer story in 60 seconds</h1>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-7 shadow-soft">
        <h2 className="text-2xl font-semibold text-coal">The Story</h2>
        <blockquote className="mt-4 border-l-4 border-tide pl-4 text-sm leading-7 text-steel">
          &quot;CreatePrivate builds the WhatsApp and lead operating system for automotive dealerships. Dealerships lose revenue
          not because of lack of demand, but because leads are slow, fragmented, and poorly handled, especially on
          WhatsApp. We sit directly in the dealer&apos;s communication flow, responding instantly, qualifying leads, booking
          test drives, and tracking conversion in real time. We started as an agency to earn distribution and trust.
          Today, we are a vertical SaaS platform embedded in dealership operations. Our customers do not churn because
          once we manage their conversations, replacing us means losing revenue. We are focused on automotive first.
          Once we dominate this vertical, expansion becomes optional, not necessary.&quot;
        </blockquote>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">When buyers ask &quot;Why you?&quot;</h2>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            {whyUs.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-steel/12 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-coal">When they ask &quot;What is the exit?&quot;</h2>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            {exitPathways.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-coal">Answer style: &quot;We are building long-term infrastructure.&quot;</p>
        </article>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-coal">New Identity</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {identityShift.map((item) => (
            <span key={item} className="rounded-full border border-tide/20 bg-tide/5 px-3 py-1 text-xs font-semibold text-tide">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-ember/20 bg-[#fffaf6] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-coal">Next 7 Days</h2>
        <ol className="mt-4 space-y-2 text-sm text-steel">
          {sevenDayPlan.map((item, idx) => (
            <li key={item}>
              {idx + 1}. {item}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
