import { ButtonLink } from "@/components/ui/button-link";

export function CtaBanner() {
  return (
    <section className="mt-16 rounded-3xl bg-gradient-to-r from-coal via-[#082334] to-tide p-8 text-white md:p-10">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">Dealer OS Demo</p>
      <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight md:text-3xl">
        Ready to run dealership lead handling as infrastructure?
      </h2>
      <p className="mt-4 max-w-xl text-sm text-white/80">
        Book a 15-minute Dealer Lead Audit to map how quickly your team responds, books, and converts from WhatsApp.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/book">Book Free 15-Minute Dealer Lead Audit</ButtonLink>
        <ButtonLink href="/pricing" variant="ghost" className="border-white/30 text-white hover:bg-white/10">
          View Pricing
        </ButtonLink>
      </div>
    </section>
  );
}
