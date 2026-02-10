import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service"
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <section>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Legal</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-steel">Last updated: February 2026</p>
      </section>

      <section className="space-y-6 text-base leading-relaxed text-steel">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Agreement to Terms</h2>
          <p>
            By accessing or using {PLATFORM_NAME}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
          </p>
          <p>
            {PLATFORM_NAME} is operated by {PARENT_COMPANY_NAME} and provides dealership lead management and WhatsApp communication infrastructure services.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Service Description</h2>
          <p>
            {PLATFORM_NAME} provides a platform for automotive dealerships to manage leads, conversations, and bookings. Our services include:
          </p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>WhatsApp AI assistant and conversation management</li>
            <li>Unified inbox for dealership communications</li>
            <li>Lead capture and qualification tools</li>
            <li>Booking and appointment management</li>
            <li>Performance insights and reporting</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">User Accounts and Access</h2>
          <p>
            To use {PLATFORM_NAME}, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p>
            Access to the platform is provided on a subscription basis. Different account types (platform_owner, platform_support, dealer_admin, dealer_sales, dealer_marketing) have different permission levels.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Use the platform for any unlawful purpose or in violation of any regulations</li>
            <li>Attempt to gain unauthorized access to any part of the platform</li>
            <li>Interfere with or disrupt the platform's operation</li>
            <li>Use the platform to send spam or unsolicited communications</li>
            <li>Violate WhatsApp's Business Solution Terms or communication policies</li>
            <li>Misrepresent your identity or affiliation</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Ownership and Processing</h2>
          <p>
            You retain ownership of all customer data, leads, and conversation content processed through {PLATFORM_NAME}. We act as a data processor on your behalf.
          </p>
          <p>
            By using our services, you grant us the right to process, store, and transmit your data as necessary to provide the platform services. This processing is subject to our Privacy Policy and applicable data protection laws.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Subscription and Payment</h2>
          <p>
            Access to {PLATFORM_NAME} requires an active paid subscription. Pricing tiers (Starter, Growth, Scale) are detailed on our pricing page. Payment terms are specified in your subscription agreement.
          </p>
          <p>
            We reserve the right to modify pricing with advance notice. Subscription fees are non-refundable except as required by law.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Service Availability</h2>
          <p>
            While we strive to maintain high availability, we do not guarantee that the platform will be available 100% of the time. We may suspend or restrict access for maintenance, updates, or other operational reasons.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Termination</h2>
          <p>
            Either party may terminate the service relationship with appropriate notice as specified in the subscription agreement. We may immediately suspend or terminate access if you violate these Terms.
          </p>
          <p>
            Upon termination, you may request export of your data within a reasonable timeframe.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {PARENT_COMPANY_NAME} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of {PLATFORM_NAME}.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless {PARENT_COMPANY_NAME} from any claims, damages, or expenses arising from your use of the platform or violation of these Terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the modified Terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Governing Law</h2>
          <p>
            These Terms are governed by the laws of South Africa. Any disputes shall be resolved in the appropriate courts of South Africa.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Contact</h2>
          <p>
            For questions about these Terms, contact:
          </p>
          <p className="font-semibold text-coal">
            {PARENT_COMPANY_NAME}<br />
            Email: legal@createprivateltd.com
          </p>
        </div>
      </section>
    </div>
  );
}
