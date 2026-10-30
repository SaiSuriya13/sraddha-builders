import { Reveal } from "@/components/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ContactActions } from "@/components/ContactActions";
import { OfficeCard } from "@/components/OfficeCard";
import { CallbackRequest } from "@/components/CallbackRequest";
import { Phone, Mail } from "lucide-react";
import { company, telHref } from "@/data/company";
import { findProject } from "@/data/projects";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Sraddha Builders — call, email, WhatsApp or submit an enquiry form. Office at Indiranagar, Bangalore.",
};

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const slug = params?.project;
  const preselected = slug ? findProject(slug) : null;
  const requirements =
    typeof params?.requirements === "string"
      ? params.requirements.slice(0, 1500)
      : "";

  return (
    <main className="bg-brand-bg">
      <section className="mx-auto max-w-8xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-medium leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
            Let&apos;s talk about your next home.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-secondary sm:text-lg">
            Whether you are enquiring about a listed project or the ongoing
            development at Chittoor, the simplest way is to reach out directly.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="space-y-8">
                <OfficeCard />

                <ContactBlock
                  icon={<Phone className="h-5 w-5" />}
                  title="Phone"
                >
                  <span className="space-y-1 text-brand-secondary">
                    {company.phones.map((p) => (
                      <span key={p} className="block">
                        <a href={telHref(p)} className="transition-colors hover:text-brand-gold">
                          {p}
                        </a>
                      </span>
                    ))}
                    <span className="block">
                      Landline{" "}
                      <a href={telHref(company.landline)} className="transition-colors hover:text-brand-gold">
                        {company.landline}
                      </a>
                    </span>
                  </span>
                </ContactBlock>

                <ContactBlock
                  icon={<Mail className="h-5 w-5" />}
                  title="Email"
                >
                  <a
                    href={`mailto:${company.email}`}
                    className="text-brand-secondary transition-colors hover:text-brand-gold"
                  >
                    {company.email}
                  </a>
                </ContactBlock>

                <div className="border-t border-brand-line pt-8">
                  <h3 className="text-[11px] uppercase tracking-[0.25em] text-brand-gold">
                    Quick Actions
                  </h3>
                  <div className="mt-5">
                    <ContactActions size="lg" message="Hello Sraddha Builders, I would like to make an enquiry." />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <div className="space-y-8">
                {preselected ? (
                  <p className="border border-brand-gold/30 bg-brand-card px-5 py-3 text-sm text-brand-ink">
                    Project selected:{" "}
                    <span className="font-medium text-brand-gold">
                      {preselected.name}
                    </span>{" "}
                    ({preselected.locality}, {preselected.city})
                  </p>
                ) : null}
                {requirements ? (
                  <p className="border border-brand-gold/30 bg-brand-card px-5 py-3 text-sm text-brand-ink">
                    Your shortlist and stated requirements have been carried into
                    the message below. Review it before sending.
                  </p>
                ) : null}
                <EnquiryForm
                  preselectedSlug={preselected ? preselected.slug : ""}
                  initialMessage={requirements}
                />
                <CallbackRequest
                  projectName={preselected ? preselected.name : ""}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactBlock({ icon, title, children }) {
  return (
    <div className="flex items-start gap-5">
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-brand-line text-brand-gold">
        {icon}
      </span>
      <div>
        <h3 className="text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
          {title}
        </h3>
        <div className="mt-2 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
