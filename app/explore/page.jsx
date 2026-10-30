import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { AtlasExplorer } from "@/components/AtlasExplorer";
import { atlasGroups, atlasNote } from "@/data/insights";
import { formatNumber } from "@/lib/format";

export const metadata = {
  title: "Location Atlas",
  description:
    "A schematic location atlas of Sraddha Builders project records across Bangalore and Chittoor — city and locality only, with no invented coordinates.",
};

export default function ExplorePage() {
  return (
    <main className="bg-brand-bg">
      <section className="mx-auto max-w-8xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <Reveal>
          <p className="eyebrow">Location Atlas</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
            Where the records sit.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
            The source profile publishes cities and localities, not coordinates.
            This atlas is therefore a schematic index — useful for orientation,
            never presented as survey data or a map of actual sites.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-brand-line py-4">
          {atlasGroups.map((group) => (
            <p
              key={group.region}
              className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary"
            >
              {group.region}:{" "}
              <span className="text-brand-ink">{group.records} records</span>{" "}
              · {group.localities.length} localities ·{" "}
              <span className="text-brand-gold">
                {formatNumber(group.units)} units
              </span>
            </p>
          ))}
        </div>

        <div className="mt-12">
          <AtlasExplorer />
        </div>

        <div className="mt-14 border border-brand-gold/30 bg-brand-card p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
            Data note
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-ink">
            {atlasNote}
          </p>
          <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-brand-secondary">
            Localities are shown exactly as supplied. For example, &ldquo;White
            Field&rdquo; and &ldquo;Whitefield&rdquo; are separate source
            spellings and remain separate here; the same applies to the
            duplicate-variant project names in the archive.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-brand-line bg-brand-line sm:grid-cols-2">
          <Link
            href="/insights"
            className="group flex items-start justify-between gap-4 bg-brand-card p-6 transition-colors hover:bg-brand-bg"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
                Related
              </p>
              <p className="mt-2 font-serif text-2xl font-medium text-brand-ink">
                Intelligence dashboard
              </p>
              <p className="mt-1 text-sm text-brand-secondary">
                Scale, region split and locality concentration.
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-brand-secondary transition-colors group-hover:text-brand-gold" />
          </Link>
          <Link
            href="/recommend"
            className="group flex items-start justify-between gap-4 bg-brand-card p-6 transition-colors hover:bg-brand-bg"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
                Related
              </p>
              <p className="mt-2 font-serif text-2xl font-medium text-brand-ink">
                Find your fit
              </p>
              <p className="mt-1 text-sm text-brand-secondary">
                Turn a locality preference into a shortlist.
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-brand-secondary transition-colors group-hover:text-brand-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
