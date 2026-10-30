"use client";

import { MapPin, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { directionsUrl } from "@/data/company";

// "Get Directions" action — opens Google Maps with the verified office
// address as the destination. Styled as part of the architectural language:
// no giant blue map button, just a bordered editorial action.
// variant: "light" (ivory/cream backgrounds) | "dark" (navy/charcoal).
// small: compact sizing for footers and dense areas.
export function DirectionsButton({
  variant = "light",
  small = false,
  className = "",
}) {
  const reduce = useReducedMotion();

  const tone =
    variant === "dark"
      ? "border-brand-line text-brand-ink hover:border-brand-gold hover:text-brand-ink"
      : "border-brand-line text-brand-ink hover:border-brand-gold hover:text-brand-ink";

  const glyph =
    variant === "dark"
      ? "text-brand-gold group-hover:text-brand-bronze"
      : "text-brand-gold group-hover:text-brand-bronze";

  const iconShift = reduce ? { x: 0 } : { x: 4 };
  const arrowShift = reduce ? { x: 0 } : { x: 3 };

  return (
    <motion.a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={reduce ? undefined : "hover"}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`group inline-flex items-center gap-2.5 border font-sans font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${tone} ${
        small ? "px-4 py-2 text-[11px]" : "px-5 py-3 text-[12px]"
      } ${className}`}
      aria-label="Get directions to the Sraddha Builders office on Google Maps"
    >
      <motion.span
        variants={reduce ? {} : { hover: iconShift }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={`${glyph} transition-colors duration-300`}
      >
        <MapPin className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </motion.span>
      Get Directions
      <motion.span
        variants={reduce ? {} : { hover: arrowShift }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="text-brand-secondary transition-colors duration-300 group-hover:text-brand-gold"
      >
        <ArrowRight className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </motion.span>
    </motion.a>
  );
}