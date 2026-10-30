import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";
import { ongoingProject } from "@/data/projects";

export function OngoingHighlight() {
  return (
    <section className="relative overflow-hidden bg-brand-bg text-brand-ink">
      <div className="blueprint-grid-fine pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-8xl grid-cols-1 items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
        <div className="lg:col-span-6">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gold" />
              </span>
              <p className="eyebrow">On Going Project</p>
            </div>
            <h2 className="mt-7 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {ongoingProject.name}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
              <span>{ongoingProject.locality}</span>
              <span className="h-px w-8 bg-brand-gold" />
              <span>{ongoingProject.nature}</span>
              <span className="h-px w-8 bg-brand-gold" />
              <span className="text-brand-gold">{ongoingProject.units} Flats</span>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-brand-secondary sm:text-lg">
              The firm&apos;s currently listed ongoing project — {ongoingProject.units}{" "}
              apartment flats in {ongoingProject.locality}. Enquire to learn more
              directly from Sraddha Builders.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/ongoing" className="btn-gold">
                Explore Ongoing Project
              </Link>
              <Link
                href={`/contact?project=${ongoingProject.slug}`}
                className="group flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-brand-secondary transition-colors hover:text-brand-ink"
              >
                Enquire
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={0.15}>
            <div className="relative mx-auto max-w-md">
              <span
                className="pointer-events-none absolute -right-3 -top-3 h-full w-full border border-brand-gold/30"
                aria-hidden="true"
              />
              <div className="relative border border-brand-line bg-brand-card p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-brand-line pb-3 text-[9px] uppercase tracking-[0.26em] text-brand-muted">
                  <span>Plan · Indicative</span>
                  <span className="text-brand-gold">Ongoing</span>
                </div>
                <ArchitecturalGraphic
                  variant="plan"
                  tone="stone"
                  className="mt-4 h-auto w-full opacity-90"
                />
                <div className="mt-5 flex items-center justify-between border-t border-brand-line pt-4 text-[10px] uppercase tracking-[0.24em] text-brand-secondary">
                  <span>Sri Sai Sradddha</span>
                  <span className="text-brand-gold">35 Flats</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
