import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "POPIA & Data Handling"
};

export default function PopiaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <section>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Legal</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">POPIA &amp; Data Handling</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-steel">
          How {PLATFORM_NAME} complies with the Protection of Personal Information Act (POPIA) and handles your data.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-relaxed text-steel">
        <h2 className="text-xl font-semibold text-coal">Our commitment to POPIA</h2>
        <p>
          {PLATFORM_NAME}, operated by {PARENT_COMPANY_NAME}, is committed to processing personal information in compliance with the Protection of Personal Information Act, 2013 (POPIA). As a platform that handles dealership conversations and customer phone numbers, data protection is central to our operations.
        </p>

        <h2 className="text-xl font-semibold text-coal">Lawful basis for processing</h2>
        <p>We process personal information on the following bases:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li><strong>Consent:</strong> When you submit a form, book an appointment, or opt in to WhatsApp communications</li>
          <li><strong>Contract:</strong> To provide platform services to dealerships under our service agreements</li>
          <li><strong>Legitimate interest:</strong> To improve platform performance and operational outcomes</li>
        </ul>

        <h2 className="text-xl font-semibold text-coal">WhatsApp opt-in and templates</h2>
        <p>
          All WhatsApp template messages sent through {PLATFORM_NAME} require valid opt-in from recipients. Dealerships using our platform are responsible for obtaining opt-in consent before initiating template-based outreach. Our AI assistant responds only to inbound conversations initiated by customers.
        </p>

        <h2 className="text-xl font-semibold text-coal">Data processing practices</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Client data is isolated per dealership</li>
          <li>Conversations are stored securely and access is role-based</li>
          <li>Personal information is not sold or shared for marketing purposes</li>
          <li>Data retention follows reasonable business practices and applicable law</li>
        </ul>

        <h2 className="text-xl font-semibold text-coal">Your rights under POPIA</h2>
        <p>As a data subject, you have the right to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Request access to your personal information</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to processing of your personal information</li>
          <li>Lodge a complaint with the Information Regulator</li>
        </ul>

        <h2 className="text-xl font-semibold text-coal">Information Officer</h2>
        <p>
          To exercise your rights or raise a data-related concern, please contact us through our <a href="/contact" className="font-semibold text-tide underline underline-offset-2">contact page</a>.
        </p>
      </section>
    </div>
  );
}
