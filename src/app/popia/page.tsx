import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "POPIA & Data Handling"
};

export default function PopiaPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h1 className="text-4xl font-semibold text-coal">POPIA & Data Handling</h1>
        <p className="mt-2 text-sm text-steel">Protection of Personal Information Act Compliance</p>
      </section>

      <section className="space-y-4 text-sm leading-relaxed text-steel">
        <p>
          {PLATFORM_NAME}, operated by {PARENT_COMPANY_NAME}, is committed to complying with the Protection of Personal Information Act, 2013 (POPIA) and protecting your personal information.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-coal">POPIA Compliance Statement</h2>
            <p className="mt-2">
              We process personal information in accordance with POPIA&apos;s eight conditions for lawful processing:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Accountability:</strong> We take responsibility for all personal information in our possession</li>
              <li><strong>Processing Limitation:</strong> We collect information only for specific, lawful purposes</li>
              <li><strong>Purpose Specification:</strong> We clearly communicate why we collect your information</li>
              <li><strong>Further Processing Limitation:</strong> We don&apos;t use your data for unrelated purposes</li>
              <li><strong>Information Quality:</strong> We keep your information accurate and up to date</li>
              <li><strong>Openness:</strong> We&apos;re transparent about our data practices</li>
              <li><strong>Security Safeguards:</strong> We protect your information with appropriate measures</li>
              <li><strong>Data Subject Participation:</strong> You have rights to access and correct your data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Responsible Party Details</h2>
            <p className="mt-2">
              Under POPIA, {PARENT_COMPANY_NAME} is the Responsible Party for the personal information we process.
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Company:</strong> {PARENT_COMPANY_NAME}</li>
              <li><strong>Platform:</strong> {PLATFORM_NAME}</li>
              <li><strong>Contact:</strong> <a href="mailto:andisa@createprivateltd.com" className="text-tide underline">andisa@createprivateltd.com</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Types of Personal Information Processed</h2>
            <p className="mt-2">
              We process the following categories of personal information:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Identity Information:</strong> Name, ID number (if provided)</li>
              <li><strong>Contact Information:</strong> Email address, phone number, WhatsApp number</li>
              <li><strong>Business Information:</strong> Dealership name, brand, location, role</li>
              <li><strong>Communication Data:</strong> Messages, enquiries, conversation history</li>
              <li><strong>Technical Information:</strong> IP address, device information, usage data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Lawful Basis for Processing</h2>
            <p className="mt-2">
              We process your personal information based on:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Consent:</strong> You provide consent when signing up for our services</li>
              <li><strong>Contractual Necessity:</strong> Processing required to deliver our services</li>
              <li><strong>Legitimate Interest:</strong> Improving our platform and preventing fraud</li>
              <li><strong>Legal Obligation:</strong> Compliance with South African laws</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">WhatsApp Data Processing</h2>
            <p className="mt-2">
              Specific to WhatsApp communications:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>We process WhatsApp messages to provide automated responses and routing</li>
              <li>We comply with WhatsApp Business API policies and opt-in requirements</li>
              <li>Customers must consent to receive automated messages</li>
              <li>Customers can opt-out by sending &quot;STOP&quot; at any time</li>
              <li>We maintain records of consent for compliance</li>
              <li>Template messages are pre-approved and comply with regulations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Data Storage and Location</h2>
            <p className="mt-2">
              Your personal information is stored:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Database:</strong> Secure cloud infrastructure (Supabase)</li>
              <li><strong>Email Backup:</strong> Secure email systems (SendGrid)</li>
              <li><strong>Cloud Backup:</strong> Encrypted cloud storage (Google Drive)</li>
              <li><strong>Location:</strong> Data may be stored outside South Africa but with equivalent protections</li>
              <li><strong>Retention:</strong> We retain data for as long as necessary to provide services and comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Your Rights Under POPIA</h2>
            <p className="mt-2">
              You have the right to:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interest</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong>Data Portability:</strong> Request your data in a structured format</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              <li><strong>Lodge Complaint:</strong> Contact the Information Regulator if you believe we&apos;ve violated POPIA</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Security Measures</h2>
            <p className="mt-2">
              We implement technical and organizational measures to protect your information:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Encryption of data in transit (SSL/TLS) and at rest</li>
              <li>Access controls and authentication</li>
              <li>Regular security audits and updates</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
              <li>Multiple backup systems for data recovery</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Data Breach Notification</h2>
            <p className="mt-2">
              In the event of a data breach that poses a risk to your rights and freedoms, we will:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Notify the Information Regulator within required timeframes</li>
              <li>Notify affected individuals promptly</li>
              <li>Provide information about the nature of the breach</li>
              <li>Explain measures taken to mitigate harm</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Third-Party Service Providers</h2>
            <p className="mt-2">
              We use the following service providers who may process your personal information:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Database:</strong> Supabase (cloud database hosting)</li>
              <li><strong>Email:</strong> SendGrid (email delivery)</li>
              <li><strong>Cloud Storage:</strong> Google Drive (backup storage)</li>
              <li><strong>WhatsApp:</strong> Meta Platforms (WhatsApp Business API)</li>
              <li><strong>Analytics:</strong> Google Analytics (usage analytics)</li>
            </ul>
            <p className="mt-2">
              All service providers are required to implement appropriate security measures and only process data according to our instructions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Information Regulator Contact</h2>
            <p className="mt-2">
              If you wish to lodge a complaint about how we handle your personal information:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li><strong>Information Regulator (South Africa)</strong></li>
              <li>Website: <a href="https://www.justice.gov.za/inforeg/" className="text-tide underline" target="_blank" rel="noopener noreferrer">www.justice.gov.za/inforeg</a></li>
              <li>Email: inforeg@justice.gov.za</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Exercise Your Rights</h2>
            <p className="mt-2">
              To exercise any of your POPIA rights, please contact us:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Email: <a href="mailto:andisa@createprivateltd.com" className="text-tide underline">andisa@createprivateltd.com</a></li>
              <li>WhatsApp: <a href="https://wa.me/27703521316" className="text-tide underline" target="_blank" rel="noopener noreferrer">+27 70 352 1316</a></li>
            </ul>
            <p className="mt-2">
              We will respond to your request within 30 days as required by POPIA.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">Updates to This Notice</h2>
            <p className="mt-2">
              We may update this POPIA notice from time to time. Material changes will be communicated via email or platform notification. The current version is always available on this page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
