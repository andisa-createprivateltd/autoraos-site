import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Review the contractual terms for AUTORA OS, including service scope, account responsibilities, billing terms, and operational use conditions.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <div className="page-motion max-w-4xl space-y-8">
      <section className="panel-dark p-7 md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-white/68">Legal</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/78">
          Last updated: February 2026. These terms govern your use of AUTORA OS and its services.
        </p>
      </section>

      <section className="legal-content">
        <article>
          <h2 className="text-2xl font-semibold text-coal">1. Agreement</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              By accessing or using AUTORA OS, you agree to be bound by these terms. If you disagree with any part, you may not use the service.
            </p>
            <p>
              AUTORA OS is operated in South Africa and governed by South African law.
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">2. Service description</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>AUTORA OS provides:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Revenue risk modeling and operational intelligence</li>
              <li>SLA enforcement and escalation controls</li>
              <li>Urgency-based queue and accountability management</li>
              <li>Booking execution and conversion oversight</li>
              <li>Executive reporting and governance controls</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">3. Eligibility</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>You must be:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>A dealership principal, manager, or authorized representative</li>
              <li>At least 18 years of age</li>
              <li>Acting on behalf of a legally registered dealership</li>
            </ul>
            <p className="mt-3">AUTORA OS operates in South Africa.</p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">4. Account and security</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>You are responsible for:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Keeping your login credentials confidential</li>
              <li>All activity under your account</li>
              <li>Notifying us of unauthorized access immediately</li>
              <li>Maintaining accurate dealership information</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">5. Acceptable use</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>You may NOT use AUTORA OS to:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Send spam, harassment, or threatening messages</li>
              <li>Violate WhatsApp terms or messaging policies</li>
              <li>Impersonate another person or dealership</li>
              <li>Access or disrupt the service or its infrastructure</li>
              <li>Reverse-engineer or attempt to access source code</li>
              <li>Send unsolicited promotional content without customer consent</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">6. Fees and payment</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Pricing is listed on our Pricing page</li>
              <li>Billing is monthly in arrears</li>
              <li>Monthly subscription can be cancelled with 30 days notice</li>
              <li>No refunds for partial months</li>
              <li>Late payment results in service suspension</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">7. Intellectual property</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              AUTORA OS owns all intellectual property in the platform, code, documentation, and designs. You own data you upload, and grant us a license to use it to operate the service.
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">8. Disclaimer of warranties</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              AUTORA OS is provided as-is without warranties. We do not guarantee uptime, data recovery, or specific results. Use at your own risk.
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">9. Limitation of liability</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              To the fullest extent permitted by law, AUTORA OS is not liable for indirect, incidental, consequential, or punitive damages. Our total liability is limited to fees paid in the last 12 months.
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">10. Termination</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              We may suspend or terminate your account if you violate these terms or laws. You may cancel your account at any time. Upon termination, we will delete your data within 30 days.
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">11. Changes to these terms</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              We may update these terms at any time. Continued use of AUTORA OS constitutes acceptance. Material changes will be notified via email.
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">12. Contact</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@autoraos.company" className="font-semibold text-tide underline underline-offset-2">
                legal@autoraos.company
              </a>
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
