"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { allProjects, ongoingProject, projects, regions } from "@/data/projects";
import { inUnitBand, unitBands } from "@/data/insights";
import { ProjectCard } from "@/components/ProjectCard";

// Interactive project archive: search, region, unit range, city, locality,
// nature, status and sort. Region and unit range remain controlled by the
// parent (Smart Project Finder) so the two surfaces never disagree.

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function ProjectGrid({
  region = "All",
  onRegionChange = () => {},
  unitBand = "any",
  onUnitBandChange = () => {},
  compareSet = [],
  onToggleCompare,
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [city, setCity] = useState("All");
  const [locality, setLocality] = useState("All");
  const [nature, setNature] = useState("All");
  const [status, setStatus] = useState("past");
  const [sort, setSort] = useState("record");

  const showCompare = typeof onToggleCompare === "function";
  const isFull = compareSet.length >= 3;

  const pool = useMemo(() => {
    if (status === "ongoing") return [ongoingProject];
    if (status === "all") return allProjects;
    return projects;
  }, [status]);

  const cities = useMemo(() => unique(pool.map((p) => p.city)), [pool]);
  const natures = useMemo(() => unique(pool.map((p) => p.nature)), [pool]);
  const localities = useMemo(
    () =>
      unique(
        pool
          .filter((p) => city === "All" || p.city === city)
          .map((p) => p.locality)
      ),
    [pool, city]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = pool.filter((project) => {
      if (region !== "All" && project.region !== region) return false;
      if (!inUnitBand(project.units, unitBand)) return false;
      if (city !== "All" && project.city !== city) return false;
      if (locality !== "All" && project.locality !== locality) return false;
      if (nature !== "All" && project.nature !== nature) return false;
      if (!needle) return true;
      return (
        project.name.toLowerCase().includes(needle) ||
        project.locality.toLowerCase().includes(needle) ||
        project.city.toLowerCase().includes(needle) ||
        project.nature.toLowerCase().includes(needle)
      );
    });

    const sorted = [...filtered];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "units-desc") {
      sorted.sort((a, b) => b.units - a.units || a.name.localeCompare(b.name));
    } else if (sort === "units-asc") {
      sorted.sort((a, b) => a.units - b.units || a.name.localeCompare(b.name));
    } else if (sort === "locality") {
      sorted.sort(
        (a, b) =>
          a.locality.localeCompare(b.locality) || a.name.localeCompare(b.name)
      );
    }
    return sorted;
  }, [pool, region, unitBand, city, locality, nature, query, sort]);

  const activeChips = [];
  if (query.trim()) {
    activeChips.push({
      key: "query",
      label: `“${query.trim()}”`,
      clear: () => setQuery(""),
    });
  }
  if (region !== "All") {
    activeChips.push({
      key: "region",
      label: region,
      clear: () => onRegionChange("All"),
    });
  }
  if (unitBand !== "any") {
    activeChips.push({
      key: "band",
      label: unitBands.find((b) => b.value === unitBand)?.label || unitBand,
      clear: () => onUnitBandChange("any"),
    });
  }
  if (city !== "All") {
    activeChips.push({
      key: "city",
      label: city,
      clear: () => {
        setCity("All");
        setLocality("All");
      },
    });
  }
  if (locality !== "All") {
    activeChips.push({
      key: "locality",
      label: locality,
      clear: () => setLocality("All"),
    });
  }
  if (nature !== "All") {
    activeChips.push({
      key: "nature",
      label: nature,
      clear: () => setNature("All"),
    });
  }
  if (status !== "past") {
    activeChips.push({
      key: "status",
      label: status === "all" ? "All statuses" : "Ongoing",
      clear: () => setStatus("past"),
    });
  }
  if (sort !== "record") {
    activeChips.push({
      key: "sort",
      label: `Sorted: ${sortLabels[sort]}`,
      clear: () => setSort("record"),
    });
  }

  function resetAll() {
    setQuery("");
    setCity("All");
    setLocality("All");
    setNature("All");
    setStatus("past");
    setSort("record");
    onRegionChange("All");
    onUnitBandChange("any");
  }

  const compareBtn = (slug) =>
    `inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
      compareSet.includes(slug)
        ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
        : isFull
          ? "cursor-not-allowed border-brand-line text-brand-secondary/40"
          : "border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
    }`;

  const selectCls =
    "w-full appearance-none border border-brand-line bg-transparent px-3.5 py-2.5 text-sm text-brand-ink transition-colors focus:border-brand-gold focus:outline-none";

  return (
    <div id="project-archive">
      {/* toolbar row one: region + search + view */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              aria-pressed={region === r}
              className={`px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-all duration-300 ${
                region === r
                  ? "bg-brand-gold text-brand-bg"
                  : "border border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-secondary" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, locality, city"
              aria-label="Search projects"
              className="w-full border border-brand-line bg-transparent py-2.5 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-secondary/70 focus:border-brand-gold focus:outline-none"
            />
          </div>

          <div className="flex border border-brand-line">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`flex h-10 w-10 items-center justify-center transition-colors ${
                view === "grid"
                  ? "bg-brand-gold text-brand-bg"
                  : "text-brand-secondary hover:text-brand-ink"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`flex h-10 w-10 items-center justify-center border-l border-brand-line transition-colors ${
                view === "list"
                  ? "bg-brand-gold text-brand-bg"
                  : "text-brand-secondary hover:text-brand-ink"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* toolbar row two: deeper filters */}
      <div className="mt-6 border-t border-brand-line pt-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-brand-secondary">
          <SlidersHorizontal className="h-3.5 w-3.5 text-brand-gold" />
          Refine the archive
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCity("All");
                setLocality("All");
              }}
              className={selectCls}
            >
              <option value="past">Past records (29)</option>
              <option value="ongoing">Ongoing (1)</option>
              <option value="all">All records (30)</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              City
            </span>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setLocality("All");
              }}
              className={selectCls}
            >
              <option value="All">All cities</option>
              {cities.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              Locality
            </span>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className={selectCls}
            >
              <option value="All">All localities</option>
              {localities.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              Nature
            </span>
            <select
              value={nature}
              onChange={(e) => setNature(e.target.value)}
              className={selectCls}
            >
              <option value="All">All natures</option>
              {natures.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={selectCls}
            >
              <option value="record">Record order</option>
              <option value="name">Name (A–Z)</option>
              <option value="units-desc">Units (high to low)</option>
              <option value="units-asc">Units (low to high)</option>
              <option value="locality">Locality</option>
            </select>
          </label>
        </div>
      </div>

      {/* active chips + utilities */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.length > 0 ? (
            <>
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1.5 border border-brand-gold/40 bg-brand-gold/5 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  {chip.label}
                  <X className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-brand-gold transition-colors hover:text-brand-bronze"
              >
                <RotateCcw className="h-3 w-3" />
                Reset all
              </button>
            </>
          ) : (
            <p className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary/70">
              No filters applied
            </p>
          )}
        </div>

        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-secondary transition-colors hover:text-brand-gold"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Print catalogue
        </Link>
      </div>

      {/* count */}
      <p className="mt-8 text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
        {results.length} project record{results.length === 1 ? "" : "s"}
        {results.length !== pool.length ? ` of ${pool.length}` : ""}
      </p>

      {/* results */}
      {results.length === 0 ? (
        <div className="mt-10 border border-dashed border-brand-line py-24 text-center">
          <p className="font-serif text-3xl font-medium text-brand-ink">
            No projects found
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-brand-secondary">
            Try another project name, locality, city or unit range.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="btn-outline mt-8 !py-3 text-[11px]"
          >
            Clear all filters
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {results.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              onToggleCompare={showCompare ? onToggleCompare : undefined}
              isComparing={compareSet.includes(project.slug)}
              compareDisabled={isFull && !compareSet.includes(project.slug)}
            />
          ))}
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-brand-line border-y border-brand-line">
          {results.map((project, i) => (
            <li key={project.slug} className="group">
              <div className="flex items-center gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="flex min-w-0 flex-1 flex-col gap-2 px-2 py-6 transition-colors hover:bg-brand-card sm:grid sm:grid-cols-12 sm:items-baseline sm:gap-4"
                >
                  <span className="text-[11px] uppercase tracking-[0.3em] text-brand-gold sm:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-2xl font-medium text-brand-ink transition-colors group-hover:text-brand-gold sm:col-span-4">
                    {project.name}
                  </span>
                  <span className="text-[13px] uppercase tracking-[0.15em] text-brand-secondary sm:col-span-4">
                    {project.locality} / {project.city}
                  </span>
                  <span className="flex items-center gap-4 text-[12px] uppercase tracking-[0.15em] text-brand-ink/70 sm:col-span-3 sm:justify-end">
                    <span>{project.nature}</span>
                    <span className="text-brand-gold">{project.units} Flats</span>
                  </span>
                </Link>
                {showCompare ? (
                  <button
                    type="button"
                    onClick={() => onToggleCompare(project.slug)}
                    aria-pressed={compareSet.includes(project.slug)}
                    disabled={isFull && !compareSet.includes(project.slug)}
                    className={`flex-shrink-0 ${compareBtn(project.slug)} sm:mr-6`}
                  >
                    {compareSet.includes(project.slug) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                    {compareSet.includes(project.slug)
                      ? "Comparing"
                      : "Compare"}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 border-t border-brand-line pt-6 text-[11px] leading-relaxed text-brand-secondary/70">
        Project information is presented from the company&apos;s supplied
        profile. Unit counts, localities and spellings are listed as provided.
        Filters and sorting never alter the underlying records.
      </p>
    </div>
  );
}

const sortLabels = {
  record: "Record order",
  name: "Name",
  "units-desc": "Units high to low",
  "units-asc": "Units low to high",
  locality: "Locality",
};
