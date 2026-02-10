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
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">
          Vertical SaaS infrastructure for automotive dealerships
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-steel">
          {PLATFORM_NAME} is a production-ready platform serving Chinese vehicle dealerships across South Africa. 
          We combine WhatsApp AI, automated booking systems, and enterprise-grade infrastructure to capture leads faster 
          and convert more test drives. {PLATFORM_SUBSIDIARY_LINE}.
        </p>
      </section>

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Platform Status</p>
        <h2 className="mt-2 text-balance text-2xl font-semibold text-coal">Live and Production-Ready</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-steel/8 bg-mist/30 p-4">
            <p className="text-sm font-semibold text-coal">Geographic Coverage</p>
            <p className="mt-2 text-sm text-steel">
              Serving dealership partners across all provinces in South Africa
            </p>
          </div>
          <div className="rounded-xl border border-steel/8 bg-mist/30 p-4">
            <p className="text-sm font-semibold text-coal">System Reliability</p>
            <p className="mt-2 text-sm text-steel">
              Triple-redundant backup: Email, Database, and Google Drive cloud storage
            </p>
          </div>
          <div className="rounded-xl border border-steel/8 bg-mist/30 p-4">
            <p className="text-sm font-semibold text-coal">Response Speed</p>
            <p className="mt-2 text-sm text-steel">
              AI-powered WhatsApp responses in under 60 seconds
            </p>
          </div>
          <div className="rounded-xl border border-steel/8 bg-mist/30 p-4">
            <p className="text-sm font-semibold text-coal">Booking System</p>
            <p className="mt-2 text-sm text-steel">
              Reconstructed for reliability with automatic Excel exports
            </p>
          </div>
        </div>
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

      <section className="rounded-3xl border border-steel/12 bg-white p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Technology</p>
        <h2 className="mt-2 text-balance text-2xl font-semibold text-coal">Built for Reliability</h2>
        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-tide"></div>
            <p className="text-sm text-steel">
              <span className="font-semibold text-coal">WhatsApp AI Integration:</span> Instant response to customer enquiries 
              with intelligent conversation handling
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-tide"></div>
            <p className="text-sm text-steel">
              <span className="font-semibold text-coal">Email-First Architecture:</span> Booking system designed for reliability 
              with email as primary channel, database as enhancement
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-tide"></div>
            <p className="text-sm text-steel">
              <span className="font-semibold text-coal">Cloud Backup:</span> Automatic Excel export and Google Drive upload 
              for all booking data
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-tide"></div>
            <p className="text-sm text-steel">
              <span className="font-semibold text-coal">Mobile-Responsive:</span> Optimized for all devices with proper 
              viewport configuration and adaptive layouts
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
