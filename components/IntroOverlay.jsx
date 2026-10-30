"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STORAGE_KEY = "sb_intro_v2";

// Architectural elevation, drawn once. The drawing is purely schematic — it is
// an identity graphic, not a representation of any completed project.
const DRAW = [
  // ground + site
  { d: "M40 366 H680", gold: true, w: 1.6, delay: 0 },
  { d: "M80 366 V386 M640 366 V386", gold: false, w: 1, delay: 0.35 },
  // main mass
  { d: "M188 366 V120 H532 V366", gold: true, w: 1.8, delay: 0.1 },
  { d: "M188 120 H532", gold: true, w: 1.8, delay: 0.25 },
  { d: "M204 104 H516", gold: false, w: 1, delay: 0.4 },
  { d: "M204 104 V120 M516 104 V120", gold: false, w: 1, delay: 0.4 },
  // cornice + parapet
  { d: "M170 366 H208 M512 366 H550", gold: false, w: 1.2, delay: 0.5 },
  // side wings
  { d: "M120 366 V206 H188 M532 366 V206 H600", gold: false, w: 1.3, delay: 0.55 },
  { d: "M120 206 H188 M532 206 H600", gold: false, w: 1.3, delay: 0.6 },
  // arcade columns
  { d: "M232 366 V268 M296 366 V268 M360 366 V268 M424 366 V268 M488 366 V268", gold: false, w: 1.1, delay: 0.7 },
  { d: "M216 268 H504", gold: false, w: 1, delay: 0.8 },
  // arched openings
  { d: "M240 366 V318 A24 24 0 0 1 288 318 V366", gold: true, w: 1.2, delay: 0.85 },
  { d: "M304 366 V318 A24 24 0 0 1 352 318 V366", gold: true, w: 1.2, delay: 0.9 },
  { d: "M368 366 V318 A24 24 0 0 1 416 318 V366", gold: true, w: 1.2, delay: 0.95 },
  { d: "M432 366 V318 A24 24 0 0 1 480 318 V366", gold: true, w: 1.2, delay: 1 },
  // upper window grid
  { d: "M214 148 H272 V196 H214 Z M288 148 H346 V196 H288 Z M362 148 H420 V196 H362 Z M436 148 H494 V196 H436 Z", gold: false, w: 1, delay: 1.05 },
  { d: "M243 148 V196 M317 148 V196 M391 148 V196 M465 148 V196", gold: false, w: 0.8, delay: 1.15 },
  // wing windows
  { d: "M136 232 H172 V286 H136 Z M548 232 H584 V286 H548 Z", gold: false, w: 1, delay: 1.2 },
  { d: "M120 300 H188 M532 300 H600", gold: false, w: 1, delay: 1.25 },
  // dimension line
  { d: "M164 120 V366", gold: false, w: 1, delay: 1.3 },
  { d: "M156 120 H172 M156 366 H172", gold: false, w: 1, delay: 1.35 },
  // centre axis + registration marks
  { d: "M360 66 V104", gold: true, w: 1, delay: 1.4 },
  { d: "M352 66 H368 M356 74 H364", gold: false, w: 0.9, delay: 1.45 },
  { d: "M56 90 H86 M56 90 V120", gold: false, w: 0.9, delay: 1.5 },
  { d: "M664 90 H634 M664 90 V120", gold: false, w: 0.9, delay: 1.5 },
];

function IntroDrawing({ reduce }) {
  return (
    <svg
      viewBox="0 0 720 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-label="Schematic architectural elevation drawing of an apartment building"
    >
      {/* faint construction grid behind the elevation */}
      <g opacity="0.5">
        {[120, 200, 280, 360, 440, 520, 600].map((x) => (
          <line
            key={`v${x}`}
            x1={x}
            y1="40"
            x2={x}
            y2="400"
            stroke="rgb(var(--brand-secondary))"
            strokeOpacity="0.1"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        ))}
        {[120, 200, 280, 360].map((y) => (
          <line
            key={`h${y}`}
            x1="40"
            y1={y}
            x2="680"
            y2={y}
            stroke="rgb(var(--brand-secondary))"
            strokeOpacity="0.1"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        ))}
      </g>

      {DRAW.map((line, i) => (
        <path
          key={i}
          d={line.d}
          pathLength="1"
          stroke={
            line.gold
              ? "rgb(var(--brand-gold))"
              : "rgb(var(--brand-secondary))"
          }
          strokeOpacity={line.gold ? 0.9 : 0.55}
          strokeWidth={line.w}
          strokeLinecap="square"
          className={reduce ? "sb-drawn" : "sb-draw"}
          style={reduce ? undefined : { animationDelay: `${line.delay}s` }}
        />
      ))}
    </svg>
  );
}

// Full-screen welcome. It is server-rendered on first paint and stays on screen
// indefinitely — no timeout, no animation-completion callback and no Escape
// handler ever dismisses it. Only an explicit "Enter Website" activation does.
export function IntroOverlay() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const dismissedRef = useRef(false);
  const buttonRef = useRef(null);

  const enter = useCallback(() => {
    if (dismissedRef.current) return; // guards double clicks / double activation
    dismissedRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage can be unavailable in private modes — still allow entry */
    }
    document.documentElement.classList.add("sb-intro-seen");
    setVisible(false);
  }, []);

  // Returning visitors in the same session skip the intro. The inline script in
  // the document head has already hidden it before first paint, so this only
  // reconciles React state without playing an exit animation.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      dismissedRef.current = true;
      setVisible(false);
      setReady(true);
      return undefined;
    }

    setReady(true);
    const focusTimer = window.setTimeout(() => {
      buttonRef.current?.focus({ preventScroll: true });
    }, reduce ? 40 : 750);
    return () => window.clearTimeout(focusTimer);
  }, [reduce]);

  // Lock page scrolling while the intro is on screen.
  useEffect(() => {
    if (!visible) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  const fade = reduce ? 0.01 : 0.5;

  return (
    <>
      <noscript>
        <style>{`.sb-intro{display:none!important}`}</style>
      </noscript>
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fade, ease: "easeInOut" }}
            className="sb-intro fixed inset-0 z-[100] overflow-y-auto bg-brand-bg text-brand-ink"
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-title"
            aria-describedby="intro-description"
          >
            {/* blueprint field */}
            <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <div className="blueprint-grid-fine pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(196,164,106,0.10), transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* corner registration marks */}
            <span className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t border-brand-line sm:left-8 sm:top-8" aria-hidden="true" />
            <span className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r border-t border-brand-line sm:right-8 sm:top-8" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b border-l border-brand-line sm:bottom-8 sm:left-8" aria-hidden="true" />
            <span className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r border-brand-line sm:bottom-8 sm:right-8" aria-hidden="true" />

            <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center sm:px-10 lg:py-20">
              <motion.p
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.01 : 0.5, delay: reduce ? 0 : 0.1 }}
                className="text-[10px] uppercase tracking-[0.42em] text-brand-secondary"
              >
                Established 1999 · Bangalore
              </motion.p>

              {/* A4-ish drawing plate */}
              <motion.div
                initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduce ? 0.01 : 0.7, delay: reduce ? 0 : 0.15 }}
                className="relative mt-8 w-full max-w-2xl border border-brand-line bg-brand-surface/60 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between border-b border-brand-line pb-3 text-[9px] uppercase tracking-[0.28em] text-brand-muted">
                  <span>Elevation · Sheet 01</span>
                  <span className="text-brand-gold">Conceptual</span>
                </div>
                <div className="mx-auto mt-3 h-44 w-full sm:h-56 lg:h-64">
                  <IntroDrawing reduce={reduce} />
                </div>
                <div className="flex items-center justify-between border-t border-brand-line pt-3 text-[9px] uppercase tracking-[0.24em] text-brand-muted">
                  <span>Scale — indicative</span>
                  <span>Not a project photograph</span>
                </div>
              </motion.div>

              <motion.h1
                id="intro-title"
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.01 : 0.6, delay: reduce ? 0 : 0.35 }}
                className="mt-9 font-serif text-4xl font-medium leading-none tracking-tight text-brand-ink sm:text-6xl lg:text-7xl"
              >
                SRADDHA <span className="italic text-brand-gold">Builders</span>
              </motion.h1>

              <motion.p
                id="intro-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0.01 : 0.6, delay: reduce ? 0 : 0.5 }}
                className="mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-brand-secondary sm:text-xl"
              >
                Thoughtfully building spaces for living.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0.01 : 0.6, delay: reduce ? 0 : 0.6 }}
                className="mt-4 max-w-md text-[11px] leading-relaxed text-brand-muted sm:text-xs"
              >
                A Bangalore partnership firm with a documented portfolio of
                apartment projects across Bangalore and Chittoor.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.01 : 0.5, delay: reduce ? 0 : 0.7 }}
                className="mt-10"
              >
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={enter}
                  disabled={!ready}
                  className="group inline-flex items-center gap-4 border border-brand-gold bg-transparent px-8 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-bg focus-visible:bg-brand-gold focus-visible:text-brand-bg disabled:opacity-70 sm:px-10 sm:text-[12px]"
                >
                  Enter Website
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
                <p className="mt-4 text-[9px] uppercase tracking-[0.28em] text-brand-muted">
                  Click to continue
                </p>
              </motion.div>

              <div className="mt-12 flex w-full max-w-2xl items-center gap-4 text-[9px] uppercase tracking-[0.28em] text-brand-muted">
                <span className="h-px flex-1 bg-brand-line" />
                <span>Bangalore</span>
                <span className="text-brand-gold">/</span>
                <span>Chittoor</span>
                <span className="h-px flex-1 bg-brand-line" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
