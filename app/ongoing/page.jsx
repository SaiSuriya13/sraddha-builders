import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ContactActions } from "@/components/ContactActions";
import { ProjectDetailContent } from "@/components/ProjectDetailContent";
import { ongoingProject } from "@/data/projects";

export const metadata = {
  title: "Ongoing Project",
  description:
    "Sri Sai Sradddha — the ongoing apartment project of Sraddha Builders, 35 flats in Chittoor. Enquire for details.",
};

export default function OngoingPage() {
  return (
    <>
      <ProjectDetailContent project={ongoingProject} isOngoing />
      <section className="border-t border-brand-line bg-brand-card">
        <div className="mx-auto max-w-8xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">Current Listing</p>
                <h2 className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight text-brand-ink sm:text-5xl">
                  {ongoingProject.name}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-secondary">
                  The firm&apos;s ongoing project — {ongoingProject.units}{" "}
                  apartment flats in {ongoingProject.locality}. No construction
                  progress or possession dates are claimed here; please contact
                  Sraddha Builders directly for specific details.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/contact?project=${ongoingProject.slug}`}
                    className="btn-primary"
                  >
                    Enquire About This Project
                  </Link>
                  <Link href="/projects" className="btn-outline">
                    View Past Projects
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="lg:col-span-5">
              <div className="border border-brand-line bg-brand-bg p-8">
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-brand-gold">
                  Direct Contact
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
                  Speak with Sraddha Builders about Sri Sai Sradddha or any other
                  project.
                </p>
                <div className="mt-6">
                  <ContactActions />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}