import { Reveal } from "@/components/Reveal";
import { StatsSection } from "@/components/StatsSection";
import { CompanyProfile } from "@/components/CompanyProfile";
import { CustomerCare } from "@/components/CustomerCare";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";
import { company } from "@/data/company";
import { projects, pastProjectCount } from "@/data/projects";

export const metadata = {
  title: "About",
  description:
    "About Sraddha Builders — a Bangalore partnership firm operating since 1999 with two partners and a documented portfolio of apartment projects.",
};

export default function AboutPage() {
  return (
    <>
      <main className="bg-brand-bg">
        {/* page header */}
        <section className="relative overflow-hidden bg-brand-bg">
          <div className="mx-auto max-w-8xl px-5 pb-16 pt-32 sm:px-8 lg:px-12 lg:pb-24 lg:pt-44">
            <Reveal>
              <p className="eyebrow">About Sraddha Builders</p>
              <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
                A partnership firm building with trust since {company.operatingSince}.
              </h1>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              <Reveal delay={0.1} className="lg:col-span-7">
                <div className="space-y-5 text-base leading-relaxed text-brand-secondary sm:text-lg">
                  <p>
                    &ldquo;{company.name}&rdquo; is a partnership firm having its
                    office at No.3092, Double Road, Indiranagar, HAL 2nd Stage,
                    Bangalore-08. {company.partners[0]} and {company.partners[1]}{" "}
                    are the partners.
                  </p>
                  <p>
                    Over the years the firm has listed {pastProjectCount} apartment
                    project records across Bangalore and neighbouring regions —
                    each one set out in full on the project archive. An ongoing
                    apartment project, Sri Sai Sradddha, is currently listed in
                    Chittoor.
                  </p>
                  <p>
                    The firm works with {company.legalAdvisor} as its legal
                    advisor, and is committed to customer care in all matters,
                    from the first enquiry to long after a project is listed.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.2} className="lg:col-span-5">
                <div className="relative mx-auto max-w-sm border border-brand-line bg-brand-card p-6">
                  <ArchitecturalGraphic variant="skyline" className="h-auto w-full" />
                  <div className="mt-5 flex items-center justify-between border-t border-brand-line pt-4 text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
                    <span>Partnership Firm</span>
                    <span className="text-brand-gold">Est. {company.operatingSince}</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <StatsSection />
      <CompanyProfile />
      <CustomerCare />
    </>
  );
}