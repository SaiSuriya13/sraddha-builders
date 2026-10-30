import { Suspense } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { ProjectSpotlight } from "@/components/ProjectSpotlight";
import { pastProjectCount } from "@/data/projects";

export const metadata = {
  title: "Projects",
  description:
    "Browse the full Sraddha Builders project archive — 29 past project records with the Smart Project Finder, search, regional filtering, grid or list views, and side-by-side comparison.",
};

export default async function ProjectsPage({ searchParams }) {
  const params = await searchParams;
  const region =
    params?.region && ["Bangalore", "Chittoor"].includes(params.region)
      ? params.region
      : "All";

  return (
    <main className="bg-brand-bg">
      <section className="mx-auto max-w-8xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Project Archive</p>
              <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
                {pastProjectCount} project records.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
                Every completed project listed in the company&apos;s profile,
                presented as an editorial catalogue. Use the finder to narrow by
                location and scale, search by name, locality or city, and
                compare up to three projects side by side.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 border border-brand-line px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Print catalogue
            </Link>
          </div>
        </Reveal>

        <Suspense fallback={null}>
          <ProjectsExplorer initialRegion={region} />
        </Suspense>
      </section>

      <ProjectSpotlight />
    </main>
  );
}
