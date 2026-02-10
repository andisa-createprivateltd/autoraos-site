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
      <section className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-tide">Book Free 15-Minute Audit</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-coal md:text-5xl">15-Minute Dealer Lead Audit</h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-steel">
          We review lead handling speed, WhatsApp conversion flow, and booking operations, then share practical next actions.
        </p>
        
        <p className="mt-4 text-sm font-medium text-coal">
          No obligation. Operational review only.
        </p>

        <div className="mt-8 rounded-3xl border border-steel/12 bg-white p-6">
          <h2 className="text-lg font-semibold text-coal">What you get in the audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-steel">
            <li>• Current pipeline and inbox diagnosis</li>
            <li>• WhatsApp response-time benchmark</li>
            <li>• Booking conversion bottleneck review</li>
            <li>• Practical 30-day AUTORA rollout plan</li>
          </ul>
        </div>
        
        <div className="mt-6 rounded-2xl border border-tide/20 bg-tide/5 p-4">
          <p className="text-sm text-steel">
            <span className="font-semibold text-coal">Prefer WhatsApp?</span> If booking slots don&apos;t load or you need immediate help,{" "}
            <a href="https://wa.me/27703521316" className="font-semibold text-tide underline" target="_blank" rel="noopener noreferrer">
              tap here to message us now
            </a>.
          </p>
        </div>
      </section>

      <section>
        <BookingForm prefill={prefill} />
      </section>
    </div>
  );
}
