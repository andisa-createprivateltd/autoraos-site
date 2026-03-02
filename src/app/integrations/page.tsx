import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Integrations",
  description:
    "AUTORA OS connects WhatsApp Cloud API, website forms, Meta leads, Google leads, and OEM feeds into one governed dealership operating system.",
  path: "/integrations"
});

const supportedToday = [
  "WhatsApp Cloud API",
  "Website form ingestion",
  "Meta lead sync",
  "Google lead sync",
  "OEM CSV and webhook feeds"
] as const;

const roadmap = ["DMS and CRM bidirectional sync", "IVR call logs"] as const;

const principles = [
  "Connect once. Leads push into AUTORA OS in real time.",
  "AUTORA OS sits above the existing stack so operational control improves before a full system replacement is considered.",
  "Platform credentials stay server-side and outside dealership user access.",
  "Every connector supports routing, auditability, and response governance rather than raw data sync for its own sake."
] as const;

export default function IntegrationsPage() {
  return (
    <div className="page-motion space-y-10">
      <section className="panel-dark p-7 md:p-9">
        <p className="text-xs uppercase tracking-[0.16em] text-white/70">Integrations</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
          Connect once. Govern every incoming enquiry.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/82">
          AUTORA OS receives enquiries from the systems dealerships already use and routes them into one governed operating flow in real time.
        </p>
      </section>

      <section className="stagger-grid grid gap-4 md:grid-cols-2">
        <article className="surface-card p-6">
          <h2 className="section-heading text-xl font-semibold text-coal">Supported today</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            {supportedToday.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="surface-card p-6">
          <h2 className="section-heading text-xl font-semibold text-coal">Roadmap</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel">
            {roadmap.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-shell p-6 md:p-7">
        <h2 className="section-heading text-2xl font-semibold text-coal">Integration principles</h2>
        <ul className="mt-4 space-y-2 text-sm text-steel">
          {principles.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
