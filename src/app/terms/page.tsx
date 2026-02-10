import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service"
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h1 className="text-4xl font-semibold text-coal">Terms of Service</h1>
        <p className="mt-2 text-sm text-steel">Last updated: February 10, 2026</p>
      </section>

      <section className="space-y-4 text-sm leading-relaxed text-steel">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of {PLATFORM_NAME}, a platform operated by {PARENT_COMPANY_NAME}. By accessing or using our services, you agree to be bound by these Terms.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-coal">1. Service Description</h2>
            <p className="mt-2">
              {PLATFORM_NAME} provides a WhatsApp and lead operating system for automotive dealerships in South Africa. Our services include:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>WhatsApp AI automated response system</li>
              <li>Lead capture and management</li>
              <li>Booking and appointment system</li>
              <li>Unified inbox for dealership communications</li>
              <li>Performance insights and analytics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">2. Eligibility</h2>
            <p className="mt-2">
              Our services are designed for automotive dealerships and related businesses in South Africa. By using our platform, you represent that:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>You are at least 18 years of age</li>
              <li>You have the authority to bind your organization to these Terms</li>
              <li>You will use the service for lawful business purposes only</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">3. Account Registration and Security</h2>
            <p className="mt-2">
              When you create an account:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>You are responsible for all activities under your account</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">4. Acceptable Use</h2>
            <p className="mt-2">
              You agree not to:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Send spam or unsolicited messages through our platform</li>
              <li>Violate WhatsApp Business API policies</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Share your account credentials with unauthorized parties</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">5. Pricing and Payment</h2>
            <p className="mt-2">
              Subscription fees are billed monthly in South African Rand (ZAR). You agree to:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Pay all fees when due</li>
              <li>Provide accurate billing information</li>
              <li>Notify us of any billing disputes within 30 days</li>
              <li>Accept that fees are non-refundable except as required by law</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">6. Service Modifications and Availability</h2>
            <p className="mt-2">
              We reserve the right to:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Modify or discontinue features with reasonable notice</li>
              <li>Perform maintenance that may temporarily affect availability</li>
              <li>Update pricing with 30 days&apos; notice</li>
            </ul>
            <p className="mt-2">
              We aim for 99.9% uptime but cannot guarantee uninterrupted service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">7. Intellectual Property</h2>
            <p className="mt-2">
              All content, features, and functionality of {PLATFORM_NAME} are owned by {PARENT_COMPANY_NAME} and protected by copyright, trademark, and other intellectual property laws. You may not:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Copy, modify, or reverse engineer our platform</li>
              <li>Use our trademarks without permission</li>
              <li>Create derivative works based on our services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">8. Data Ownership</h2>
            <p className="mt-2">
              You retain ownership of your customer data and content. By using our service, you grant us permission to:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Store and process your data to provide the service</li>
              <li>Create anonymized analytics from aggregated data</li>
              <li>Back up your data for disaster recovery</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">9. Termination</h2>
            <p className="mt-2">
              Either party may terminate the service:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>You may cancel your subscription at any time (effective end of billing period)</li>
              <li>We may suspend or terminate accounts for Terms violations</li>
              <li>We may terminate with 30 days&apos; notice for business reasons</li>
            </ul>
            <p className="mt-2">
              Upon termination, you will lose access to the platform. We will provide data export options for up to 30 days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">10. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by South African law:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>We provide the service &quot;as is&quot; without warranties</li>
              <li>We are not liable for lost revenue or business opportunities</li>
              <li>Our total liability is limited to fees paid in the last 12 months</li>
              <li>We are not responsible for third-party services (WhatsApp, hosting, etc.)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">11. Indemnification</h2>
            <p className="mt-2">
              You agree to indemnify and hold harmless {PARENT_COMPANY_NAME} from claims arising from your use of the service, violation of these Terms, or infringement of third-party rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">12. Governing Law</h2>
            <p className="mt-2">
              These Terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">13. Changes to Terms</h2>
            <p className="mt-2">
              We may update these Terms from time to time. We will notify you of material changes via email or platform notification. Continued use after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-coal">14. Contact</h2>
            <p className="mt-2">
              For questions about these Terms:
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
