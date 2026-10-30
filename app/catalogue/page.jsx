import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PrintButton } from "@/components/PrintButton";
import {
  ongoingProject,
  pastProjectCount,
  projects,
  totalPastUnits,
} from "@/data/projects";
import { formatDate, formatNumber } from "@/lib/format";

export const metadata = {
  title: "Project Catalogue",
  description:
    "The complete Sraddha Builders project catalogue — all 29 past project records and the ongoing project, formatted for A4 print or PDF.",
};

export default function CataloguePage() {
  return (
    <main className="catalogue-page bg-brand-bg">
      <section className="mx-auto max-w-8xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="no-print">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brand-secondary transition-colors hover:text-brand-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to archive
            </Link>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-3xl">
                <p className="eyebrow">Catalogue</p>
                <h1 className="mt-6 font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl">
                  The complete project record.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-secondary">
                  Every record from the supplied profile, formatted for A4.
                  Print this page or save it as a PDF — the source spellings are
                  preserved exactly, including the duplicate-variant entries.
                </p>
              </div>
              <PrintButton />
            </div>
          </Reveal>
        </div>

        {/* Print-only masthead */}
        <div className="hidden print:block">
          <p className="text-[10px] uppercase tracking-[0.3em]">
            Sraddha Builders · Project Catalogue
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium">
            The complete project record.
          </h1>
          <p className="mt-2 text-xs">
            Compiled {formatDate(new Date())} from the supplied company profile.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px border border-brand-line bg-brand-line sm:grid-cols-4">
          {[
            ["Past project records", pastProjectCount],
            ["Past units", formatNumber(totalPastUnits)],
            ["Ongoing projects", 1],
            ["Ongoing units", ongoingProject.units],
          ].map(([label, value]) => (
            <div key={label} className="bg-brand-card p-4 sm:p-5">
              <p className="font-serif text-3xl font-medium text-brand-ink">
                {value}
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-brand-gold">
                {label}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-14" aria-labelledby="catalogue-past">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-line pb-4">
            <h2
              id="catalogue-past"
              className="font-serif text-3xl font-medium tracking-tight text-brand-ink"
            >
              Past Projects
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              {pastProjectCount} records · {formatNumber(totalPastUnits)} flats
            </p>
          </div>

          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="w-12 py-2.5 pr-2 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  No.
                </th>
                <th className="py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  Project
                </th>
                <th className="py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  Locality
                </th>
                <th className="py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  City
                </th>
                <th className="hidden py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary sm:table-cell">
                  Nature
                </th>
                <th className="py-2.5 text-right text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  Units
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.slug}
                  className="catalogue-row border-b border-brand-line"
                >
                  <td className="py-2.5 pr-2 align-top text-[11px] text-brand-gold">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="py-2.5 pr-4 align-top text-[13px] font-medium text-brand-ink">
                    {project.name}
                  </td>
                  <td className="py-2.5 pr-4 align-top text-[12px] text-brand-ink/80">
                    {project.locality}
                  </td>
                  <td className="py-2.5 pr-4 align-top text-[12px] text-brand-ink/80">
                    {project.city}
                  </td>
                  <td className="hidden py-2.5 pr-4 align-top text-[12px] text-brand-ink/80 sm:table-cell">
                    {project.nature}
                  </td>
                  <td className="py-2.5 text-right align-top text-[12px] text-brand-ink">
                    {project.units}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="pt-3 text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                  Total past units
                </td>
                <td className="pt-3 text-right font-serif text-lg text-brand-ink">
                  {formatNumber(totalPastUnits)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="mt-14" aria-labelledby="catalogue-ongoing">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-line pb-4">
            <h2
              id="catalogue-ongoing"
              className="font-serif text-3xl font-medium tracking-tight text-brand-ink"
            >
              Ongoing
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
              1 record · {ongoingProject.units} flats
            </p>
          </div>

          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-line">
                <th className="w-12 py-2.5 pr-2 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  No.
                </th>
                <th className="py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  Project
                </th>
                <th className="py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  Locality
                </th>
                <th className="py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  City
                </th>
                <th className="hidden py-2.5 pr-4 text-[9px] uppercase tracking-[0.18em] text-brand-secondary sm:table-cell">
                  Nature
                </th>
                <th className="py-2.5 text-right text-[9px] uppercase tracking-[0.18em] text-brand-secondary">
                  Units
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="catalogue-row border-b border-brand-line">
                <td className="py-2.5 pr-2 align-top text-[11px] text-brand-gold">
                  01
                </td>
                <td className="py-2.5 pr-4 align-top text-[13px] font-medium text-brand-ink">
                  {ongoingProject.name}
                </td>
                <td className="py-2.5 pr-4 align-top text-[12px] text-brand-ink/80">
                  {ongoingProject.locality}
                </td>
                <td className="py-2.5 pr-4 align-top text-[12px] text-brand-ink/80">
                  {ongoingProject.city}
                </td>
                <td className="hidden py-2.5 pr-4 align-top text-[12px] text-brand-ink/80 sm:table-cell">
                  {ongoingProject.nature}
                </td>
                <td className="py-2.5 text-right align-top text-[12px] text-brand-ink">
                  {ongoingProject.units}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="mt-12 border-t border-brand-line pt-6">
          <p className="max-w-3xl text-[10px] leading-relaxed text-brand-secondary">
            Source: the company profile supplied by Sraddha Builders. All names,
            localities, cities and unit counts are reproduced as provided,
            including variant spellings and duplicate entries such as
            &ldquo;Sraddha Lakefront&rdquo; / &ldquo;Sraddha LakeFront&rdquo; and
            &ldquo;Sraddha Sunnyside&rdquo; / &ldquo;Sraddha Sunny side&rdquo;.
            No prices, bedroom configurations, approvals or completion dates are
            published because none are present in the source.
          </p>
        </div>

        <div className="no-print mt-10 flex flex-wrap items-center gap-4">
          <PrintButton label="Print / Save as PDF" />
          <Link href="/projects" className="btn-outline !py-3 text-[12px]">
            Browse interactive archive
          </Link>
        </div>
      </section>
    </main>
  );
}
