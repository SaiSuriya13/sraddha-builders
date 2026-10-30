"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, MapPin, SquareStack } from "lucide-react";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";
import { allProjects } from "@/data/projects";

// Project detail page — typography-led, no photographs. Only the metadata that
// exists in the source is displayed.
export function ProjectDetailContent({ project, isOngoing = false }) {
  const shimmer = String(project.units).padStart(3, "0");

  return (
    <main className="bg-brand-bg">
      <div className="mx-auto max-w-8xl px-5 pt-28 sm:px-8 lg:pt-36 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-brand-secondary transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* left: identity */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="eyebrow"
            >
              {isOngoing ? "On Going Project" : "Project"}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl"
            >
              {project.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] uppercase tracking-[0.2em] text-brand-secondary"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-gold" />
                {project.locality}, {project.city}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 grid grid-cols-2 gap-6 border-y border-brand-line py-8 sm:grid-cols-2"
            >
              <InfoBlock icon={<Building2 className="h-5 w-5" />} label="Nature of Project" value={project.nature} />
              <InfoBlock icon={<SquareStack className="h-5 w-5" />} label="No. of Units" value={`${project.units} Flats`} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link href={`/contact?project=${project.slug}`} className="btn-primary">
                Enquire About This Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 max-w-md text-xs leading-relaxed text-brand-secondary/80"
            >
              Only the information listed in the company&apos;s supplied profile
              is shown here. Please contact Sraddha Builders directly for further
              details.
            </motion.p>
          </div>

          {/* right: schematic visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative border border-brand-line bg-brand-card p-6">
              <div className="absolute left-4 top-3 text-[11px] uppercase tracking-[0.3em] text-brand-gold">
                {isOngoing ? "OG-01" : "P-" + shimmer}
              </div>
              <ArchitecturalGraphic variant="tower" className="h-auto w-full" />
              <div className="mt-5 flex items-center justify-between border-t border-brand-line pt-4 text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
                <span>{project.region}</span>
                <span className="text-brand-gold">{project.units} Flats</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* full project index */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 pb-20 lg:mt-32"
        >
          <p className="eyebrow">Project Index</p>
          <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-brand-ink lg:text-4xl">
            Every project we have listed
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-brand-line bg-brand-line sm:grid-cols-2">
            {allProjects.map((p) => {
              const active = p.slug === project.slug;
              return (
                <li
                  key={p.slug}
                  className={`bg-brand-bg ${active ? "bg-brand-card" : ""}`}
                >
                  <Link
                    href={`/projects/${p.slug}`}
                    className={`group flex items-baseline justify-between gap-4 px-5 py-3.5 text-sm transition-colors ${
                      active ? "text-brand-gold" : "text-brand-secondary hover:text-brand-ink"
                    }`}
                  >
                    <span className={active ? "font-medium uppercase tracking-[0.15em] text-brand-gold" : "uppercase tracking-[0.15em]"}>
                      {p.name}
                    </span>
                    <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.15em] opacity-70">
                      {p.locality}, {p.city}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.section>
      </div>
    </main>
  );
}

function InfoBlock({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-brand-gold">{icon}</div>
      <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
        {label}
      </div>
      <div className="mt-1 font-serif text-3xl font-medium tracking-tight text-brand-ink">
        {value}
      </div>
    </div>
  );
}