import { Reveal } from "@/components/Reveal";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";
import { pastProjectCount, totalPastUnits } from "@/data/projects";

// Legacy / experience editorial statement — a dark architectural band.
export function LegacySection() {
  return (
    <section className="relative overflow-hidden border-y border-brand-line bg-brand-surface text-brand-ink">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 85% 50%, rgba(196,164,106,0.09), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-8xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-brand-gold" aria-hidden="true" />
                <p className="eyebrow">A Quarter-Century of Building</p>
              </div>
              <h2 className="mt-7 font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Trust is not claimed.
                <br />
                <span className="italic text-brand-gold">It is documented.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
                Every apartment project Sraddha Builders has completed — every
                locality, every unit count — is listed in an open archive. The
                record speaks for itself:
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-12 grid max-w-xl grid-cols-2 gap-8 border-t border-brand-line pt-10">
                <div>
                  <div className="font-serif text-5xl font-medium text-brand-gold lg:text-6xl">
                    {pastProjectCount}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-brand-secondary">
                    Past project records
                  </div>
                </div>
                <div>
                  <div className="font-serif text-5xl font-medium text-brand-gold lg:text-6xl">
                    {totalPastUnits.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-brand-secondary">
                    Units across past records
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="relative mx-auto max-w-sm">
                <span
                  className="pointer-events-none absolute -left-3 -top-3 h-full w-full border border-brand-gold/25"
                  aria-hidden="true"
                />
                <div className="relative border border-brand-line bg-brand-card/60 p-6">
                  <ArchitecturalGraphic variant="skyline" tone="stone" className="h-auto w-full opacity-90" />
                  <p className="mt-5 border-t border-brand-line pt-3 text-[9px] uppercase tracking-[0.26em] text-brand-muted">
                    Conceptual skyline study
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
