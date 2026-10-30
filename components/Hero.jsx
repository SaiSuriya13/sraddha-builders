"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";
import { company } from "@/data/company";
import { pastProjectCount, totalPastUnits } from "@/data/projects";

const ease = [0.22, 1, 0.36, 1];

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.6, delay: reduce ? 0 : delay, ease },
  });

  return (
    <section className="relative overflow-hidden bg-brand-bg">
      {/* blueprint field */}
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 72% 30%, rgba(196,164,106,0.10), transparent 65%), linear-gradient(to bottom, transparent 60%, #171918 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-screen max-w-8xl grid-cols-1 items-center gap-14 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-20 lg:pt-28">
        <div className="lg:col-span-7">
          <motion.div {...rise(0.05)} className="flex items-center gap-4">
            <span className="h-px w-10 bg-brand-gold" aria-hidden="true" />
            <p className="text-[10px] uppercase tracking-[0.38em] text-brand-gold">
              Est. {company.operatingSince} · {company.operatingLocation}
            </p>
          </motion.div>

          <h1 className="mt-8 font-serif text-[clamp(2.9rem,9vw,6.6rem)] font-medium leading-[0.94] tracking-tight text-brand-ink">
            {["Building with", "Trust Since", "1999."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: reduce ? 0.01 : 0.85,
                    delay: reduce ? 0 : 0.15 + i * 0.1,
                    ease,
                  }}
                  className={`block ${i === 1 ? "italic text-brand-gold" : ""}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...rise(0.55)}
            className="mt-9 max-w-xl text-base leading-relaxed text-brand-secondary sm:text-lg"
          >
            A partnership firm with {pastProjectCount} past project records across
            Bangalore and an ongoing apartment project in Chittoor — built on the
            names of {company.partners[0]} and {company.partners[1]}.
          </motion.p>

          <motion.div {...rise(0.7)} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/projects" className="btn-primary group">
              Explore Projects
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/contact" className="btn-outline">
              Get In Touch
            </Link>
          </motion.div>

          <motion.div
            {...rise(0.85)}
            className="mt-14 grid max-w-lg grid-cols-3 gap-px border-y border-brand-line bg-brand-line"
          >
            {[
              { value: company.operatingSince, label: "Operating Since" },
              { value: pastProjectCount, label: "Past Projects" },
              { value: totalPastUnits, label: "Listed Units" },
            ].map((item) => (
              <div key={item.label} className="bg-brand-bg px-4 py-4 first:pl-0">
                <p className="font-serif text-3xl font-medium leading-none text-brand-ink">
                  {item.value}
                </p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-brand-secondary">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative lg:col-span-5">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.9, delay: reduce ? 0 : 0.35, ease }}
            className="relative mx-auto max-w-md"
          >
            {/* offset gold hairline frame */}
            <span
              className="pointer-events-none absolute -left-3 -top-3 hidden h-full w-full border border-brand-gold/30 sm:block"
              aria-hidden="true"
            />
            <div className="relative border border-brand-line bg-brand-card p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-brand-line pb-3 text-[9px] uppercase tracking-[0.28em] text-brand-muted">
                <span>Elevation · Study 01</span>
                <span className="text-brand-gold">Conceptual</span>
              </div>
              <div className="mx-auto mt-4 w-full max-w-[19rem]">
                <ArchitecturalGraphic variant="elevation" tone="gold" className="h-auto w-full" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-brand-line pt-3 text-[9px] uppercase tracking-[0.24em] text-brand-secondary">
                <span>Indicative scale</span>
                <span className="text-brand-gold">Bangalore</span>
              </div>
            </div>
          </motion.div>
          <p className="mx-auto mt-5 max-w-xs text-center text-[11px] leading-relaxed text-brand-muted lg:text-left">
            Schematic illustrations only — the portfolio is presented as an
            editorial catalogue, never as photographs.
          </p>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex flex-col items-center gap-2 text-brand-secondary">
          <span className="text-[9px] uppercase tracking-[0.32em]">Scroll</span>
          <span className="h-10 w-px bg-brand-line">
            <span className="block h-3 w-px animate-scroll-dot bg-brand-gold" />
          </span>
        </div>
      </div>
    </section>
  );
}
