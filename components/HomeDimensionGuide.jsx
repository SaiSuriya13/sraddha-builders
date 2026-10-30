"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Ruler } from "lucide-react";
import { estimateHomeDimensions } from "@/data/insights";

const BEDROOMS = [1, 2, 3, 4, 5];
const MEMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function HomeDimensionGuide() {
  const [bedrooms, setBedrooms] = useState(2);
  const [members, setMembers] = useState(3);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [hostFrequently, setHostFrequently] = useState(false);

  const estimate = useMemo(
    () =>
      estimateHomeDimensions({
        bedrooms,
        members,
        workFromHome,
        hostFrequently,
      }),
    [bedrooms, members, workFromHome, hostFrequently]
  );

  const requirements = `${estimate.summary} Bedrooms and members supplied by the visitor. This is a planning estimate, not a specification for any listed project.`;

  const selectCls =
    "w-full appearance-none border border-brand-line bg-brand-bg px-4 py-3 text-sm text-brand-ink focus:border-brand-gold focus:outline-none";

  return (
    <div className="border border-brand-line bg-brand-card">
      <div className="grid gap-px bg-brand-line lg:grid-cols-12">
        <div className="bg-brand-card p-6 sm:p-8 lg:col-span-7">
          <div className="flex items-center gap-3">
            <Ruler className="h-5 w-5 text-brand-gold" />
            <p className="eyebrow">Dimension Guide</p>
          </div>
          <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl">
            Plan a home size.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-brand-secondary">
            A generic, rule-based estimate of carpet area. It is not a project
            specification: the source profile does not publish bedroom
            configurations or floor plans.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
                Bedrooms
              </span>
              <select
                value={bedrooms}
                onChange={(event) => setBedrooms(Number(event.target.value))}
                className={selectCls}
              >
                {BEDROOMS.map((count) => (
                  <option key={count} value={count}>
                    {count} bedroom{count === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
                People living there
              </span>
              <select
                value={members}
                onChange={(event) => setMembers(Number(event.target.value))}
                className={selectCls}
              >
                {MEMBERS.map((count) => (
                  <option key={count} value={count}>
                    {count} resident{count === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-brand-ink">
              <input
                type="checkbox"
                checked={workFromHome}
                onChange={(event) => setWorkFromHome(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[rgb(var(--brand-gold))]"
              />
              <span>
                A dedicated work-from-home space
                <span className="mt-0.5 block text-xs text-brand-secondary">
                  Adds an allowance to the planning range.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-brand-ink">
              <input
                type="checkbox"
                checked={hostFrequently}
                onChange={(event) => setHostFrequently(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[rgb(var(--brand-gold))]"
              />
              <span>
                Frequent guests or hosting
                <span className="mt-0.5 block text-xs text-brand-secondary">
                  Adds an allowance to the planning range.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-brand-bg p-6 sm:p-8 lg:col-span-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
              Estimated carpet area
            </p>
            <p className="mt-4 font-serif text-5xl font-medium leading-none tracking-tight text-brand-ink sm:text-6xl">
              {estimate.carpetLow}
              <span className="mx-2 text-3xl text-brand-gold">–</span>
              {estimate.carpetHigh}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-brand-secondary">
              square feet
            </p>

            <div className="mt-7 border-t border-brand-line pt-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
                Indicative built-up range
              </p>
              <p className="mt-2 text-lg text-brand-ink">
                {estimate.builtUpLow}–{estimate.builtUpHigh} sq ft
              </p>
              <p className="mt-1 text-[11px] text-brand-secondary/80">
                Carpet area divided by a planning factor of 0.78.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[11px] leading-relaxed text-brand-secondary">
              {estimate.note}
            </p>
            <Link
              href={`/contact?requirements=${encodeURIComponent(requirements)}`}
              className="mt-5 inline-flex items-center gap-2 border border-brand-line px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              Discuss this requirement
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
