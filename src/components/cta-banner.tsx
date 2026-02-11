import { ButtonLink } from "@/components/ui/button-link";

export function CtaBanner() {
  return (
    <section className="mt-10 rounded-3xl border border-steel/15 bg-coal p-5 text-white sm:p-8 md:mt-16 md:p-10">
      <p className="text-xs uppercase tracking-[0.22em] text-gold">AUTORA Demo</p>
      <h2 className="mt-3 max-w-2xl text-balance text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
        Ready to run dealership lead handling as infrastructure?
      </h2>
      <p className="mt-3 max-w-xl text-pretty text-sm text-white/80 sm:mt-4">
        In 15 minutes, we map response speed, booking flow, and follow-up gaps across your sales team.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
        <ButtonLink href="/book">Book Your Free Audit</ButtonLink>
        <ButtonLink href="/pricing" variant="ghost" className="border-white/25 bg-transparent text-white hover:bg-white/10">
          View Pricing
        </ButtonLink>
      </div>
    </section>
  );
}
