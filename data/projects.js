// Central source of truth for every project row listed in the company profile.
// All rows below mirror the supplied PDF exactly — names and spellings are
// preserved on purpose (e.g. "Sraddha Temple Tress", "White Field", "B'lore",
// "Sraddha Lakefront" vs "Sraddha LakeFront", "Sraddha Sunnyside" vs
// "Sraddha Sunny side"). These variant rows are distinct entries in the source
// and are intentionally kept separate here.

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const usedSlugs = new Set();

function uniqueSlug(base) {
  let candidate = base;
  let n = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  usedSlugs.add(candidate);
  return candidate;
}

function p(name, locality, city, units) {
  return {
    name,
    locality,
    city,
    nature: "Apartment",
    units,
    region: city.toLowerCase().includes("chittoor") ? "Chittoor" : "Bangalore",
    slug: uniqueSlug(slugify(name)),
  };
}

// Rw rows: S.NO | PROJECT | LOCATION | NATURE | UNITS
const raw = [
  ["Sraddha Vista", "Rustumbagh", "Bangalore", 12],
  ["Sraddha Manor", "Kaggadasapura", "Bangalore", 12],
  ["Sraddha Residency", "Kaggadasapura", "Bangalore", 12],
  ["Sraddha Orchid", "Rustumbagh", "Bangalore", 11],
  ["Sraddha Fair Field", "Rustumbagh", "Bangalore", 12],
  ["Sraddha Green Meadows", "Rustumbagh", "Bangalore", 16],
  ["Sraddha Maple Manor", "Koramangala", "Bangalore", 12],
  ["Sraddha Golf Links", "Rustumbagh", "Bangalore", 16],
  ["Sraddha Temple Tress", "Rustumbagh", "Bangalore", 20],
  ["Sraddha Heights", "Suddhaguntaplaya", "B'lore", 16],
  ["Sraddha Brindhavan", "White Field", "Bangalore", 35],
  ["Sraddha Gardenia", "Rahathbagh", "Bangalore", 28],
  ["Sraddha Silver Oak", "Rahathbagh", "Bangalore", 31],
  ["Sraddha Silver Springs", "White Field", "Bangalore", 76],
  ["Sraddha Sapphire", "White Field", "Bangalore", 16],
  ["Sraddha Spring Fields", "Banaswadi", "Bangalore", 32],
  ["Sraddha Sunshine", "Koramangala", "B'lore", 12],
  ["Sraddha Fairmount", "HSR Layout", "Bangalore", 34],
  ["Sraddha Oak Tree", "Rahathbagh", "Bangalore", 4],
  ["Sraddha Splendor", "White Field", "Bangalore", 64],
  ["Sraddha Palmera", "Outer Ring Road", "B'lore", 205],
  ["Solitaire Residency", "Hennur", "Bangalore", 100],
  ["Sraddha Sunnyside", "Indiranagar", "Bangalore", 5],
  ["Sraddha LakeFront", "Hoodi", "Bangalore", 104],
  ["Sraddha Whitecliff", "Whitefield", "Bangalore", 220],
  ["Sraddha Lakefront", "Hoodi", "Bangalore", 104],
  ["Sraddha Greenwoods", "Inner circle", "Bangalore", 19],
  ["Sraddha Sunny side", "Indiranagar", "Bangalore", 5],
  ["Sraddha Aavasa", "Chittoor", "Chittoor", 40],
];

export const projects = raw.map(([name, locality, city, units]) =>
  p(name, locality, city, units)
);

export const ongoingProject = {
  name: "Sri Sai Sradddha",
  locality: "Chittoor",
  city: "Chittoor",
  nature: "Apartment",
  units: 35,
  region: "Chittoor",
  slug: uniqueSlug(slugify("Sri Sai Sradddha")),
};

export const allProjects = [...projects, ongoingProject];

// ---- Calculated statistics (derived programmatically from the arrays above) ----
export const pastProjectCount = projects.length;
export const totalPastUnits = projects.reduce((sum, x) => sum + x.units, 0);
export const totalUnitsIncludingOngoing = allProjects.reduce(
  (sum, x) => sum + x.units,
  0
);
export const ongoingUnitCount = ongoingProject.units;

export const regions = ["All", "Bangalore", "Chittoor"];

export function toSlug(name) {
  return slugify(name);
}

export function findProject(slug) {
  return allProjects.find((x) => x.slug === slug);
}