"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, RotateCcw } from "lucide-react";
import {
  recommendProjects,
  unitBands,
} from "@/data/insights";
import { allProjects } from "@/data/projects";
import { formatNumber } from "@/lib/format";

const SCALES = [
  { value: "any", label: "No preference" },
  { value: "compact", label: "Compact (≤ 50 flats)" },
  { value: "large", label: "Large (100+ flats)" },
];

export function RecommendationEngine() {
  const [region, setRegion] = useState("All");
  const [band, setBand] = useState("any");
  const [locality, setLocality] = useState("");
  const [scale, setScale] = useState("any");

  const results = useMemo(
    () => recommendProjects({ region, band, locality, scale, limit: 6 }),
    [region, band, locality, scale]
  );

  const dirty =
    region !== "All" || band !== "any" || locality.trim() || scale !== "any";

  const shortlistText = results
    .slice(0, 3)
    .map((entry) => entry.project.name)
    .join(", ");

  const requirements = `Shortlist request — region: ${region}; preferred scale: ${
    unitBands.find((option) => option.value === band)?.label || "any"
  }; community size: ${scale}; locality note: ${
    locality.trim() || "none"
  }. Suggested records: ${shortlistText || "none"}.`;

  function reset() {
    setRegion("All");
    setBand("any");
    setLocality("");
    setScale("any");
  }

  const buttonCls = (active) =>
    `px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] transition-colors ${
      active
        ? "bg-brand-gold text-brand-bg"
        : "border border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
    }`;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-3">
          <Compass className="h-5 w-5 text-brand-gold" />
          <p className="eyebrow">Rule-Based Finder</p>
        </div>
        <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl">
          Tell us what matters.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
          Ranking uses only fields that exist in the supplied profile: region,
          locality and documented flat count. There is no AI model and no hidden
          data.
        </p>

        <div className="mt-8 space-y-7">
          <fieldset>
            <legend className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
              1 · Region
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {["All", "Bangalore", "Chittoor"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRegion(option)}
                  aria-pressed={region === option}
                  className={buttonCls(region === option)}
                >
                  {option === "All" ? "Any region" : option}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
              2 · Project scale
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {unitBands.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBand(option.value)}
                  aria-pressed={band === option.value}
                  className={buttonCls(band === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
              3 · Community feel
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {SCALES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setScale(option.value)}
                  aria-pressed={scale === option.value}
                  className={buttonCls(scale === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="finder-locality"
              className="block text-[10px] uppercase tracking-[0.22em] text-brand-secondary"
            >
              4 · Locality or city note (optional)
            </label>
            <input
              id="finder-locality"
              type="text"
              value={locality}
              onChange={(event) => setLocality(event.target.value)}
              placeholder="For example: White Field, Hoodi, Chittoor"
              className="mt-3 w-full border border-brand-line bg-transparent px-4 py-3 text-sm text-brand-ink placeholder:text-brand-secondary/60 focus:border-brand-gold focus:outline-none"
            />
          </div>

          {dirty ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-gold transition-colors hover:text-brand-bronze"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset preferences
            </button>
          ) : null}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-line pb-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-ink">
            {results.length} suggested record{results.length === 1 ? "" : "s"}
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
            {formatNumber(allProjects.length)} records considered
          </p>
        </div>

        {results.length === 0 ? (
          <div className="mt-8 border border-dashed border-brand-line py-16 text-center">
            <p className="font-serif text-2xl font-medium text-brand-ink">
              No record matches all of those preferences.
            </p>
            <p className="mt-2 text-sm text-brand-secondary">
              Relax the region or scale and try again.
            </p>
            <button type="button" onClick={reset} className="btn-outline mt-6 !py-3 text-[10px]">
              Reset preferences
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-brand-line">
            {results.map(({ project, reasons }, index) => (
              <li key={project.slug} className="group">
                <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <span className="mt-1 font-serif text-sm text-brand-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="font-serif text-2xl font-medium leading-snug text-brand-ink transition-colors group-hover:text-brand-gold"
                      >
                        {project.name}
                      </Link>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                        {project.locality} · {project.city} · {project.units}{" "}
                        flats
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {reasons.map((reason) => (
                          <li
                            key={reason}
                            className="border border-brand-line bg-brand-card px-2 py-1 text-[10px] text-brand-secondary"
                          >
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={`/contact?project=${project.slug}&requirements=${encodeURIComponent(
                      requirements
                    )}`}
                    className="inline-flex flex-shrink-0 items-center gap-1.5 self-start border border-brand-line px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
                  >
                    Enquire
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border border-brand-gold/30 bg-brand-card p-5">
          <p className="text-sm leading-relaxed text-brand-ink">
            Want the whole shortlist reviewed by the firm?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-brand-secondary">
            The enquiry form will carry your stated preferences and these
            suggested records into the message, so nothing has to be retyped.
          </p>
          <Link
            href={`/contact?requirements=${encodeURIComponent(requirements)}`}
            className="btn-primary mt-4 !py-3 text-[10px]"
          >
            Send this shortlist
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-brand-secondary/80">
          Recommendations are suggestions, not availability, pricing, approvals
          or a guarantee that a record is for sale. All records listed are past
          projects unless marked ongoing.
        </p>
      </div>
    </div>
  );
}
