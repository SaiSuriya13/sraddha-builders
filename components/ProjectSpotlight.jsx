"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";
import { spotlightRecords } from "@/data/insights";
import { formatNumber } from "@/lib/format";

// Records of note — derived from the archive (largest, first, smallest,
// ongoing). Never editorial claims about build quality or amenities.
export function ProjectSpotlight() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const entry = spotlightRecords[index];

  function move(step) {
    setIndex(
      (current) =>
        (current + step + spotlightRecords.length) % spotlightRecords.length
    );
  }

  return (
    <section className="relative overflow-hidden bg-brand-surface text-brand-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(var(--brand-secondary)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--brand-secondary)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-8xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-20">
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow !text-brand-secondary">Records of Note</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous notable project"
                className="flex h-9 w-9 items-center justify-center border border-brand-line text-brand-ink/70 transition-colors hover:border-brand-gold hover:text-brand-ink"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next notable project"
                className="flex h-9 w-9 items-center justify-center border border-brand-line text-brand-ink/70 transition-colors hover:border-brand-gold hover:text-brand-ink"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={entry.project.slug}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0.01 : 0.35 }}
              className="mt-6"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                {entry.note}
              </p>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
                {entry.project.name}
              </h2>
              <p className="mt-3 text-[12px] uppercase tracking-[0.25em] text-brand-secondary">
                {entry.project.locality} · {entry.project.city} ·{" "}
                {entry.project.nature}
              </p>

              <div className="mt-8 flex flex-wrap items-end gap-8">
                <div>
                  <p className="font-serif text-6xl font-medium leading-none text-brand-ink">
                    {formatNumber(entry.project.units)}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-brand-secondary">
                    Documented flats
                  </p>
                </div>
                <div className="h-14 w-px bg-brand-bg/15" aria-hidden="true" />
                <div>
                  <p className="font-serif text-2xl font-medium text-brand-gold">
                    {index + 1} / {spotlightRecords.length}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-brand-secondary">
                    Record
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  href={`/projects/${entry.project.slug}`}
                  className="group inline-flex items-center gap-2 border border-brand-line px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  View record
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={`/contact?project=${entry.project.slug}`}
                  className="text-[11px] uppercase tracking-[0.2em] text-brand-secondary transition-colors hover:text-brand-gold"
                >
                  Enquire about this project
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="Notable projects">
            {spotlightRecords.map((record, i) => (
              <button
                key={record.project.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={record.project.name}
                onClick={() => setIndex(i)}
                className={`h-px transition-all duration-300 ${
                  i === index
                    ? "w-10 bg-brand-gold"
                    : "w-5 bg-brand-bg/25 hover:bg-brand-bg/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <div className="mx-auto w-56 opacity-80">
            <ArchitecturalGraphic variant="plan" tone="stone" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
