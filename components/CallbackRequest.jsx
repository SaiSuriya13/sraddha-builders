"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { company, telHref } from "@/data/company";

const PHONE_RE = /^[+]?[0-9][0-9\s()-]{6,17}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TIMES = [
  { value: "Any time", label: "Any time" },
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "Evening", label: "Evening" },
];

// Phone-first callback request. Email is optional here (unlike the main
// enquiry form) and is stored only if provided.
export function CallbackRequest({ projectName = "" }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferredTime: "Any time",
    website: "",
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  async function onSubmit(event) {
    event.preventDefault();
    setErrors({});
    setMessage("");

    if (form.website) {
      setStatus("success");
      return;
    }

    const nextErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = "Please enter your name.";
    }
    if (!form.phone.trim() || !PHONE_RE.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number (7–18 digits).";
    }
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address, or leave it blank.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setMessage("Please correct the highlighted fields.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "callback",
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          interestedProject: "",
          message: `Callback request. Preferred time: ${form.preferredTime}.${
            projectName ? ` Interested in ${projectName}.` : ""
          }`,
          website: "",
          submittedAt: Date.now(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        setForm({
          name: "",
          phone: "",
          email: "",
          preferredTime: "Any time",
          website: "",
        });
      } else {
        setStatus("error");
        setMessage(
          data?.error ||
            "We could not record your callback request. Please call us directly."
        );
      }
    } catch {
      setStatus("error");
      setMessage(
        "We could not record your callback request. Please call us directly."
      );
    }
  }

  const input = (key) =>
    `w-full border bg-brand-bg px-4 py-3 text-sm text-brand-ink transition-colors placeholder:text-brand-secondary/60 focus:outline-none ${
      errors[key]
        ? "border-brand-bronze"
        : "border-brand-line focus:border-brand-gold"
    }`;

  return (
    <div className="border border-brand-line bg-brand-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <PhoneCall className="h-5 w-5 text-brand-gold" />
        <h3 className="font-serif text-2xl font-medium tracking-tight text-brand-ink">
          Request a Callback
        </h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-brand-secondary">
        Leave your number and a preferred time. We will call you back on the
        number provided.
      </p>

      {status === "success" ? (
        <div
          className="mt-6 border border-brand-gold/40 bg-brand-bg p-6 text-center"
          role="status"
        >
          <CheckCircle2 className="mx-auto h-8 w-8 text-brand-gold" />
          <p className="mt-3 font-serif text-xl font-medium text-brand-ink">
            Callback request received.
          </p>
          <p className="mt-2 text-sm text-brand-secondary">
            Prefer to speak now? Call{" "}
            <a href={telHref(company.phones[0])} className="text-brand-gold">
              {company.phones[0]}
            </a>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="callback-name"
                className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary"
              >
                Name *
              </label>
              <input
                id="callback-name"
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                className={input("name")}
              />
              {errors.name ? (
                <p className="mt-1.5 text-xs text-brand-bronze" role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="callback-phone"
                className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary"
              >
                Phone *
              </label>
              <input
                id="callback-phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="Number to call"
                aria-invalid={Boolean(errors.phone)}
                className={input("phone")}
              />
              {errors.phone ? (
                <p className="mt-1.5 text-xs text-brand-bronze" role="alert">
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="callback-email"
                className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary"
              >
                Email (optional)
              </label>
              <input
                id="callback-email"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@email.com"
                aria-invalid={Boolean(errors.email)}
                className={input("email")}
              />
              {errors.email ? (
                <p className="mt-1.5 text-xs text-brand-bronze" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="callback-time"
                className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-brand-secondary"
              >
                Preferred time
              </label>
              <select
                id="callback-time"
                value={form.preferredTime}
                onChange={set("preferredTime")}
                className={`${input("preferredTime")} appearance-none`}
              >
                {TIMES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="callback-website">Website</label>
            <input
              id="callback-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set("website")}
            />
          </div>

          {status === "error" && message ? (
            <div
              className="flex items-start gap-3 border border-brand-bronze/40 bg-brand-bg p-4 text-sm text-brand-ink"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-bronze" />
              <span>{message}</span>
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
                Sending request...
              </>
            ) : (
              "Request Callback"
            )}
          </button>

          <p className="text-xs leading-relaxed text-brand-secondary">
            Your number is used only to respond to this request.
          </p>
        </form>
      )}
    </div>
  );
}
