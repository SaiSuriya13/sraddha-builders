import { Reveal } from "@/components/Reveal";
import { company } from "@/data/company";

export function CustomerCare() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <Reveal>
          <p className="eyebrow">Customer Care</p>
          <h2 className="mt-6 font-serif text-3xl font-medium leading-tight tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
            Our commitment, in our own words.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote className="relative mx-auto mt-10 max-w-3xl">
            <span
              aria-hidden="true"
              className="absolute -left-6 -top-8 font-serif text-7xl leading-none text-brand-gold/30"
            >
              “
            </span>
            <p className="font-serif text-2xl font-normal italic leading-relaxed text-brand-ink sm:text-3xl">
              {company.customerCareStatement}
            </p>
            <footer className="mt-8 text-[11px] uppercase tracking-[0.3em] text-brand-secondary">
              — Sraddha Builders
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}