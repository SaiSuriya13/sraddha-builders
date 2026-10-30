"use client";

import { useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { inUnitBand, unitBands } from "@/data/insights";

// "Smart Project Finder" — a lightweight guided discovery experience over the
// verified project dataset. Not an AI layer: just explicit filters built from
// fields that actually exist (region + documented unit counts).
const LOCATIONS = [
  { value: "All", label: "All Locations" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Chittoor", label: "Chittoor" },
];

const SIZES = unitBands;

export { unitBands };

function inBand(units, band) {
  return inUnitBand(units, band);
}

export function ProjectFinder({
  region,
  onRegionChange,
  unitBand,
  onUnitBandChange,
  compareSet = [],
  onToggleCompare,
}) {
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchesRegion = region === "All" || p.region === region;
        return matchesRegion && inBand(p.units, unitBand);
      }),
    [region, unitBand]
  );

  const dirty = region !== "All" || unitBand !== "any";
  const isFull = compareSet.length >= 3;

  // Stagger is capped so that even large result sets appear within ~0.3s —
  // the visitor never waits on the animation.
  const cardCount = Math.max(filtered.length, 1);
  const stagger = reduce ? 0 : Math.min(0.05, 0.3 / cardCount);

  const containerVariants = reduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.1 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren: 0.04 },
        },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      };

  const itemVariants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        },
        exit: { opacity: 0, y: 6, transition: { duration: 0.18 } },
      };

  const stepBtn = (active) =>
    `px-4 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-all duration-300 sm:px-5 ${
      active
        ? "bg-brand-gold text-brand-bg"
        : "border border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
    }`;

  return (
    <div id="project-finder">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Smart Project Finder</p>
          <h2 className="mt-5 font-serif text-3xl font-medium leading-tight tracking-tight text-brand-ink sm:text-4xl">
            Find a Project
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-secondary sm:text-base">
            Explore the project archive by location and project details.
          </p>
        </div>
        {dirty ? (
          <button
            onClick={() => {
              onRegionChange("All");
              onUnitBandChange("any");
            }}
            className="group flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-brand-gold transition-colors hover:text-brand-bronze"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
            Reset Filters
          </button>
        ) : null}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 border-t border-brand-line pt-8 lg:grid-cols-2">
        {/* Step 1 — location */}
        <div>
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-medium text-brand-gold">I</span>
            <span className="h-px w-8 bg-brand-gold/40" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-secondary">
              Where are you looking?
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {LOCATIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onRegionChange(opt.value)}
                aria-pressed={region === opt.value}
                className={stepBtn(region === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — project size */}
        <div>
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-medium text-brand-gold">II</span>
            <span className="h-px w-8 bg-brand-gold/40" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-brand-secondary">
              What would you like to explore?
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {SIZES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUnitBandChange(opt.value)}
                aria-pressed={unitBand === opt.value}
                className={stepBtn(unitBand === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-12">
        <p className="text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
          {filtered.length} project{filtered.length === 1 ? "" : "s"} found
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={containerVariants}
              className="mt-8 border border-dashed border-brand-line py-20 text-center"
            >
              <p className="font-serif text-2xl font-medium text-brand-ink">
                No projects match those choices.
              </p>
              <p className="mt-3 text-sm text-brand-secondary">
                Try a different location or unit range.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${region}-${unitBand}`}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={containerVariants}
              className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((project, i) => (
                <motion.div key={project.slug} variants={itemVariants}>
                  <ProjectCard
                    project={project}
                    index={i}
                    onToggleCompare={onToggleCompare}
                    isComparing={compareSet.includes(project.slug)}
                    compareDisabled={isFull && !compareSet.includes(project.slug)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}