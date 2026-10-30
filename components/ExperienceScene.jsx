"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { company } from "@/data/company";
import {
  archiveStats,
  spotlightRecords,
} from "@/data/insights";
import {
  ongoingProject,
  pastProjectCount,
  totalPastUnits,
} from "@/data/projects";
import { formatNumber } from "@/lib/format";

const CHAPTERS = [
  {
    key: "since",
    marker: "01",
    title: "Since 1999",
    kicker: "The foundation",
    body: `Sraddha Builders has operated from ${company.operatingLocation} since ${company.operatingSince}, as a ${company.constitution.toLowerCase()}.`,
    facts: [
      ["Operating since", String(company.operatingSince)],
      ["Constitution", company.constitution],
      ["Location", company.operatingLocation],
    ],
    position: { left: "16%", top: "79%" },
  },
  {
    key: "partners",
    marker: "02",
    title: "The partnership",
    kicker: "Two partners",
    body: `The firm is led by ${company.partners.join(" and ")}. Legal advisory is listed as ${company.legalAdvisor}.`,
    facts: [
      ["Partners", company.partnersCount],
      ...company.partners.map((partner) => ["Partner", partner]),
    ],
    position: { left: "50%", top: "54%" },
  },
  {
    key: "office",
    marker: "03",
    title: "The office",
    kicker: "Indiranagar, Bangalore",
    body: company.addressLines.join(" "),
    facts: [
      ["Email", company.email],
      ["Landline", company.landline],
    ],
    position: { left: "80%", top: "73%" },
  },
  {
    key: "portfolio",
    marker: "04",
    title: "The portfolio",
    kicker: "Documented records",
    body: `${pastProjectCount} past project records with ${formatNumber(
      totalPastUnits
    )} documented flats across ${archiveStats.localities} localities.`,
    facts: [
      ["Past records", String(pastProjectCount)],
      ["Past units", formatNumber(totalPastUnits)],
      ["Largest record", `${spotlightRecords[0].project.units} flats`],
    ],
    position: { left: "31%", top: "35%" },
  },
  {
    key: "ongoing",
    marker: "05",
    title: "The ongoing project",
    kicker: "Current listing",
    body: `${ongoingProject.name} — ${ongoingProject.nature}, ${ongoingProject.units} flats in ${ongoingProject.locality}, ${ongoingProject.city}.`,
    facts: [
      ["Project", ongoingProject.name],
      ["Units", String(ongoingProject.units)],
      ["Locality", ongoingProject.locality],
    ],
    position: { left: "66%", top: "20%" },
  },
];

// Interactive line-art walkthrough of the firm's supplied profile. The
// building itself is illustrative — it is not a drawing of a real project.
export function ExperienceScene() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const chapter = CHAPTERS[index];

  function move(step) {
    setIndex((current) => (current + step + CHAPTERS.length) % CHAPTERS.length);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Virtual Experience</p>
          <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl">
            Walk through the record.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-secondary">
            Five chapters drawn only from the company profile. The building is
            an illustrative line drawing, not a real project or a floor plan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous chapter"
            className="flex h-10 w-10 items-center justify-center border border-brand-line text-brand-secondary transition-colors hover:border-brand-gold hover:text-brand-ink"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next chapter"
            className="flex h-10 w-10 items-center justify-center border border-brand-line text-brand-secondary transition-colors hover:border-brand-gold hover:text-brand-ink"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-12">
        {/* Illustration */}
        <div className="relative bg-brand-surface p-4 sm:p-6 lg:col-span-7">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-lg">
            <svg
              viewBox="0 0 400 500"
              className="h-full w-full"
              fill="none"
              role="img"
              aria-label="Illustrative architectural elevation with chapter markers"
            >
              <defs>
                <pattern id="exp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" stroke="rgb(var(--brand-secondary))" strokeOpacity="0.08" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="500" fill="url(#exp-grid)" />

              {/* ground */}
              <line x1="20" y1="432" x2="380" y2="432" stroke="rgb(var(--brand-secondary))" strokeOpacity="0.6" />
              <line x1="20" y1="440" x2="380" y2="440" stroke="rgb(var(--brand-secondary))" strokeOpacity="0.25" />

              {/* main mass */}
              <rect x="84" y="122" width="232" height="310" stroke="rgb(var(--brand-secondary))" strokeOpacity="0.65" strokeWidth="1.2" />
              <rect x="104" y="96" width="192" height="26" stroke="rgb(var(--brand-gold))" strokeOpacity="0.7" strokeWidth="1" />

              {/* floor lines */}
              {[164, 206, 248, 290, 332, 374].map((y) => (
                <line key={y} x1="84" y1={y} x2="316" y2={y} stroke="rgb(var(--brand-secondary))" strokeOpacity="0.28" />
              ))}

              {/* window grid */}
              {[0, 1, 2, 3, 4].map((row) =>
                [0, 1, 2, 3].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={106 + col * 50}
                    y={176 + row * 42}
                    width="30"
                    height="22"
                    stroke="rgb(var(--brand-gold))"
                    strokeOpacity={row === 0 ? "0.55" : "0.3"}
                    strokeWidth="0.8"
                  />
                ))
              )}

              {/* entrance */}
              <rect x="178" y="392" width="44" height="40" stroke="rgb(var(--brand-gold))" strokeOpacity="0.8" />
              <line x1="200" y1="392" x2="200" y2="432" stroke="rgb(var(--brand-gold))" strokeOpacity="0.4" />

              {/* dashed continuation (ongoing) */}
              <rect
                x="84"
                y="64"
                width="232"
                height="32"
                stroke="rgb(var(--brand-gold))"
                strokeOpacity="0.5"
                strokeDasharray="4 4"
              />
              <text x="200" y="52" textAnchor="middle" fill="rgb(var(--brand-secondary))" fillOpacity="0.55" fontSize="9" letterSpacing="2">
                ILLUSTRATIVE
              </text>

              {/* connectors */}
              {CHAPTERS.map((entry, i) => {
                const x = (parseFloat(entry.position.left) / 100) * 400;
                const y = (parseFloat(entry.position.top) / 100) * 500;
                return (
                  <line
                    key={entry.key}
                    x1={200}
                    y1={250}
                    x2={x}
                    y2={y}
                    stroke={i === index ? "rgb(var(--brand-gold))" : "rgb(var(--brand-secondary))"}
                    strokeOpacity={i === index ? 0.8 : 0.12}
                    strokeWidth={i === index ? 1.2 : 0.6}
                  />
                );
              })}
            </svg>

            {CHAPTERS.map((entry, i) => {
              const active = i === index;
              return (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={active}
                  aria-label={`Chapter ${entry.marker}: ${entry.title}`}
                  className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border font-serif text-[11px] transition-all duration-300 ${
                    active
                      ? "scale-110 border-brand-gold bg-brand-gold text-brand-bg"
                      : "border-brand-line bg-brand-surface text-brand-ink/70 hover:border-brand-gold hover:text-brand-gold"
                  }`}
                  style={entry.position}
                >
                  {entry.marker}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-brand-secondary/70">
            Illustrative elevation · not a real project
          </p>
        </div>

        {/* Chapter detail */}
        <div className="flex flex-col justify-between bg-brand-bg p-6 sm:p-8 lg:col-span-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chapter.key}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0.01 : 0.3 }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold">
                {chapter.kicker}
              </p>
              <h3 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-brand-ink">
                {chapter.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-brand-secondary">
                {chapter.body}
              </p>

              <dl className="mt-7 space-y-3 border-t border-brand-line pt-5">
                {chapter.facts.map(([label, value]) => (
                  <div key={`${label}-${value}`} className="flex items-start justify-between gap-4">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                      {label}
                    </dt>
                    <dd className="max-w-[62%] text-right text-sm text-brand-ink">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8">
            <div className="flex items-center gap-2">
              {CHAPTERS.map((entry, i) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to chapter ${entry.marker}`}
                  aria-current={i === index ? "step" : undefined}
                  className={`h-px transition-all duration-300 ${
                    i === index
                      ? "w-10 bg-brand-gold"
                      : "w-5 bg-brand-line/20 hover:bg-brand-elevated"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              Chapter {index + 1} of {CHAPTERS.length} · {chapter.marker}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
