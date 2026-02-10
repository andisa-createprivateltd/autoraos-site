import { ButtonLink } from "@/components/ui/button-link";

export function CtaBanner() {
  return (
    <section className="mt-16 rounded-3xl border border-steel/15 bg-coal p-8 text-white md:p-10">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">AUTORA Demo</p>
      <h2 className="mt-3 max-w-2xl text-balance text-2xl font-semibold leading-tight md:text-3xl">
        Ready to run dealership lead handling as infrastructure?
      </h2>
      <p className="mt-4 max-w-xl text-pretty text-sm text-white/80">
        In 15 minutes, we map response speed, booking flow, and follow-up gaps across your sales team.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/book">Book Free 15-Minute Dealer Audit</ButtonLink>
        <ButtonLink href="/pricing" variant="ghost" className="border-white/25 bg-transparent text-white hover:bg-white/10">
          View Pricing
        </ButtonLink>
      </div>
    </section>
  );
}
