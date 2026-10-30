import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { RelationshipMap } from "@/components/RelationshipMap";

export const metadata = {
  title: "Intelligence",
  description:
    "Calculated insights from the Sraddha Builders project archive — unit distribution, regional split, locality concentration and region-to-project relationships.",
};

export default function InsightsPage() {
  return (
    <main className="bg-brand-bg">
      <section className="mx-auto max-w-8xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <Reveal>
          <p className="eyebrow">Intelligence</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
            The archive, measured.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
            Every chart below is calculated live from the documented project
            records. There is no third-party market data, no estimate presented
            as fact, and no invented location precision.
          </p>
        </Reveal>

        <div className="mt-14">
          <InsightsDashboard />
        </div>

        <div className="mt-20 border-t border-brand-line pt-20">
          <RelationshipMap />
        </div>

        <div className="mt-16 grid gap-px border border-brand-line bg-brand-line sm:grid-cols-2">
          <Link
            href="/explore"
            className="group flex items-start justify-between gap-4 bg-brand-card p-6 transition-colors hover:bg-brand-bg"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-gold">
                Next
              </p>
              <p className="mt-2 font-serif text-2xl font-medium text-brand-ink">
                Location atlas
              </p>
              <p className="mt-1 text-sm text-brand-secondary">
                A schematic index of localities across both regions.
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
                Next
              </p>
              <p className="mt-2 font-serif text-2xl font-medium text-brand-ink">
                Find your fit
              </p>
              <p className="mt-1 text-sm text-brand-secondary">
                Rule-based shortlisting plus a home dimension guide.
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-brand-secondary transition-colors group-hover:text-brand-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
