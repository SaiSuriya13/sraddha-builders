"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";
import { company } from "@/data/company";

// Homepage "company introduction" editorial block.
export function CompanyIntro() {
  return (
    <section className="bg-brand-bg">
      <div className="mx-auto grid max-w-8xl grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-28">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-brand-gold" aria-hidden="true" />
              <p className="eyebrow">Company Introduction</p>
            </div>
            <h2 className="mt-7 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              {company.name}, <span className="italic text-brand-gold">a partnership firm.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-brand-secondary sm:text-lg">
              <p>
                Sraddha Builders is a partnership firm with its office at{" "}
                <span className="font-medium text-brand-ink">
                  No.3092, Double Road, Indiranagar, HAL 2nd Stage, Bangalore-08
                </span>
                . {company.partners[0]} and {company.partners[1]} are the
                partners.
              </p>
              <p>
                Operating since {company.operatingSince}, the firm has delivered
                a portfolio of apartment projects across Bangalore and Chittoor —
                documented as an honest, verifiable project archive rather than a
                showcase of rendered promises.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/about" className="btn-outline">
                About The Firm
              </Link>
              <Link href="/projects" className="btn-primary">
                View Projects
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.15} className="h-full">
            <div className="flex h-full flex-col border border-brand-line bg-brand-card">
              <div className="blueprint-grid-fine relative flex h-40 items-center justify-center overflow-hidden border-b border-brand-line bg-brand-surface">
                <div className="w-28 opacity-80">
                  <ArchitecturalGraphic variant="arcade" tone="gold" className="h-auto w-full" />
                </div>
                <span className="absolute bottom-2.5 left-4 text-[9px] uppercase tracking-[0.24em] text-brand-muted">
                  Conceptual study
                </span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-brand-line">
                <KeyValue label="Constitution" value={company.constitution} />
                <KeyValue label="Partners" value={company.partnersCount} />
                <KeyValue
                  label="Operating Since"
                  value={String(company.operatingSince)}
                />
                <KeyValue
                  label="Legal Advisor"
                  value="K.V.N. Narendra & Associates"
                />
              </div>
              <div className="mt-auto border-t border-brand-line px-5 py-4 text-[10px] uppercase tracking-[0.25em] text-brand-secondary">
                {company.operatingLocation} · Partnership Firm
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function KeyValue({ label, value }) {
  return (
    <div className="px-5 py-4">
      <div className="text-[11px] uppercase tracking-[0.25em] text-brand-gold">
        {label}
      </div>
      <div className="mt-2 font-serif text-xl font-medium text-brand-ink sm:text-2xl">
        {value}
      </div>
    </div>
  );
}