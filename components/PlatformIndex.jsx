import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building2,
  Compass,
  Map,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { archiveStats, atlasGroups } from "@/data/insights";
import { allProjects } from "@/data/projects";

const items = [
  {
    href: "/catalogue",
    label: "Print Catalogue",
    icon: BookOpen,
    meta: `${allProjects.length} records`,
    description:
      "The complete archive as a clean A4 document. Print it or save it as a PDF.",
  },
  {
    href: "/insights",
    label: "Intelligence",
    icon: BarChart3,
    meta: `${archiveStats.median} median flats`,
    description:
      "Charts and relationships calculated from the documented project records.",
  },
  {
    href: "/explore",
    label: "Location Atlas",
    icon: Map,
    meta: `${archiveStats.localities} localities`,
    description:
      "A schematic index of where records sit — city and locality, not coordinates.",
  },
  {
    href: "/recommend",
    label: "Find Your Fit",
    icon: Compass,
    meta: "Rule-based",
    description:
      "Shortlist records by region and scale, with an indicative home-size guide.",
  },
  {
    href: "/experience",
    label: "Experience",
    icon: Building2,
    meta: "Interactive",
    description:
      "A line-art walkthrough of the firm and a two-dimensional room visualiser.",
  },
];

// Homepage index into the wider platform. Every stat is derived from the
// dataset; nothing here is decorative copy pretending to be data.
export function PlatformIndex() {
  return (
    <section className="border-t border-brand-line bg-brand-card">
      <div className="mx-auto max-w-8xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">The Platform</p>
              <h2 className="mt-6 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight text-brand-ink sm:text-5xl">
                Explore the archive, not just the listings.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-brand-secondary">
              Tools built directly on the company&apos;s supplied records —{" "}
              {archiveStats.records} past projects across{" "}
              {archiveStats.localities} documented localities, plus the ongoing
              development.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.href} delay={index * 0.05} className="h-full">
                <Link
                  href={item.href}
                  className="group flex h-full flex-col bg-brand-card p-6 transition-colors duration-300 hover:bg-brand-bg lg:p-7"
                >
                  <div className="flex items-start justify-between">
                    <Icon className="h-5 w-5 text-brand-gold" />
                    <ArrowUpRight className="h-4 w-4 text-brand-secondary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-gold" />
                  </div>
                  <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-brand-gold">
                    {item.meta}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium tracking-tight text-brand-ink">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
                    {item.description}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-brand-secondary/70">
          {atlasGroups.reduce((sum, group) => sum + group.records, 0)} records
          indexed across {atlasGroups.length} regions
        </p>
      </div>
    </section>
  );
}
