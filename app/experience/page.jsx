import { Reveal } from "@/components/Reveal";
import { ExperienceLoader } from "@/components/ExperienceLoader";
import { OfficeCard } from "@/components/OfficeCard";

export const metadata = {
  title: "Experience",
  description:
    "An interactive, line-art walkthrough of Sraddha Builders and a two-dimensional room visualiser. Illustrative only — no project photographs or floor plans.",
};

export default function ExperiencePage() {
  return (
    <main className="bg-brand-bg">
      <section className="mx-auto max-w-8xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
            A quiet, interactive look inside.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
            No stock photography and no invented floor plans. Just the supplied
            facts, drawn as architecture, plus a small tool for sketching a room
            of your own.
          </p>
        </Reveal>

        <div className="mt-16">
          <ExperienceLoader />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 border-t border-brand-line pt-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow">Visit</p>
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-brand-ink sm:text-5xl">
              The office is in Indiranagar.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-brand-secondary">
              Call ahead, write, or open directions in Google Maps. The office
              address below is reproduced from the company profile.
            </p>
            <p className="mt-6 text-[11px] leading-relaxed text-brand-secondary/80">
              No project photographs are shown anywhere on this site. The
              illustrations on this page are schematic and clearly labelled as
              such.
            </p>
          </div>
          <div className="lg:col-span-7">
            <OfficeCard />
          </div>
        </div>
      </section>
    </main>
  );
}
