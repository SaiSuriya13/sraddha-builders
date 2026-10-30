"use client";

import { Phone, Mail, MessageCircle } from "lucide-react";
import { company, telHref, whatsappLink } from "@/data/company";

// Call / Email / WhatsApp action buttons.
// WhatsApp only renders if NEXT_PUBLIC_WHATSAPP_NUMBER is configured —
// never a broken link.
export function ContactActions({ size = "md", message = "" }) {
  const wa = whatsappLink(
    message || "Hello Sraddha Builders, I would like to make an enquiry."
  );

  const cls =
    size === "lg"
      ? "px-8 py-4 text-[13px]"
      : "px-5 py-3 text-[12px]";

  const base =
    "inline-flex items-center justify-center gap-2.5 border border-current uppercase tracking-[0.18em] font-medium transition-all duration-300";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={telHref(company.phones[0])}
        className={`${base} ${cls} border-brand-line hover:border-brand-gold hover:text-brand-gold`}
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <a
        href={`mailto:${company.email}?subject=Enquiry`}
        className={`${base} ${cls} border-brand-line hover:border-brand-gold hover:text-brand-gold`}
      >
        <Mail className="h-4 w-4" />
        Email
      </a>
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${cls} bg-brand-gold border-brand-gold text-brand-bg hover:bg-brand-bronze hover:border-brand-bronze`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}