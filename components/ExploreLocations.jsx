import Link from "next/link";
import { Reveal } from "@/components/Reveal";

// Explore projects by location — grouping helper + presentational section.
export function buildLocationGroups(projects) {
  const map = new Map();
  for (const p of projects) {
    if (!map.has(p.region)) {
      map.set(p.region, { region: p.region, count: 0, units: 0, localities: new Set() });
    }
    const g = map.get(p.region);
    g.count += 1;
    g.units += p.units;
    g.localities.add(p.locality);
  }
  return [...map.values()].map((g) => ({ ...g, localities: [...g.localities] }));
}
export function ExploreLocations({ groups }) {
  return (
    <section className="border-y border-brand-line bg-brand-card">
      <div className="mx-auto max-w-8xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Explore By Location</p>
              <h2 className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight text-brand-ink sm:text-5xl">
                Where we have built.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.region} delay={i * 0.08}>
              <Link
                href={`/projects?region=${encodeURIComponent(g.region)}`}
                className="group block border border-brand-line bg-brand-bg p-8 transition-all duration-300 hover:border-brand-gold/50"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">
                    {g.region}
                  </span>
                  <span className="font-serif text-3xl font-medium text-brand-ink/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 font-serif text-3xl font-medium text-brand-ink">
                  {g.count} projects
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.15em] text-brand-secondary">
                  {g.units.toLocaleString("en-IN")} units listed
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {g.localities.slice(0, 4).map((loc) => (
                    <span
                      key={loc}
                      className="border border-brand-line px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-brand-secondary"
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}