"use client";

import { motion } from "framer-motion";

// Lightweight section reveal wrapper. Subtle by design.
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  as: Tag = "div",
}) {
  const MotionTag = motion(Tag);
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}