import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h1 className="text-4xl font-semibold text-coal">Privacy Policy</h1>
        <p className="mt-2 text-sm text-steel">Last updated: February 10, 2026</p>
      </section>

      <section className="space-y-4 text-sm leading-relaxed text-steel">
        <p>
          {PLATFORM_NAME}, a subsidiary of {PARENT_COMPANY_NAME}, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-coal">1. Information We Collect</h2>
            <p className="mt-2">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Contact information (name, email address, phone number)</li>
              <li>Dealership information (name, brand, location)</li>
              <li>Booking and appointment data</li>
              <li>WhatsApp conversation data (when you interact with our platform)</li>
              <li>Usage data and analytics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">2. How We Use Your Information</h2>
            <p className="mt-2">
              We use the information we collect to:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and manage bookings and appointments</li>
              <li>Communicate with you about our services</li>
              <li>Respond to customer enquiries via WhatsApp and other channels</li>
              <li>Analyze usage patterns and optimize our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">3. WhatsApp Data Handling</h2>
            <p className="mt-2">
              When using WhatsApp through our platform:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>We process messages to provide automated responses and route enquiries</li>
              <li>Conversation data is stored securely for operational purposes</li>
              <li>We comply with WhatsApp Business API terms and conditions</li>
              <li>Customers can opt-out of automated messages at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">4. Data Storage and Security</h2>
            <p className="mt-2">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Data is encrypted in transit and at rest</li>
              <li>Multiple backup systems (database, email, cloud storage)</li>
              <li>Access controls and authentication measures</li>
              <li>Regular security audits and updates</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">5. Data Sharing and Disclosure</h2>
            <p className="mt-2">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Service providers (email, cloud storage, analytics)</li>
              <li>Your dealership (if you are a customer contacting them)</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">6. Your Rights</h2>
            <p className="mt-2">
              Under South African law (POPIA), you have the right to:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">7. Cookies and Tracking</h2>
            <p className="mt-2">
              We use cookies and similar technologies to improve your experience and analyze usage patterns. You can control cookie settings through your browser.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">8. Children&apos;s Privacy</h2>
            <p className="mt-2">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">9. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">10. Contact Us</h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Email: <a href="mailto:andisa@createprivateltd.com" className="text-tide underline">andisa@createprivateltd.com</a></li>
              <li>WhatsApp: <a href="https://wa.me/27703521316" className="text-tide underline" target="_blank" rel="noopener noreferrer">+27 70 352 1316</a></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
