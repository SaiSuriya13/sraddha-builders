"use client";

import { useState } from "react";
import { Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { company, telHref } from "@/data/company";
import { DirectionsButton } from "@/components/DirectionsButton";

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Fallback for browsers or contexts without the Clipboard API.
    try {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

// Office contact card: copy the verified address, call, email, or open
// directions. Address text is never shortened or reworded.
export function OfficeCard({ className = "" }) {
  const [copied, setCopied] = useState(false);

  const address = company.addressLines.join(" ").replace(/\s+/g, " ").trim();

  async function onCopy() {
    const ok = await copyText(address);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div
      className={`border border-brand-line bg-brand-card p-6 sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-brand-line text-brand-gold">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-brand-secondary">
            Registered Office
          </p>
          <address className="mt-3 text-sm not-italic leading-relaxed text-brand-ink">
            {company.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
      </div>

      <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 border border-brand-line px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Address Copied" : "Copy Address"}
        </button>
        <a
          href={telHref(company.phones[0])}
          className="inline-flex items-center justify-center gap-2 border border-brand-line px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
        >
          <Phone className="h-4 w-4" />
          Call Office
        </a>
      </div>

      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
        <a
          href={`mailto:${company.email}`}
          className="inline-flex items-center justify-center gap-2 border border-brand-line px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold"
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
        <div className="[&>a]:w-full [&>a]:justify-center">
          <DirectionsButton small />
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-brand-secondary">
        Address as supplied in the company profile. Directions open in Google
        Maps using the written address, not stored coordinates.
      </p>
    </div>
  );
}
