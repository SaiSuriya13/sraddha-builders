"use client";

import dynamic from "next/dynamic";

function Loading({ label }) {
  return (
    <div
      className="flex min-h-[20rem] items-center justify-center border border-brand-line bg-brand-card"
      role="status"
      aria-live="polite"
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-brand-secondary">
        Preparing {label}…
      </p>
    </div>
  );
}

// Heavy interactive scenes are split out of the initial bundle and only
// downloaded on the Experience page.
const ExperienceScene = dynamic(
  () =>
    import("@/components/ExperienceScene").then((module) => module.ExperienceScene),
  { ssr: false, loading: () => <Loading label="the walkthrough" /> }
);

const RoomVisualizer = dynamic(
  () =>
    import("@/components/RoomVisualizer").then((module) => module.RoomVisualizer),
  { ssr: false, loading: () => <Loading label="the room visualiser" /> }
);

export function ExperienceLoader() {
  return (
    <div className="space-y-20 lg:space-y-28">
      <ExperienceScene />
      <RoomVisualizer />
    </div>
  );
}
