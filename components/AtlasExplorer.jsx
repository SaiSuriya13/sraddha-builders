"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { atlasGroups, atlasNote } from "@/data/insights";
import { formatNumber } from "@/lib/format";

// Schematic location atlas. Marker positions are an index layout (archive
// order), explicitly NOT latitude/longitude — the source profile contains no
// coordinates, so none are invented here.
export function AtlasExplorer() {
  const [region, setRegion] = useState(atlasGroups[0]?.region || "Bangalore");
  const group = useMemo(
    () => atlasGroups.find((entry) => entry.region === region) || atlasGroups[0],
    [region]
  );
  const [activeKey, setActiveKey] = useState(group?.localities[0]?.key || "");

  const active =
    group?.localities.find((locality) => locality.key === activeKey) ||
    group?.localities[0];

  function selectRegion(next) {
    setRegion(next);
    const nextGroup = atlasGroups.find((entry) => entry.region === next);
    setActiveKey(nextGroup?.localities[0]?.key || "");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {atlasGroups.map((entry) => (
            <button
              key={entry.region}
              type="button"
              onClick={() => selectRegion(entry.region)}
              aria-pressed={entry.region === region}
              className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                entry.region === region
                  ? "bg-brand-gold text-brand-bg"
                  : "border border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
              }`}
            >
              {entry.region}
              <span className="ml-2 text-[10px] opacity-60">
                {entry.records}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
          {group?.records} records · {formatNumber(group?.units || 0)} units
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Schematic panel */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full overflow-hidden border border-brand-line bg-brand-card">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(var(--brand-secondary) / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--brand-secondary) / 0.08) 1px, transparent 1px)",
                backgroundSize: "10% 10%",
              }}
              aria-hidden="true"
            />

            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {group?.localities.map((locality) => (
                <line
                  key={locality.key}
                  x1="50"
                  y1="50"
                  x2={locality.x}
                  y2={locality.y}
                  stroke={active?.key === locality.key ? "rgb(var(--brand-gold))" : "rgb(var(--brand-secondary) / 0.5)"}
                  strokeWidth="0.25"
                />
              ))}
              <circle cx="50" cy="50" r="0.8" fill="rgb(var(--brand-gold))" />
              <circle
                cx="50"
                cy="50"
                r="9"
                fill="none"
                stroke="rgb(var(--brand-gold))"
                strokeWidth="0.2"
                strokeDasharray="1 1.4"
              />
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[9px] uppercase tracking-[0.25em] text-brand-secondary">
                Schematic
              </p>
              <p className="font-serif text-lg font-medium text-brand-ink">
                {group?.region}
              </p>
            </div>

            {group?.localities.map((locality) => {
              const selected = active?.key === locality.key;
              return (
                <button
                  key={locality.key}
                  type="button"
                  onClick={() => setActiveKey(locality.key)}
                  aria-pressed={selected}
                  aria-label={`${locality.locality}, ${locality.city}: ${locality.count} records`}
                  title={`${locality.locality} — ${locality.count} records`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
                  style={{ left: `${locality.x}%`, top: `${locality.y}%` }}
                >
                  <span
                    className={`flex items-center justify-center border font-serif text-[11px] leading-none transition-all duration-300 ${
                      selected
                        ? "h-9 w-9 border-brand-gold bg-brand-gold text-brand-bg shadow-[0_8px_24px_-8px_rgba(165,138,90,0.8)]"
                        : "h-7 w-7 border-brand-line bg-brand-bg text-brand-ink group-hover:border-brand-gold group-hover:text-brand-gold"
                    }`}
                  >
                    {locality.count}
                  </span>
                  <span
                    className={`absolute left-1/2 top-full mt-1 w-max max-w-[9rem] -translate-x-1/2 truncate px-1 text-center text-[9px] uppercase tracking-[0.12em] transition-opacity ${
                      selected
                        ? "text-brand-ink opacity-100"
                        : "text-brand-secondary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    {locality.locality}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-brand-secondary/70">
            {atlasNote}
          </p>
        </div>

        {/* Locality index + detail */}
        <div className="lg:col-span-5">
          <div className="border border-brand-line">
            <div className="max-h-64 overflow-y-auto border-b border-brand-line">
              {group?.localities.map((locality) => {
                const selected = active?.key === locality.key;
                return (
                  <button
                    key={locality.key}
                    type="button"
                    onClick={() => setActiveKey(locality.key)}
                    aria-pressed={selected}
                    className={`flex w-full items-center justify-between gap-3 border-b border-brand-line px-4 py-2.5 text-left transition-colors last:border-b-0 ${
                      selected
                        ? "bg-brand-card text-brand-ink"
                        : "text-brand-secondary hover:bg-brand-card/60 hover:text-brand-ink"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <MapPin
                        className={`h-3.5 w-3.5 flex-shrink-0 ${
                          selected ? "text-brand-gold" : "text-brand-secondary/50"
                        }`}
                      />
                      <span className="truncate text-sm">{locality.locality}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em]">
                      {locality.count} · {formatNumber(locality.units)} units
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-brand-card p-5">
              {active ? (
                <>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
                    {active.region} · {active.city}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-brand-ink">
                    {active.locality}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
                    {active.count} record{active.count === 1 ? "" : "s"} ·{" "}
                    {formatNumber(active.units)} units
                    {active.ongoingCount > 0 ? " · includes ongoing" : ""}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {active.projects.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="group flex items-center justify-between gap-2 border-b border-brand-line pb-2 text-sm text-brand-ink"
                        >
                          <span className="min-w-0 truncate transition-colors group-hover:text-brand-gold">
                            {project.name}
                          </span>
                          <span className="flex flex-shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-brand-secondary">
                            {project.units} flats
                            <ArrowUpRight className="h-3.5 w-3.5 group-hover:text-brand-gold" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/projects?region=${active.region}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-brand-gold transition-colors hover:text-brand-bronze"
                  >
                    View {active.region} archive
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              ) : (
                <p className="text-sm text-brand-secondary">
                  This region has no locality records.
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-brand-secondary/80">
            Marker numbers show how many archive records sit at that locality.
            Distances between markers carry no meaning.
          </p>
        </div>
      </div>
    </div>
  );
}
