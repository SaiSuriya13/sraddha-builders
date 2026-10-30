"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Columns3 } from "lucide-react";

// Sticky comparison tray — appears once at least one project is selected.
// Elegant and minimal; visitor-session only (React state, no database).
export function ComparisonTray({ projects, onRemove, onClear, onOpen }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {projects.length > 0 ? (
        <motion.div
          key="compare-tray"
          initial={reduce ? { opacity: 0 } : { y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 64, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-gold/30 bg-brand-surface text-brand-ink"
        >
          <div className="mx-auto flex max-w-8xl flex-col gap-3 px-5 py-4 sm:px-8 sm:flex-row sm:items-center lg:px-12">
            <div className="flex items-center gap-2.5 sm:w-auto sm:flex-shrink-0 sm:pr-4 sm:border-r sm:border-brand-line">
              <Columns3 className="h-4 w-4 text-brand-gold" />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-brand-ink">
                Compare Projects
              </span>
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-2">
              <AnimatePresence initial={false}>
                {projects.map((p) => (
                  <motion.span
                    key={p.slug}
                    layout
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center gap-2 border border-brand-line bg-brand-bg/5 py-1 pl-3 pr-1.5 text-[12px] text-brand-ink"
                  >
                    <span className="font-serif font-medium">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(p.slug)}
                      aria-label={`Remove ${p.name} from comparison`}
                      className="flex h-5 w-5 items-center justify-center text-brand-secondary transition-colors hover:text-brand-gold"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              {projects.length < 3 ? (
                <span className="text-[11px] uppercase tracking-[0.15em] text-brand-secondary/70">
                  + Add project
                </span>
              ) : null}
            </div>

            <div className="flex flex-shrink-0 items-center gap-2.5">
              <button
                type="button"
                onClick={onOpen}
                disabled={projects.length === 0}
                className="inline-flex items-center gap-2 bg-brand-gold px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-bg transition-colors duration-300 hover:bg-brand-bronze"
              >
                Compare
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center border border-brand-line px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-ink transition-colors duration-300 hover:border-brand-gold hover:text-brand-gold"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}