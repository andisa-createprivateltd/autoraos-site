import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <section>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Legal</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-steel">
          Last updated: February 2026
        </p>
      </section>

      <section className="space-y-4 text-sm leading-relaxed text-steel">
        <h2 className="text-xl font-semibold text-coal">1. Who we are</h2>
        <p>
          {PLATFORM_NAME} is operated by {PARENT_COMPANY_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We provide a WhatsApp and lead operating system for automotive dealerships in South Africa.
        </p>

        <h2 className="text-xl font-semibold text-coal">2. Information we collect</h2>
        <p>We collect information you provide directly, including:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Contact details (name, email, phone number)</li>
          <li>Dealership information (dealership name, brand, location)</li>
          <li>Booking and appointment preferences</li>
          <li>Messages sent through our contact and booking forms</li>
          <li>WhatsApp conversation data processed on behalf of dealerships</li>
        </ul>

        <h2 className="text-xl font-semibold text-coal">3. How we use your information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Provide and operate the {PLATFORM_NAME} platform</li>
          <li>Process bookings and appointment requests</li>
          <li>Respond to enquiries and provide support</li>
          <li>Improve our platform and services</li>
          <li>Send operational communications related to your account</li>
        </ul>

        <h2 className="text-xl font-semibold text-coal">4. Data sharing</h2>
        <p>
          We do not sell your personal information. We share data only with service providers necessary for platform operation (hosting, email delivery, WhatsApp Business API) and as required by law.
        </p>

        <h2 className="text-xl font-semibold text-coal">5. Data security</h2>
        <p>
          We implement appropriate technical and organisational measures to protect your personal information. Client data is isolated by design and infrastructure access is tightly controlled.
        </p>

        <h2 className="text-xl font-semibold text-coal">6. Your rights</h2>
        <p>
          Under the Protection of Personal Information Act (POPIA), you have the right to access, correct, or delete your personal information. See our <a href="/popia" className="font-semibold text-tide underline underline-offset-2">POPIA &amp; Data Handling</a> page for details.
        </p>

        <h2 className="text-xl font-semibold text-coal">7. Contact</h2>
        <p>
          For privacy-related queries, contact us at <a href="/contact" className="font-semibold text-tide underline underline-offset-2">our contact page</a>.
        </p>
      </section>
    </div>
  );
}
