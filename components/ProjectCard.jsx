"use client";

import Link from "next/link";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import ArchitecturalGraphic, { GRAPHIC_VARIANTS } from "@/components/ArchitecturalGraphic";
import { ongoingProject } from "@/data/projects";

// Editorial project card — no photographs. A schematic line drawing stands in
// for imagery, clearly labelled as conceptual so it is never mistaken for a
// photograph or for project documentation.
export function ProjectCard({
  project,
  index,
  onToggleCompare,
  isComparing = false,
  compareDisabled = false,
}) {
  const number = String(index + 1).padStart(2, "0");
  const variant = GRAPHIC_VARIANTS[index % GRAPHIC_VARIANTS.length];
  const tone = index % 2 === 0 ? "gold" : "stone";
  const showCompare = typeof onToggleCompare === "function";
  const isOngoing = project.slug === ongoingProject.slug;
  const statusLabel = isOngoing ? "Ongoing" : "Past Record";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col border border-brand-line bg-brand-card transition-colors duration-300 hover:border-brand-gold/60"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-offset-4"
        aria-label={`View ${project.name} — ${project.locality}, ${project.city}`}
      >
        {/* drawing band */}
        <div className="blueprint-grid-fine relative flex h-48 items-center justify-center overflow-hidden border-b border-brand-line bg-brand-surface">
          <span className="absolute left-5 top-4 font-serif text-sm italic text-brand-gold/80">
            {number}
          </span>

          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 border border-brand-line bg-brand-bg/60 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-brand-secondary">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isOngoing ? "bg-brand-gold" : "bg-brand-secondary/60"
              }`}
              aria-hidden="true"
            />
            {statusLabel}
          </span>

          <div className="w-28 opacity-85 transition-transform duration-500 ease-out group-hover:scale-[1.07] sm:w-32">
            <ArchitecturalGraphic variant={variant} tone={tone} className="h-auto w-full" />
          </div>

          <span className="absolute bottom-3 left-5 text-[9px] uppercase tracking-[0.22em] text-brand-muted">
            Conceptual illustration
          </span>

          <span className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center bg-brand-gold transition-colors duration-300 group-hover:bg-brand-bronze">
            <ArrowUpRight className="h-5 w-5 text-brand-bg" aria-hidden="true" />
          </span>
        </div>

        {/* identity */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-brand-gold">
            <span>{project.nature}</span>
          </div>
          <h3 className="mt-3 font-serif text-2xl font-medium leading-snug tracking-tight text-brand-ink transition-colors duration-300 group-hover:text-brand-gold">
            {project.name}
          </h3>
          <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-brand-secondary">
            {project.locality}
            <span className="mx-2 text-brand-gold/70">/</span>
            {project.city}
          </div>
        </div>
      </Link>

      {/* action row */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-brand-line px-6 py-4 text-[11px] uppercase tracking-[0.15em]">
        <span className="text-brand-secondary">
          <span className="font-medium text-brand-ink">{project.units}</span> Units
        </span>
        <div className="flex items-center gap-3">
          {showCompare ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(project.slug);
              }}
              aria-pressed={isComparing}
              disabled={compareDisabled}
              className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                isComparing
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : compareDisabled
                  ? "cursor-not-allowed border-brand-line text-brand-secondary/40"
                  : "border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
              }`}
            >
              {isComparing ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              {isComparing ? "Comparing" : "Compare"}
            </button>
          ) : null}
          <Link
            href={`/projects/${project.slug}`}
            className="font-medium text-brand-secondary/0 transition-colors duration-300 group-hover:text-brand-gold group-focus-within:text-brand-gold"
          >
            View
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
