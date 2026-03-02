import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/booking-form";
import { buildPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Request Revenue Audit",
  description:
    "Book a 15-minute AUTORA OS revenue audit to review enquiry handling, WhatsApp response discipline, and booking execution risk.",
  path: "/request-audit"
});

export default async function RequestAuditPage({
  searchParams
}: {
  searchParams: Promise<{
    dealership?: string;
    brand?: string;
    city?: string;
    province?: string;
  }>;
}) {
  const params = await searchParams;
  const prefill = {
    dealershipName: params.dealership,
    brand: params.brand,
    city: params.city,
    province: params.province
  };

  return (
    <div className="page-motion grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <section className="max-w-2xl">
        <div className="panel-dark p-7 md:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-white/68">Request Revenue Audit</p>
          <h1 className="section-heading mt-2 text-balance text-4xl font-semibold md:text-5xl">
            15-minute revenue audit for dealership lead operations
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-white/78">
            We review enquiry capture, WhatsApp response discipline, booking execution, and governance gaps before rollout.
          </p>
        </div>

        <div className="page-shell mt-5 p-6">
          <h2 className="section-heading text-lg font-semibold text-coal">What the audit covers</h2>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            <li>• Lead capture path across web, paid, and WhatsApp channels</li>
            <li>• Current response SLA expectations and failure points</li>
            <li>• Booking workflow friction, no-show pressure, and follow-up gaps</li>
            <li>• Recommended rollout scope for your store or group structure</li>
          </ul>
        </div>
      </section>

      <section>
        <BookingForm prefill={prefill} />
      </section>
    </div>
  );
}
