"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  archiveStats,
  bucketStats,
  groupByLocality,
  pastRegionStats,
} from "@/data/insights";
import {
  ongoingProject,
  pastProjectCount,
  projects,
  totalPastUnits,
  totalUnitsIncludingOngoing,
} from "@/data/projects";
import { formatNumber } from "@/lib/format";

const REGION_TONES = {
  Bangalore: "rgb(var(--brand-gold))",
  Chittoor: "rgb(var(--brand-secondary))",
};

function Metric({ value, label, note }) {
  return (
    <div className="bg-brand-card p-5 sm:p-6">
      <p className="font-serif text-4xl font-medium leading-none text-brand-ink sm:text-5xl">
        {value}
      </p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-brand-gold">
        {label}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-brand-secondary">
        {note}
      </p>
    </div>
  );
}

// Dashboard of calculations over the verified archive. No chart library, no
// invented values: bars and segments are scaled from the dataset.
export function InsightsDashboard() {
  const reduce = useReducedMotion();
  const buckets = bucketStats(projects);
  const maxBucketCount = Math.max(...buckets.map((b) => b.count), 1);
  const localities = groupByLocality(projects);
  const topLocalities = localities.slice(0, 8);
  const maxLocalityCount = Math.max(...topLocalities.map((l) => l.count), 1);
  const pastTotal = totalPastUnits || 1;

  const regions = pastRegionStats.map((region) => ({
    ...region,
    share: region.count / pastProjectCount,
  }));

  const donutRadius = 62;
  const circumference = 2 * Math.PI * donutRadius;
  let offset = 0;
  const segments = regions.map((region) => {
    const length = region.share * circumference;
    const segment = { ...region, length, offset };
    offset += length;
    return segment;
  });

  return (
    <div className="space-y-16">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-px border border-brand-line bg-brand-line lg:grid-cols-4">
        <Metric
          value={formatNumber(pastProjectCount)}
          label="Past records"
          note="Source: supplied company profile"
        />
        <Metric
          value={formatNumber(totalPastUnits)}
          label="Past units"
          note="Calculated by summing record unit counts"
        />
        <Metric
          value={formatNumber(archiveStats.localities)}
          label="Documented localities"
          note="Spellings preserved as supplied"
        />
        <Metric
          value={formatNumber(totalUnitsIncludingOngoing)}
          label="Units including ongoing"
          note={`${formatNumber(totalPastUnits)} past + ${ongoingProject.units} ongoing`}
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Distribution */}
        <section className="lg:col-span-7" aria-labelledby="unit-distribution">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Scale Profile</p>
              <h2
                id="unit-distribution"
                className="mt-4 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl"
              >
                How large are the records?
              </h2>
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
              Past records only
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {buckets.map((bucket, index) => {
              const width = `${Math.round((bucket.count / maxBucketCount) * 100)}%`;
              return (
                <div key={bucket.key}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink">
                      {bucket.label} flats
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-brand-secondary">
                      {bucket.count} record{bucket.count === 1 ? "" : "s"} ·{" "}
                      <span className="text-brand-gold">
                        {formatNumber(bucket.units)}
                      </span>{" "}
                      units
                    </p>
                  </div>
                  <div className="mt-2 h-2.5 w-full bg-brand-elevated/60" aria-hidden="true">
                    <motion.div
                      initial={reduce ? false : { width: 0 }}
                      whileInView={{ width }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.8,
                        delay: reduce ? 0 : index * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full bg-brand-gold"
                      style={reduce ? { width } : undefined}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px border border-brand-line bg-brand-line sm:grid-cols-4">
            {[
              ["Smallest", archiveStats.smallest],
              ["Median", archiveStats.median],
              ["Mean", archiveStats.mean],
              ["Largest", archiveStats.largest],
            ].map(([label, value]) => (
              <div key={label} className="bg-brand-bg p-4">
                <dt className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
                  {label}
                </dt>
                <dd className="mt-1 font-serif text-2xl font-medium text-brand-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[11px] leading-relaxed text-brand-secondary/80">
            Unit statistics describe the number of flats per record. They do not
            describe bedroom configurations, which are not part of the source.
          </p>
        </section>

        {/* Region split */}
        <section className="lg:col-span-5" aria-labelledby="region-split">
          <p className="eyebrow">Geographic Split</p>
          <h2
            id="region-split"
            className="mt-4 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl"
          >
            Two regions on record.
          </h2>

          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
            <div className="relative h-44 w-44 flex-shrink-0">
              <svg viewBox="0 0 160 160" className="h-full w-full" role="img" aria-label="Share of past records by region">
                <circle
                  cx="80"
                  cy="80"
                  r={donutRadius}
                  fill="none"
                  stroke="rgb(var(--brand-line))"
                  strokeWidth="16"
                />
                {segments.map((segment) => (
                  <circle
                    key={segment.region}
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="none"
                    stroke={REGION_TONES[segment.region] || "rgb(var(--brand-gold))"}
                    strokeWidth="16"
                    strokeDasharray={`${segment.length} ${circumference}`}
                    strokeDashoffset={-segment.offset}
                    transform="rotate(-90 80 80)"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-3xl font-medium text-brand-ink">
                  {pastProjectCount}
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-brand-secondary">
                  records
                </span>
              </div>
            </div>

            <ul className="w-full space-y-4">
              {regions.map((region) => (
                <li key={region.region}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brand-ink">
                      <span
                        className="h-2.5 w-2.5"
                        style={{
                          backgroundColor:
                            REGION_TONES[region.region] || "rgb(var(--brand-gold))",
                        }}
                        aria-hidden="true"
                      />
                      {region.region}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-brand-secondary">
                      {region.count} · {formatNumber(region.units)} units
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-brand-secondary/80">
                    {Math.round(region.share * 100)}% of past records
                  </p>
                </li>
              ))}
              <li className="border-t border-brand-line pt-3 text-[11px] leading-relaxed text-brand-secondary">
                Ongoing: {ongoingProject.name} · {ongoingProject.locality} ·{" "}
                {ongoingProject.units} flats
              </li>
            </ul>
          </div>

          <p className="mt-6 text-[11px] leading-relaxed text-brand-secondary/80">
            Region is derived from the city column in the source profile.
            &ldquo;B&apos;lore&rdquo; and &ldquo;Bangalore&rdquo; entries both
            resolve to the Bangalore region.
          </p>
        </section>
      </div>

      {/* Localities */}
      <section aria-labelledby="locality-concentration">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Concentration</p>
            <h2
              id="locality-concentration"
              className="mt-4 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl"
            >
              Where the records cluster.
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
            Top {topLocalities.length} of {localities.length} localities
          </p>
        </div>

        <div className="mt-8 grid gap-x-12 gap-y-5 sm:grid-cols-2">
          {topLocalities.map((group, index) => {
            const width = `${Math.max(
              6,
              Math.round((group.count / maxLocalityCount) * 100)
            )}%`;
            return (
              <div key={group.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-brand-ink">
                    {group.locality}
                    <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                      {group.city}
                    </span>
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
                    {group.count} record{group.count === 1 ? "" : "s"} ·{" "}
                    {formatNumber(group.units)} units
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-brand-elevated/60" aria-hidden="true">
                  <motion.div
                    initial={reduce ? false : { width: 0 }}
                    whileInView={{ width }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.7,
                      delay: reduce ? 0 : index * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full bg-brand-line/70"
                    style={reduce ? { width } : undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 border-t border-brand-line pt-5 text-[11px] leading-relaxed text-brand-secondary/80">
          All figures on this page are calculated from the {pastProjectCount}{" "}
          past project records and {formatNumber(totalPastUnits)} documented
          flats. &ldquo;White Field&rdquo; and &ldquo;Whitefield&rdquo;,
          &ldquo;Hoodi&rdquo; entries and other source variants remain distinct,
          exactly as supplied.{" "}
          {formatNumber(pastTotal)} is the source past-unit total.
        </p>
      </section>
    </div>
  );
}
