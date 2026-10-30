import { Reveal } from "@/components/Reveal";
import { company } from "@/data/company";

// The full company profile transformed into a two-column editorial layout
// (not the raw PDF table).
export function CompanyProfile() {
  const rows = [
    ["Name of Builder", company.name],
    ["Constitution", company.constitution],
    ["Operating Since", String(company.operatingSince)],
    ["No. of Partners", company.partnersCount],
    ["Operating Location", company.operatingLocation],
    ["Legal Advisor", company.legalAdvisor],
  ];

  return (
    <section className="border-t border-brand-line bg-brand-card">
      <div className="mx-auto max-w-8xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Company Profile</p>
              <h2 className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight text-brand-ink sm:text-5xl">
                The record of the firm.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-brand-secondary">
                The following details are taken directly from the company
                profile. Contact information is listed on the contact page.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <dl className="divide-y divide-brand-line border-y border-brand-line">
                {rows.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.25em] text-brand-gold sm:col-span-4">
                      {label}
                    </dt>
                    <dd className="font-serif text-xl font-medium tracking-tight text-brand-ink sm:col-span-8 sm:text-2xl">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div className="border border-brand-line bg-brand-bg p-6">
                  <h3 className="text-[11px] uppercase tracking-[0.25em] text-brand-gold">
                    Partners
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {company.partners.map((p) => (
                      <li key={p} className="font-serif text-xl font-medium text-brand-ink">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-brand-line bg-brand-bg p-6">
                  <h3 className="text-[11px] uppercase tracking-[0.25em] text-brand-gold">
                    Office Address
                  </h3>
                  <address className="mt-4 space-y-0.5 not-italic text-sm leading-relaxed text-brand-secondary">
                    {company.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}