import { Reveal } from "@/components/Reveal";
import { RecommendationEngine } from "@/components/RecommendationEngine";
import { HomeDimensionGuide } from "@/components/HomeDimensionGuide";

export const metadata = {
  title: "Find Your Fit",
  description:
    "Shortlist Sraddha Builders project records by region, documented scale and locality, plus an indicative home dimension guide.",
};

export default function RecommendPage() {
  return (
    <main className="bg-brand-bg">
      <section className="mx-auto max-w-8xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <Reveal>
          <p className="eyebrow">Find Your Fit</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
            A shortlist, with reasons.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
            Transparent rules, visible reasons, and no hidden scoring. Every
            suggestion points back to a documented record.
          </p>
        </Reveal>

        <div className="mt-14">
          <RecommendationEngine />
        </div>

        <div className="mt-20">
          <HomeDimensionGuide />
        </div>

        <p className="mt-10 max-w-3xl text-[11px] leading-relaxed text-brand-secondary/80">
          Neither tool offers a price, availability, bedroom configuration or
          approval status, because those details are not part of the supplied
          profile. Any requirement you send is reviewed by the firm, not
          processed automatically.
        </p>
      </section>
    </main>
  );
}
