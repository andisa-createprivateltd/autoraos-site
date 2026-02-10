import type { Metadata } from "next";
import { PLATFORM_NAME, PARENT_COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <section>
        <p className="text-xs uppercase tracking-[0.15em] text-tide">Legal</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-steel">Last updated: February 2026</p>
      </section>

      <section className="space-y-6 text-base leading-relaxed text-steel">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Overview</h2>
          <p>
            {PLATFORM_NAME}, operated by {PARENT_COMPANY_NAME}, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
          </p>
          <p>
            {PLATFORM_NAME} provides dealership lead management and WhatsApp communication infrastructure. We handle sensitive business communications and customer data on behalf of our dealership clients.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Contact information (name, email address, phone number)</li>
            <li>Dealership information (business name, location, brand affiliations)</li>
            <li>WhatsApp conversation data processed through our platform</li>
            <li>Lead and booking information submitted through our system</li>
            <li>Usage data and analytics about how you interact with our platform</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and manage bookings and appointments</li>
            <li>Facilitate WhatsApp communications between dealerships and their customers</li>
            <li>Send operational notifications and service updates</li>
            <li>Analyze platform usage and performance</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Isolation and Security</h2>
          <p>
            Client data is isolated by design. Each dealership's conversation data, leads, and booking information are segregated and accessible only to authorized users within that dealership's account.
          </p>
          <p>
            We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share information in the following circumstances:</p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>With service providers who assist in operating our platform (e.g., cloud hosting, communication services)</li>
            <li>When required by law or to respond to legal process</li>
            <li>To protect the rights, property, or safety of {PLATFORM_NAME}, our users, or others</li>
            <li>With your explicit consent</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">WhatsApp Data Processing</h2>
          <p>
            {PLATFORM_NAME} processes WhatsApp messages on behalf of dealerships. This processing is subject to WhatsApp's Business Solution Terms and Meta's data policies. We act as a data processor for dealership clients who remain the data controllers of their customer conversations.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-inside list-disc space-y-2 pl-4">
            <li>Access and receive a copy of your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your information (subject to legal obligations)</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="font-semibold text-coal">
            {PARENT_COMPANY_NAME}<br />
            Email: privacy@createprivateltd.com
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-coal">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </div>
      </section>
    </div>
  );
}
