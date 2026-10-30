"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";

export function AdminLoginForm({ next = "/admin/enquiries", configured = true }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    if (!password) {
      setStatus("error");
      setError("Enter the admin password.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        router.replace(next);
        router.refresh();
      } else {
        setStatus("error");
        setError(data?.error || "Sign in failed.");
      }
    } catch {
      setStatus("error");
      setError("Sign in failed. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="admin-password"
          className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-brand-secondary"
        >
          Admin password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-secondary" />
          <input
            id="admin-password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Enter password"
            disabled={!configured || status === "submitting"}
            className="w-full border border-brand-line bg-brand-bg py-3.5 pl-10 pr-12 text-sm text-brand-ink placeholder:text-brand-secondary/60 focus:border-brand-gold focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShow((current) => !current)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-brand-secondary transition-colors hover:text-brand-ink"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {status === "error" && error ? (
        <div
          className="flex items-start gap-3 border border-brand-bronze/40 bg-brand-card p-4 text-sm text-brand-ink"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-bronze" />
          <span>{error}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!configured || status === "submitting"}
        className="btn-primary w-full !justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>

      <p className="text-[11px] leading-relaxed text-brand-secondary">
        The password is verified on the server and never stored in the browser.
        A signed, HttpOnly session cookie is issued on success and expires after
        eight hours.
      </p>
    </form>
  );
}
