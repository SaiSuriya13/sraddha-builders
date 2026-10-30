"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { allProjects } from "@/data/projects";
import { company } from "@/data/company";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+]?[0-9][0-9\s()-]{6,17}$/;

function validate({ name, phone, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please enter your name.";
  else if (name.trim().length < 2) errors.name = "Name is too short.";
  if (!phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!PHONE_RE.test(phone.trim())) errors.phone = "Enter a valid phone number (7–18 digits).";
  if (!email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email address.";
  if (message && message.trim().length > 1500) errors.message = "Message must be under 1500 characters.";
  return errors;
}

// Customer enquiry form. Submits to POST /api/enquiries which persists the
// lead in Neon Postgres and sends a Resend notification to the firm.
export function EnquiryForm({ preselectedSlug = "", initialMessage = "" }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interestedProject: preselectedSlug,
    message: initialMessage.slice(0, 1500),
    website: "", // honeypot — humans leave it empty
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState("");

  // Re-sync the select if the user lands with a different ?project= query
  // after the page is already mounted (rare, but safe).
  const handleProjectFocus = (e) => {
    if (form.interestedProject === "" && preselectedSlug) {
      setForm((f) => ({ ...f, interestedProject: preselectedSlug }));
    }
    void e;
  };

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErrors({});
    setServerMessage("");

    // honeypot
    if (form.website) {
      setStatus("success");
      setServerMessage("Thank you. Your enquiry has been received.");
      return;
    }

    const v = validate(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      setStatus("error");
      setServerMessage("Please correct the highlighted fields.");
      return;
    }

    setStatus("submitting");
    try {
      const submittedAt = Date.now();
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        setServerMessage("Thank you. Your enquiry has been received.");
        setForm({
          name: "",
          phone: "",
          email: "",
          interestedProject: preselectedSlug,
          message: initialMessage.slice(0, 1500),
          website: "",
        });
      } else {
        setStatus("error");
        setServerMessage(
          data?.error ||
            "We couldn't submit your enquiry right now. Please try again or contact us directly."
        );
      }
    } catch {
      setStatus("error");
      setServerMessage(
        "We couldn't submit your enquiry right now. Please try again or contact us directly."
      );
    }
  }

  const inputCls = (key) =>
    `w-full border bg-transparent px-4 py-3.5 text-sm text-brand-ink transition-colors placeholder:text-brand-secondary/60 focus:outline-none ${
      errors[key]
        ? "border-brand-bronze"
        : "border-brand-line focus:border-brand-gold"
    }`;

  return (
    <div className="border border-brand-line bg-brand-card p-6 sm:p-10">
      <h3 className="font-serif text-2xl font-medium tracking-tight text-brand-ink">
        Submit an Enquiry
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
        Your details are sent securely to Sraddha Builders.
      </p>

      {status === "success" ? (
        <div className="mt-8 border border-brand-gold/40 bg-brand-bg p-8 text-center" role="status">
          <CheckCircle2 className="mx-auto h-10 w-10 text-brand-gold" />
          <p className="mt-4 font-serif text-xl font-medium text-brand-ink">
            {serverMessage}
          </p>
          <p className="mt-2 text-sm text-brand-secondary">
            You can also reach us at{" "}
            <a href={`mailto:${company.email}`} className="text-brand-gold underline">
              {company.email}
            </a>{" "}
            or call {company.phones[0]}.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary">
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Your full name"
                aria-invalid={!!errors.name}
                className={inputCls("name")}
              />
              {errors.name && <p className="mt-1.5 text-xs text-brand-bronze" role="alert">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary">
                Phone *
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="10-digit mobile number"
                aria-invalid={!!errors.phone}
                className={inputCls("phone")}
              />
              {errors.phone && <p className="mt-1.5 text-xs text-brand-bronze" role="alert">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@email.com"
              aria-invalid={!!errors.email}
              className={inputCls("email")}
            />
            {errors.email && <p className="mt-1.5 text-xs text-brand-bronze" role="alert">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="project" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary">
              Interested Project
            </label>
            <select
              id="project"
              value={form.interestedProject}
              onChange={set("interestedProject")}
              onFocus={handleProjectFocus}
              className={`${inputCls("interestedProject")} appearance-none bg-transparent`}
            >
              <option value="">Select a project (optional)</option>
              {allProjects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — {p.locality}, {p.city} ({p.units} Flats)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={form.message}
              onChange={set("message")}
              placeholder="Anything you'd like us to know (optional)"
              aria-invalid={!!errors.message}
              className={inputCls("message")}
            />
            {errors.message && <p className="mt-1.5 text-xs text-brand-bronze" role="alert">{errors.message}</p>}
          </div>

          {/* honeypot — hidden from users, bots fill it */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set("website")}
            />
          </div>

          {status === "error" && serverMessage ? (
            <div className="flex items-start gap-3 border border-brand-bronze/40 bg-brand-bg p-4 text-sm text-brand-ink" role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-bronze" />
              <span>{serverMessage}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary w-full !justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending enquiry...
              </>
            ) : (
              "Send Enquiry"
            )}
          </button>

          <p className="text-xs leading-relaxed text-brand-secondary">
            Prefer to talk now? Call{" "}
            <a href={`tel:${company.phones[0].replace(/\s/g, "")}`} className="text-brand-gold">
              {company.phones[0]}
            </a>{" "}
            or{" "}
            <a href={`mailto:${company.email}`} className="text-brand-gold">
              {company.email}
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}