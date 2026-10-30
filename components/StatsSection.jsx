"use client";

import { useRef, useState, useEffect } from "react";
import { useInView, useReducedMotion, motion } from "framer-motion";
import {
  pastProjectCount,
  totalPastUnits,
  ongoingUnitCount,
  totalUnitsIncludingOngoing,
  allProjects,
  projects,
} from "@/data/projects";
import { company } from "@/data/company";

// Animated statistic that counts 0 -> target once when the section enters the
// viewport. Reduced-motion users get the final value immediately. Numbers are
// always derived from the project dataset — never hardcoded separately.
function Stat({
  target,
  label,
  note,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(target);
      return;
    }
    let raf;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  const shown = display.toLocaleString("en-IN");
  const final = target.toLocaleString("en-IN");

  return (
    <div className="group relative flex h-full flex-col justify-between overflow-hidden bg-brand-card p-6 transition-colors duration-300 hover:bg-brand-elevated sm:p-8">
      <span
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-gold transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden="true"
      />
      <div>
        <div
          ref={ref}
          aria-label={`${label}: ${final}`}
          className="font-serif text-5xl font-medium tracking-tight text-brand-gold lg:text-6xl"
        >
          <span aria-hidden="true">{shown}</span>
        </div>
        <motion.div
          aria-hidden="true"
          initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          animate={reduce ? { scaleX: 1 } : inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{ transformOrigin: "left" }}
          className="mt-5 h-px w-16 bg-brand-line"
        />
        <div className="mt-5 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-secondary">
          {label}
        </div>
        <div className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-brand-muted">{note}</div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const ongoingProjectCount = allProjects.length - projects.length;

  return (
    <section className="border-y border-brand-line bg-brand-card">
      <div className="mx-auto max-w-8xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid grid-cols-2 gap-px border border-brand-line bg-brand-line lg:grid-cols-3">
          <Stat target={company.operatingSince} label="Operating Since" note="Source" />
          <Stat target={pastProjectCount} label="Past Project Records" note="Source" />
          <Stat target={ongoingProjectCount} label="Ongoing Project" note="Source" />
          <Stat target={totalPastUnits} label="Listed Past Units" note="Calculated from records" />
          <Stat target={ongoingUnitCount} label="Ongoing Units · Sri Sai Sradddha" note="Source" />
          <Stat target={totalUnitsIncludingOngoing} label="Listed Past + Ongoing Units" note="Calculated from records" />
        </div>
        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-brand-secondary/70">
          Values marked “calculated” are derived programmatically from the
          company&apos;s supplied project records.
        </p>
      </div>
    </section>
  );
}