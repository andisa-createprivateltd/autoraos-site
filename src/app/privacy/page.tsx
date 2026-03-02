import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Review how AUTORA OS handles dealership data, WhatsApp conversations, audit records, and POPIA-aligned privacy controls.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <div className="page-motion max-w-4xl space-y-8">
      <section className="panel-dark p-7 md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-white/68">Privacy & Data</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/78">
          Last updated: February 2026. AUTORA OS is committed to protecting your dealership data and customer information.
        </p>
      </section>

      <section className="legal-content">
        <article>
          <h2 className="text-2xl font-semibold text-coal">What data we collect</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>When you use AUTORA OS, we collect:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Dealership contact information (name, phone, email, address)</li>
              <li>Lead and customer details shared via WhatsApp or booking forms</li>
              <li>Test drive and appointment booking records</li>
              <li>WhatsApp message content and conversation metadata</li>
              <li>User login credentials and account activity</li>
              <li>Usage analytics (page views, form submissions)</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">How we use your data</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>We use your data to:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Operate and maintain the AUTORA OS platform</li>
              <li>Respond to customer enquiries via WhatsApp</li>
              <li>Schedule and manage test drive bookings</li>
              <li>Generate performance reports and insights</li>
              <li>Improve our service and troubleshoot issues</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Prevent fraud and unauthorized access</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Data security</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>AUTORA OS uses industry-standard security measures to protect your data:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>HTTPS encryption for all data in transit</li>
              <li>Database encryption at rest (AES-256)</li>
              <li>Regular security audits and penetration testing</li>
              <li>Role-based access controls with encryption key management</li>
              <li>Restricted access to customer data (only authorized staff)</li>
              <li>Regular backups with disaster recovery procedures</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">POPIA compliance (South Africa)</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              AUTORA OS complies with the Protection of Personal Information Act (POPIA) and respects your right to privacy as a South African organization.
            </p>
            <p className="mt-3">
              <strong>Your rights:</strong>
            </p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Right to know what personal information we hold</li>
              <li>Right to request correction of inaccurate information</li>
              <li>Right to object to direct marketing communications</li>
              <li>Right to lodge a complaint with the Information Regulator</li>
              <li>Right to erasure (right to be forgotten) in certain circumstances</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@autoraos.company" className="font-semibold text-tide underline underline-offset-2">
                privacy@autoraos.company
              </a>
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">WhatsApp compliance</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              AUTORA OS integrates with WhatsApp Business API to handle customer conversations. All WhatsApp messages are encrypted end-to-end.
            </p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>We only send approved WhatsApp template messages</li>
              <li>Customer phone numbers and opt-in status are verified before outreach</li>
              <li>Messages are archived for audit and compliance purposes</li>
              <li>Customers can opt out at any time by messaging STOP</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Third-party data sharing</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>We do NOT sell or share your dealership or customer data with third parties. We only share data with:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>WhatsApp (to process messages)</li>
              <li>Supabase (our database provider, with encryption)</li>
              <li>SendGrid (for transactional email, with data minimization)</li>
              <li>Law enforcement, if required by legal process</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Data retention</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Booking records: retained for 7 years (legal requirement)</li>
              <li>WhatsApp conversation logs: retained for audit trail (2+ years)</li>
              <li>Deleted account data: permanently erased within 30 days of request</li>
              <li>Audit logs: retained indefinitely for security and compliance</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Contact us</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>Questions about your privacy? Contact us at:</p>
            <p>
              Email:{" "}
              <a href="mailto:privacy@autoraos.company" className="font-semibold text-tide underline underline-offset-2">
                privacy@autoraos.company
              </a>
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
