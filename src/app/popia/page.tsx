import type { Metadata } from "next";
import Link from "next/link";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "POPIA & Data Handling"
};

export default function PopiaPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <section>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Legal</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">POPIA & Data Handling</h1>
        <p className="mt-4 text-sm text-steel">Protection of Personal Information Act (POPIA) Compliance</p>
        <p className="mt-2 text-sm text-steel">Last updated: February 2026</p>
      </section>

      <section className="space-y-6 text-base leading-relaxed text-steel">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">POPIA Compliance Overview</h2>
          <p>
            {PLATFORM_NAME}, operated by {PARENT_COMPANY_NAME}, is committed to compliance with South Africa's Protection of Personal Information Act (POPIA), Act 4 of 2013.
          </p>
          <p>
            As a provider of dealership communication infrastructure, we process personal information on behalf of our dealership clients. We implement appropriate safeguards to ensure lawful, reasonable, and secure processing of personal information.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Our Role as Operator</h2>
          <p>
            Under POPIA, {PLATFORM_NAME} acts as an <strong>operator</strong> (data processor) on behalf of dealerships who are the <strong>responsible parties</strong> (data controllers) for customer personal information.
          </p>
          <p>
            Dealerships using our platform remain responsible for:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Obtaining valid consent from customers for data collection and processing</li>
            <li>Ensuring lawful and reasonable processing conditions</li>
            <li>Responding to data subject requests (access, correction, deletion)</li>
            <li>Maintaining appropriate records of processing activities</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">How We Process Personal Information</h2>
          <p>
            We process personal information only as instructed by our dealership clients and for the following purposes:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Facilitating communication between dealerships and their customers</li>
            <li>Managing leads, bookings, and appointments</li>
            <li>Providing AI-assisted responses within defined parameters</li>
            <li>Generating operational insights and performance reports</li>
            <li>Ensuring platform security and preventing fraud</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Security Measures</h2>
          <p>
            We implement appropriate technical and organizational measures to secure personal information against loss, damage, unauthorized access, or unlawful processing, including:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Data isolation by client account</li>
            <li>Encrypted data transmission and storage</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Regular security assessments and updates</li>
            <li>Secure cloud infrastructure with established providers</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">WhatsApp Communication and Opt-In</h2>
          <p>
            {PLATFORM_NAME} facilitates WhatsApp communication on behalf of dealerships. Dealerships must ensure they have obtained proper opt-in consent from customers before initiating WhatsApp conversations.
          </p>
          <p>
            Key requirements:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Customers must have opted in to receive WhatsApp messages</li>
            <li>Opt-in consent must be clear, specific, and documented</li>
            <li>Customers must be able to opt out at any time</li>
            <li>WhatsApp message templates must comply with Meta's policies</li>
          </ul>
          <p>
            We provide tools to manage opt-in status, but dealerships are responsible for ensuring valid consent exists before sending messages.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Subject Rights</h2>
          <p>
            Under POPIA, individuals have rights regarding their personal information. While dealerships are primarily responsible for responding to these requests, we support them by:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Providing tools to access and export customer data</li>
            <li>Enabling correction or deletion of information</li>
            <li>Maintaining audit logs of data access and processing</li>
            <li>Assisting with data portability requests</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Cross-Border Data Transfers</h2>
          <p>
            Personal information may be processed or stored outside South Africa using cloud service providers. We ensure that any cross-border transfers comply with POPIA requirements and that adequate protection measures are in place.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Retention</h2>
          <p>
            We retain personal information only for as long as necessary to fulfill the purposes for which it was collected or as required by law. Dealerships can configure retention policies within their account settings.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Breach Notification</h2>
          <p>
            In the event of a data breach involving personal information, we will notify affected dealerships promptly so they can fulfill their notification obligations under POPIA.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Information Officer</h2>
          <p>
            For POPIA-related inquiries or to exercise data subject rights, contact our Information Officer:
          </p>
          <p className="font-semibold text-coal">
            Information Officer<br />
            {PARENT_COMPANY_NAME}<br />
            Email: privacy@createprivateltd.com
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Related Policies</h2>
          <p>
            For more information about how we handle data, please review:
          </p>
          <ul className="list-inside space-y-2 pl-4">
            <li>
              <Link href="/privacy" className="font-semibold text-tide underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="font-semibold text-tide underline">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
