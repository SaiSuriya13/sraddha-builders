// Derived analytical layer over the verified project dataset.
//
// RULES:
// - Nothing here invents project facts. Every value is computed from
//   data/projects.js, or is an explicitly labelled generic estimate.
// - Project names, localities and spellings are passed through untouched.
// - The atlas positions are a schematic index, NOT geographic coordinates.

import { allProjects, ongoingProject, projects } from "./projects";

/* -------------------------------------------------------------------------- */
/* Unit bands (shared by the finder, archive and recommender)                 */
/* -------------------------------------------------------------------------- */

export const unitBands = [
  { value: "any", label: "Any number of units" },
  { value: "1-50", label: "1–50 flats" },
  { value: "51-100", label: "51–100 flats" },
  { value: "100+", label: "100+ flats" },
];

export function inUnitBand(units, band) {
  if (band === "any" || !band) return true;
  if (band === "1-50") return units <= 50;
  if (band === "51-100") return units >= 51 && units <= 100;
  if (band === "100+") return units > 100;
  return true;
}

// Five finer bands used for the distribution charts.
export const unitBuckets = [
  { key: "1-10", label: "1–10", min: 1, max: 10 },
  { key: "11-25", label: "11–25", min: 11, max: 25 },
  { key: "26-50", label: "26–50", min: 26, max: 50 },
  { key: "51-100", label: "51–100", min: 51, max: 100 },
  { key: "101+", label: "101+", min: 101, max: Infinity },
];

export function bucketStats(list = projects) {
  return unitBuckets.map((bucket) => {
    const items = list.filter(
      (p) => p.units >= bucket.min && p.units <= bucket.max
    );
    return {
      ...bucket,
      count: items.length,
      units: items.reduce((sum, p) => sum + p.units, 0),
      projects: items,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Locality / region aggregation                                              */
/* -------------------------------------------------------------------------- */

export function groupByLocality(list = projects) {
  const map = new Map();
  for (const p of list) {
    // Locality + city keeps same-named localities in different cities apart.
    const key = `${p.locality}||${p.city}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        locality: p.locality,
        city: p.city,
        region: p.region,
        projects: [],
        units: 0,
        ongoingCount: 0,
      });
    }
    const group = map.get(key);
    group.projects.push(p);
    group.units += p.units;
    if (p.slug === ongoingProject.slug) group.ongoingCount += 1;
  }
  return [...map.values()]
    .map((group) => ({ ...group, count: group.projects.length }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        b.units - a.units ||
        a.locality.localeCompare(b.locality) ||
        a.city.localeCompare(b.city)
    );
}

export function regionStats(list = projects) {
  const map = new Map();
  for (const p of list) {
    if (!map.has(p.region)) {
      map.set(p.region, { region: p.region, count: 0, units: 0 });
    }
    const entry = map.get(p.region);
    entry.count += 1;
    entry.units += p.units;
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export const pastRegionStats = regionStats(projects);
export const allRegionStats = regionStats(allProjects);

export function natureStats(list = projects) {
  const map = new Map();
  for (const p of list) {
    map.set(p.nature, (map.get(p.nature) || 0) + 1);
  }
  return [...map.entries()].map(([nature, count]) => ({ nature, count }));
}

/* -------------------------------------------------------------------------- */
/* Archive summary                                                            */
/* -------------------------------------------------------------------------- */

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

export const archiveStats = (() => {
  const units = projects.map((p) => p.units);
  const total = units.reduce((sum, n) => sum + n, 0);
  const localities = groupByLocality(projects);
  return {
    records: projects.length,
    units: total,
    localities: localities.length,
    regions: pastRegionStats.length,
    smallest: Math.min(...units),
    largest: Math.max(...units),
    mean: Math.round(total / projects.length),
    median: median(units),
  };
})();

export const largestProject = projects.reduce((a, b) =>
  b.units > a.units ? b : a
);

export const smallestProject = projects.reduce((a, b) =>
  b.units < a.units ? b : a
);

// Records of note for the projects page spotlight. Derived, never hardcoded.
export const spotlightRecords = [
  { project: largestProject, note: "Largest documented project" },
  { project: projects[0], note: "First record in the archive" },
  { project: smallestProject, note: "Smallest documented project" },
  { project: ongoingProject, note: "Currently ongoing" },
].filter(
  (entry, index, arr) =>
    arr.findIndex((other) => other.project.slug === entry.project.slug) === index
);

/* -------------------------------------------------------------------------- */
/* Recommendation engine (explicit rules over real fields only)               */
/* -------------------------------------------------------------------------- */

export function recommendProjects({
  region = "All",
  band = "any",
  locality = "",
  scale = "any",
  limit = 6,
} = {}) {
  const localityIndex = groupByLocality(projects);
  const localityCount = new Map(
    localityIndex.map((group) => [
      `${group.locality}||${group.city}`,
      group.count,
    ])
  );
  const query = locality.trim().toLowerCase();

  const scored = [];

  for (const project of projects) {
    if (region !== "All" && project.region !== region) continue;

    let score = 0;
    const reasons = [];

    if (region !== "All") {
      score += 10;
      reasons.push(`${project.region} region, as requested`);
    }

    if (band !== "any") {
      if (inUnitBand(project.units, band)) {
        score += 8;
        reasons.push(`${project.units} flats — inside your preferred scale`);
      } else {
        score -= 2;
      }
    }

    if (query) {
      const haystack = `${project.locality} ${project.city}`.toLowerCase();
      if (haystack.includes(query)) {
        score += 9;
        reasons.push(`Locality matches “${locality.trim()}”`);
      } else {
        score -= 1;
      }
    }

    if (scale === "compact") {
      if (project.units <= 50) {
        score += 6;
        reasons.push("Compact community of 50 flats or fewer");
      } else {
        score -= 3;
      }
    } else if (scale === "large") {
      if (project.units >= 100) {
        score += 6;
        reasons.push("Large documented project of 100+ flats");
      } else {
        score -= 3;
      }
    }

    const peers = localityCount.get(`${project.locality}||${project.city}`) || 1;
    if (peers > 1) {
      reasons.push(`One of ${peers} records in ${project.locality}`);
    } else {
      reasons.push(`The only archive record in ${project.locality}`);
    }

    scored.push({
      project,
      score,
      reasons: reasons.slice(0, 3),
    });
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.project.units - a.project.units ||
        a.project.name.localeCompare(b.project.name)
    )
    .slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Home dimension guide — generic estimates, not a project specification      */
/* -------------------------------------------------------------------------- */

const CARPET_BASE = { 1: 480, 2: 680, 3: 920, 4: 1180, 5: 1420 };

function roundTo10(value) {
  return Math.round(value / 10) * 10;
}

export function estimateHomeDimensions({
  bedrooms = 2,
  members = 3,
  workFromHome = false,
  hostFrequently = false,
} = {}) {
  const base = CARPET_BASE[bedrooms] || CARPET_BASE[2];
  let low = base;
  let high = base + 180;

  if (workFromHome) {
    low += 80;
    high += 120;
  }
  if (hostFrequently) {
    low += 60;
    high += 100;
  }

  const extraPeople = Math.max(0, members - (bedrooms + 1));
  low += extraPeople * 50;
  high += extraPeople * 60;

  low = roundTo10(low);
  high = roundTo10(high);

  const carpetLow = low;
  const carpetHigh = high;
  const builtUpLow = roundTo10(carpetLow / 0.78);
  const builtUpHigh = roundTo10(carpetHigh / 0.78);

  return {
    carpetLow,
    carpetHigh,
    builtUpLow,
    builtUpHigh,
    note:
      "Indicative planning range only. It is not a specification, sanction, or price, and no project in the archive is documented with bedroom configurations.",
    summary: `Home dimension guide (indicative): ${bedrooms} bedroom${
      bedrooms === 1 ? "" : "s"
    }, ${members} resident${members === 1 ? "" : "s"}${
      workFromHome ? ", work-from-home space" : ""
    }${hostFrequently ? ", occasional hosting" : ""}. Estimated carpet area ${carpetLow}–${carpetHigh} sq ft.`,
  };
}

/* -------------------------------------------------------------------------- */
/* Schematic atlas — positions are an index layout, not coordinates           */
/* -------------------------------------------------------------------------- */

const ATLAS_REGIONS = ["Bangalore", "Chittoor"];

export const atlasGroups = ATLAS_REGIONS.map((region) => {
  const localities = groupByLocality(
    allProjects.filter((p) => p.region === region)
  );
  const total = localities.length || 1;
  const nodes = localities.map((group, index) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const ring = index % 2 === 0 ? 1 : 0.7;
    return {
      ...group,
      x: Number((50 + Math.cos(angle) * 37 * ring).toFixed(3)),
      y: Number((50 + Math.sin(angle) * 37 * ring).toFixed(3)),
    };
  });
  return {
    region,
    localities: nodes,
    records: nodes.reduce((sum, n) => sum + n.count, 0),
    units: nodes.reduce((sum, n) => sum + n.units, 0),
  };
});

export const atlasNote =
  "Schematic index only — marker positions follow archive order, not geography. No project coordinates are published in the source profile.";

/* -------------------------------------------------------------------------- */
/* Enquiry analytics helpers (operate on real database rows)                  */
/* -------------------------------------------------------------------------- */

export const enquiryStatuses = ["new", "contacted", "closed"];

export function enquirySummary(rows = []) {
  const total = rows.length;
  const byStatus = Object.fromEntries(
    enquiryStatuses.map((status) => [
      status,
      rows.filter((row) => row.status === status).length,
    ])
  );
  const handled = byStatus.contacted + byStatus.closed;
  return {
    total,
    byStatus,
    handled,
    conversion: total === 0 ? 0 : Math.round((handled / total) * 100),
  };
}

export function enquiriesByDay(rows = [], days = 14) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const buckets = new Map();
  for (const row of rows) {
    const date = new Date(row.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = formatter.format(date);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  const output = [];
  const today = new Date();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = formatter.format(date);
    output.push({ key, count: buckets.get(key) || 0 });
  }
  return output;
}
