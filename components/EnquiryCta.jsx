import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ContactActions } from "@/components/ContactActions";
import { DirectionsButton } from "@/components/DirectionsButton";

// Final conversion band on the homepage.
export function EnquiryCta() {
  return (
    <section className="relative overflow-hidden border-t border-brand-line bg-brand-surface text-brand-ink">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-8xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <Reveal>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-brand-gold" aria-hidden="true" />
            <p className="eyebrow">Enquiries</p>
            <span className="h-px w-10 bg-brand-gold" aria-hidden="true" />
          </div>
          <h2 className="mx-auto mt-7 max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Interested in a Sraddha Builders <span className="italic text-brand-gold">project?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-brand-secondary">
            Send an enquiry through our contact page or reach us directly —
            we attend to every kind of assistance requested.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-gold">
              Submit an Enquiry
            </Link>
            <DirectionsButton variant="dark" />
          </div>
          <div className="mt-12 flex justify-center">
            <ContactActions size="lg" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
