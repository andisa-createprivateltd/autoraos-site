import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/booking-form";

export const metadata: Metadata = {
  title: "Book Appointment"
};

export default function BookPage({
  searchParams
}: {
  searchParams: {
    dealership?: string;
    brand?: string;
    city?: string;
    province?: string;
  };
}) {
  const prefill = {
    dealershipName: searchParams.dealership,
    brand: searchParams.brand,
    city: searchParams.city,
    province: searchParams.province
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <section>
        <p className="text-xs uppercase tracking-[0.16em] text-tide">Book Appointment</p>
        <h1 className="mt-2 text-4xl font-semibold text-coal md:text-5xl">15-minute Dealer Lead Audit</h1>
        <p className="mt-4 text-base text-steel">
          We review lead handling speed, WhatsApp conversion flow, and booking operations, then share practical next actions.
        </p>

        <div className="mt-8 rounded-3xl border border-steel/12 bg-white p-6">
          <h2 className="text-lg font-semibold text-coal">What you get in the audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            <li>• Current pipeline and inbox diagnosis</li>
            <li>• WhatsApp response-time benchmark</li>
            <li>• Booking conversion bottleneck review</li>
            <li>• Practical 30-day Dealer OS rollout plan</li>
          </ul>
        </div>
      </section>

      <section>
        <BookingForm prefill={prefill} />
      </section>
    </div>
  );
}
