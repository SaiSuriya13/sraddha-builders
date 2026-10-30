"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { atlasGroups } from "@/data/insights";
import { formatNumber } from "@/lib/format";

// Region -> locality -> project relationship map. Built from the archive; the
// connecting lines are a reading aid, not geography or ownership.
export function RelationshipMap() {
  const [activeKey, setActiveKey] = useState(
    atlasGroups[0]?.localities[0]?.key || ""
  );

  const allLocalities = atlasGroups.flatMap((group) =>
    group.localities.map((locality) => ({ ...locality, groupRegion: group.region }))
  );
  const active =
    allLocalities.find((locality) => locality.key === activeKey) ||
    allLocalities[0];

  return (
    <section aria-labelledby="relationship-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Relationships</p>
          <h2
            id="relationship-heading"
            className="mt-4 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl"
          >
            Region, locality, record.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-secondary">
            Select a locality to trace the records that sit beneath it. This is
            an index of the supplied profile — localities are listed exactly as
            written, including variants.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
          {allLocalities.length} localities · 2 regions
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          {atlasGroups.map((group) => (
            <div key={group.region}>
              <div className="flex items-center justify-between gap-3 border-b border-brand-line pb-3">
                <p className="font-serif text-xl font-medium text-brand-ink">
                  {group.region}
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
                  {group.records} record{group.records === 1 ? "" : "s"} ·{" "}
                  {formatNumber(group.units)} units
                </p>
              </div>

              <ul className="mt-3">
                {group.localities.map((locality) => {
                  const selected = active?.key === locality.key;
                  return (
                    <li key={locality.key}>
                      <button
                        type="button"
                        onClick={() => setActiveKey(locality.key)}
                        aria-pressed={selected}
                        className={`group flex w-full items-center gap-3 border-l py-3 pl-4 pr-2 text-left transition-colors ${
                          selected
                            ? "border-brand-gold bg-brand-card"
                            : "border-brand-line hover:border-brand-gold/60 hover:bg-brand-card/60"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                            selected ? "bg-brand-gold" : "bg-brand-line/25"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-brand-ink">
                            {locality.locality}
                            {locality.ongoingCount > 0 ? (
                              <span className="ml-2 border border-brand-gold/40 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em] text-brand-gold">
                                ongoing
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                            {locality.city}
                          </span>
                        </span>
                        <span className="text-right text-[10px] uppercase tracking-[0.16em] text-brand-secondary">
                          {locality.count} rec · {formatNumber(locality.units)} units
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 border border-brand-line bg-brand-card p-6 sm:p-7">
            {active ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
                  Chain
                </p>
                <p className="mt-3 font-serif text-2xl font-medium leading-tight text-brand-ink">
                  {active.region}
                  <span className="mx-2 text-brand-gold">→</span>
                  {active.locality}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-brand-secondary">
                  {active.city} · {active.count} record
                  {active.count === 1 ? "" : "s"} · {formatNumber(active.units)}{" "}
                  units
                </p>

                <ul className="mt-6 space-y-3">
                  {active.projects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group flex items-center justify-between gap-3 border-b border-brand-line pb-3"
                      >
                        <span>
                          <span className="block font-serif text-lg leading-snug text-brand-ink transition-colors group-hover:text-brand-gold">
                            {project.name}
                          </span>
                          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.16em] text-brand-secondary">
                            {project.units} flats · {project.nature}
                          </span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-brand-secondary transition-colors group-hover:text-brand-gold" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/contact?project=${active.projects[0].slug}`}
                    className="btn-outline !px-4 !py-2.5 text-[10px]"
                  >
                    Enquire
                  </Link>
                  <Link
                    href={`/projects?region=${active.region}`}
                    className="inline-flex items-center gap-1.5 px-1 py-2.5 text-[10px] uppercase tracking-[0.18em] text-brand-gold transition-colors hover:text-brand-bronze"
                  >
                    Open archive
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-brand-secondary">
                No localities are available in the dataset.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
