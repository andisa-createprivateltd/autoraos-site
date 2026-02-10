import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service"
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <section>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Legal</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-steel">
          Last updated: February 2026
        </p>
      </section>

      <section className="space-y-4 text-sm leading-relaxed text-steel">
        <h2 className="text-xl font-semibold text-coal">1. Agreement</h2>
        <p>
          By accessing or using {PLATFORM_NAME}, operated by {PARENT_COMPANY_NAME}, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
        </p>

        <h2 className="text-xl font-semibold text-coal">2. Platform description</h2>
        <p>
          {PLATFORM_NAME} provides a WhatsApp and lead operating system for automotive dealerships, including lead capture, AI-assisted responses, booking management, and operational insights.
        </p>

        <h2 className="text-xl font-semibold text-coal">3. Eligibility</h2>
        <p>
          The platform is designed for automotive dealerships and authorised business users. You must be authorised to act on behalf of your dealership to create an account.
        </p>

        <h2 className="text-xl font-semibold text-coal">4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Use the platform for any unlawful purpose</li>
          <li>Attempt to access systems or data beyond your authorisation</li>
          <li>Send spam or unsolicited messages through the platform</li>
          <li>Interfere with platform operation or security</li>
        </ul>

        <h2 className="text-xl font-semibold text-coal">5. WhatsApp compliance</h2>
        <p>
          All WhatsApp communications processed through {PLATFORM_NAME} comply with WhatsApp Business API terms. Template messages require prior opt-in from recipients. Dealerships are responsible for obtaining and maintaining valid opt-in consent from their customers.
        </p>

        <h2 className="text-xl font-semibold text-coal">6. Data ownership</h2>
        <p>
          Conversation ownership remains with dealerships. Your dealership data is isolated by design. We do not use your data for purposes other than providing and improving the platform.
        </p>

        <h2 className="text-xl font-semibold text-coal">7. Service availability</h2>
        <p>
          {PLATFORM_NAME} is currently in private beta. We aim for high availability but do not guarantee uninterrupted service during the beta period.
        </p>

        <h2 className="text-xl font-semibold text-coal">8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {PARENT_COMPANY_NAME} shall not be liable for indirect, incidental, or consequential damages arising from use of the platform.
        </p>

        <h2 className="text-xl font-semibold text-coal">9. Changes to terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-semibold text-coal">10. Governing law</h2>
        <p>
          These terms are governed by the laws of South Africa.
        </p>
      </section>
    </div>
  );
}
