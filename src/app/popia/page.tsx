import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "POPIA & Data Handling",
  description:
    "See how AUTORA OS approaches POPIA-aligned processing, WhatsApp consent, retention controls, and dealership data responsibilities.",
  path: "/popia"
});

export default function PopiaPage() {
  return (
    <div className="page-motion max-w-4xl space-y-8">
      <section className="panel-dark p-7 md:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-white/68">Compliance</p>
        <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">POPIA & Data Handling</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/78">
          AUTORA OS is committed to complying with the South African Protection of Personal Information Act (POPIA) and protecting customer data.
        </p>
      </section>

      <section className="legal-content">
        <article>
          <h2 className="text-2xl font-semibold text-coal">POPIA overview</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              The Protection of Personal Information Act (Act No. 4 of 2013) regulates how organizations in South Africa collect, process, store, and use personal information.
            </p>
            <p>
              AUTORA OS processes personal information only in accordance with POPIA{"\u0027"}s eight principles:
            </p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li><strong>Lawfulness and fairness:</strong> We collect data only for legitimate business purposes</li>
              <li><strong>Purpose limitation:</strong> Data is used only for stated purposes (lead handling, bookings)</li>
              <li><strong>Further processing:</strong> Secondary use requires new consent or legal basis</li>
              <li><strong>Information quality:</strong> We maintain accurate, complete, not misleading information</li>
              <li><strong>Openness:</strong> We disclose our data practices clearly</li>
              <li><strong>Security:</strong> We implement technical and organizational safeguards</li>
              <li><strong>Data subject participation:</strong> You can access, correct, and delete your data</li>
              <li><strong>Accountability:</strong> We maintain records documenting our compliance</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">What data we process</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p><strong>Customer/Lead data:</strong></p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Names and contact details (phone, email, WhatsApp)</li>
              <li>Location and demographic information</li>
              <li>Vehicle interest and preferences</li>
              <li>Communication history and engagement</li>
              <li>Booking and appointment records</li>
            </ul>
            <p className="mt-4"><strong>Dealership user data:</strong></p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Employee names and contact details</li>
              <li>Login credentials and account activity</li>
              <li>Dealership business information</li>
              <li>Performance and usage analytics</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Legal basis for processing</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>We process personal information based on:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li><strong>Consent:</strong> You or your customers opt in via forms or WhatsApp (with explicit consent message)</li>
              <li><strong>Contract:</strong> Processing is necessary to deliver AUTORA OS services under your subscription</li>
              <li><strong>Legal obligation:</strong> Recording customer interactions for dispute resolution or regulatory compliance</li>
              <li><strong>Legitimate interest:</strong> Platform analytics, fraud prevention, service improvement</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Your rights under POPIA</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p><strong>Right of access:</strong> You can request a copy of all personal information we hold about you</p>
            <p><strong>Right to correction:</strong> You can request we correct inaccurate or incomplete information</p>
            <p><strong>Right to deletion:</strong> You can request deletion of your data (subject to legal retention requirements)</p>
            <p><strong>Right to object:</strong> You can object to specific processing, including direct marketing</p>
            <p><strong>Right to restrict processing:</strong> You can ask us to limit how we use your data pending resolution of a dispute</p>
            <p><strong>Right to lodge a complaint:</strong> You can complain to the Information Regulator if you believe your rights were violated</p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">WhatsApp and customer consent</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>AUTORA OS uses WhatsApp Business API to send and receive messages on behalf of dealerships.</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>All messages are sent via the official WhatsApp Business API (not web scraping)</li>
              <li>Messages use pre-approved templates compliant with WhatsApp policy</li>
              <li>Customer phone numbers must be verified and stored with opt-in status</li>
              <li>Customers can opt out by replying STOP at any time</li>
              <li>All conversations are encrypted end-to-end by WhatsApp</li>
              <li>We store message content and metadata for audit trail purposes (POPIA compliance)</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Data security and safeguards</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p><strong>Technical safeguards:</strong></p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>HTTPS encryption (TLS 1.3) for all data in transit</li>
              <li>AES-256 database encryption at rest</li>
              <li>Password hashing (bcrypt with salt)</li>
              <li>Regular security audits and vulnerability scanning</li>
            </ul>
            <p className="mt-3"><strong>Organizational safeguards:</strong></p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Role-based access control (staff only access necessary data)</li>
              <li>Data processing agreements with third-party providers (Supabase, SendGrid, WhatsApp)</li>
              <li>Employee training on data protection and POPIA compliance</li>
              <li>Incident response plan for data breaches</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Data retention and deletion</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li><strong>Booking records:</strong> Retained for 7 years (legal requirement for consumer transactions)</li>
              <li><strong>WhatsApp message logs:</strong> Retained for 2+ years for audit trail</li>
              <li><strong>Customer opt-out lists:</strong> Retained indefinitely to respect future opt-outs</li>
              <li><strong>Account deletion:</strong> Upon request, all data associated with deleted accounts is erased within 30 days</li>
              <li><strong>Backup/archived data:</strong> Deleted data may persist in backups for 90 days, after which it is permanently destroyed</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Your responsibilities as a dealership</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>As a AUTORA OS user, you are responsible for:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Obtaining customer consent before sharing their contact details with AUTORA OS</li>
              <li>Ensuring customers are aware AUTORA OS will send them WhatsApp messages</li>
              <li>Complying with WhatsApp messaging templates and frequency guidelines</li>
              <li>Respecting customer opt-out requests immediately (mark as STOP in AUTORA OS)</li>
              <li>Using customer data only for legitimate dealership purposes (no spam, no unauthorized third-party sharing)</li>
              <li>Reporting any unauthorized access or data misuse to us immediately</li>
            </ul>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Data subject requests</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              To exercise your POPIA rights (access, correction, deletion, objection), submit a request to:
            </p>
            <p className="mt-3">
              Email:{" "}
              <a href="mailto:dpo@autoraos.company" className="font-semibold text-tide underline underline-offset-2">
                dpo@autoraos.company
              </a>
            </p>
            <p className="mt-3">
              Please include your name, dealership, and a clear description of what you are requesting. We will respond within 15 business days.
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Complaints and escalation</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>If you believe AUTORA OS has violated your POPIA rights, you can:</p>
            <ul className="list-outside list-disc space-y-2 pl-5">
              <li>Contact us first: dpo@autoraos.company</li>
              <li>Lodge a formal complaint with the Information Regulator South Africa (IRSA)</li>
            </ul>
            <p className="mt-3">
              <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noreferrer" className="font-semibold text-tide underline underline-offset-2">
                Information Regulator South Africa
              </a>
            </p>
          </div>
        </article>

        <article>
          <h2 className="text-2xl font-semibold text-coal">Changes to this policy</h2>
          <div className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-steel">
            <p>
              We may update this policy as we evolve our data practices or in response to legal changes. Significant updates will be communicated via email.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
