import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { company, telHref } from "@/data/company";
import { pastProjectCount } from "@/data/projects";
import { DirectionsButton } from "@/components/DirectionsButton";
import ArchitecturalGraphic from "@/components/ArchitecturalGraphic";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/ongoing", label: "Ongoing" },
  { href: "/insights", label: "Insights" },
  { href: "/explore", label: "Location Atlas" },
  { href: "/recommend", label: "Find Your Fit" },
  { href: "/experience", label: "Experience" },
  { href: "/catalogue", label: "Print Catalogue" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand-line bg-brand-surface text-brand-ink">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 top-0 hidden h-full w-[34rem] opacity-[0.16] lg:block"
        aria-hidden="true"
      >
        <ArchitecturalGraphic variant="section" tone="gold" className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-8xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-serif text-3xl font-medium tracking-tight text-brand-ink">
              SRADDHA
            </p>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.38em] text-brand-gold">
              Builders
            </span>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-brand-secondary">
              A partnership firm building with trust since {company.operatingSince}.
              {" "}{pastProjectCount} past project records across Bangalore and an
              ongoing project in Chittoor.
            </p>
            <Link href="/contact" className="btn-gold mt-8 !px-6 !py-3 text-[11px]">
              Get In Touch
            </Link>
          </div>

          <nav aria-label="Footer" className="lg:col-span-1">
            <h3 className="mb-6 text-[10px] uppercase tracking-[0.32em] text-brand-gold">
              Navigate
            </h3>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-sm text-brand-secondary transition-colors duration-200 hover:text-brand-ink"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-1">
            <h3 className="mb-6 text-[10px] uppercase tracking-[0.32em] text-brand-gold">
              Office
            </h3>
            <address className="flex items-start gap-3 text-sm not-italic leading-relaxed text-brand-secondary">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" />
              <span className="space-y-0.5">
                {company.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </address>
            <div className="mt-6">
              <DirectionsButton variant="dark" small />
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-6 text-[10px] uppercase tracking-[0.32em] text-brand-gold">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-brand-secondary">
              <li>
                <a href={`mailto:${company.email}`} className="flex items-center gap-3 transition-colors hover:text-brand-ink">
                  <Mail className="h-4 w-4 text-brand-gold" />
                  {company.email}
                </a>
              </li>
              <li>
                <a href={telHref(company.landline)} className="flex items-center gap-3 transition-colors hover:text-brand-ink">
                  <Phone className="h-4 w-4 text-brand-gold" />
                  {company.landline}
                </a>
              </li>
              {company.phones.map((phone) => (
                <li key={phone}>
                  <a href={telHref(phone)} className="flex items-center gap-3 transition-colors hover:text-brand-ink">
                    <Phone className="h-4 w-4 text-brand-gold" />
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-brand-line pt-8 text-xs text-brand-secondary/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sraddha Builders. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>
              Operating since {company.operatingSince} · {company.operatingLocation}
            </p>
            <Link
              href="/admin/login"
              className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary/50 transition-colors hover:text-brand-gold"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
