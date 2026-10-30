"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { company } from "@/data/company";

// Editorial comparison for up to three projects. Only verified fields from the
// dataset are compared. Desktop shows a clean table; mobile stacks per-project
// cards so nothing is lost to horizontal overflow.
const ROWS = [
  { key: "name", label: "Project Name", get: (p) => p.name },
  { key: "locality", label: "Locality", get: (p) => p.locality },
  { key: "city", label: "City", get: (p) => p.city },
  { key: "nature", label: "Nature", get: (p) => p.nature },
  { key: "units", label: "Units", get: (p) => `${p.units} Flats` },
];

export function ComparisonModal({ open, projects, onClose }) {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const backdrop = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.25 } },
      };

  const panel = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0,
          y: 32,
          transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <AnimatePresence>
      {open && projects.length > 0 ? (
        <motion.div
          key="compare-modal"
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-8"
        >
          <motion.button
            type="button"
            aria-label="Close comparison"
            variants={backdrop}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-brand-surface/75"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-modal-title"
            variants={panel}
            className="relative max-h-[88vh] w-full overflow-y-auto border border-brand-line bg-brand-bg text-brand-ink outline-none sm:max-w-4xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-line bg-brand-bg px-6 py-5 sm:px-8">
              <div>
                <p className="eyebrow">Side by side</p>
                <h2
                  id="compare-modal-title"
                  className="mt-2 font-serif text-2xl font-medium tracking-tight"
                >
                  Compare Projects
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close comparison"
                className="flex h-10 w-10 items-center justify-center border border-brand-line text-brand-secondary transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              {/* Desktop table */}
              <table className="hidden w-full border-collapse text-left md:table">
                <thead>
                  <tr className="border-b-2 border-brand-line">
                    <th className="py-4 pr-4 text-[11px] font-medium uppercase tracking-[0.25em] text-brand-secondary">
                      Field
                    </th>
                    {projects.map((p, i) => (
                      <th key={p.slug} className="w-1/3 py-4 pr-4">
                        <motion.span
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.1 + i * 0.06,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="block font-serif text-xl font-medium leading-snug"
                        >
                          {p.name}
                        </motion.span>
                        <span className="mt-1 block text-[11px] uppercase tracking-[0.15em] text-brand-secondary/70">
                          #{String(i + 1)}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) =>
                    row.key === "name" ? null : (
                      <tr
                        key={row.key}
                        className="border-b border-brand-line last:border-b-0"
                      >
                        <td className="py-4 pr-4 text-[11px] font-medium uppercase tracking-[0.25em] text-brand-secondary">
                          {row.label}
                        </td>
                        {projects.map((p) => (
                          <td
                            key={p.slug}
                            className={`py-4 pr-4 text-sm ${
                              row.key === "units"
                                ? "font-serif text-lg font-medium text-brand-gold"
                                : "text-brand-ink"
                            }`}
                          >
                            {row.get(p)}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {/* Mobile stacked cards */}
              <div className="grid grid-cols-1 gap-5 md:hidden">
                {projects.map((p, i) => (
                  <div key={p.slug} className="border border-brand-line">
                    <div className="flex items-center justify-between gap-3 border-b border-brand-line bg-brand-surface px-5 py-4 text-brand-ink">
                      <span className="font-serif text-xl font-medium leading-snug">
                        {p.name}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-brand-secondary">
                        #{String(i + 1)}
                      </span>
                    </div>
                    <dl className="divide-y divide-brand-line">
                      {ROWS.map((row) =>
                        row.key === "name" ? null : (
                          <div
                            key={row.key}
                            className="flex items-center justify-between gap-4 px-5 py-3.5"
                          >
                            <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-secondary">
                              {row.label}
                            </dt>
                            <dd
                              className={`text-right text-sm ${
                                row.key === "units"
                                  ? "font-serif text-base font-medium text-brand-gold"
                                  : "text-brand-ink"
                              }`}
                            >
                              {row.get(p)}
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                ))}
              </div>

              <p className="mt-8 border-t border-brand-line pt-5 text-[11px] leading-relaxed text-brand-secondary/70">
                Comparison is based only on documented details from the
                {company.name.toLowerCase()} profile. Unit counts and localities
                are listed as provided.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}