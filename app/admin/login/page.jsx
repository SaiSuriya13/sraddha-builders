import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminSession } from "@/lib/admin";
import { isAdminConfigured } from "@/lib/session";

export const metadata = { title: "Sign In" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const configured = isAdminConfigured();
  const session = configured ? await getAdminSession() : false;

  const requested =
    typeof params?.next === "string" && params.next.startsWith("/admin")
      ? params.next
      : "/admin/enquiries";

  if (session) redirect(requested);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-brand-surface p-10 text-brand-ink lg:flex lg:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(var(--brand-secondary)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--brand-secondary)) 1px, transparent 1px)",
            backgroundSize: "88px 88px",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="font-serif text-2xl font-semibold tracking-tight">
            SRADDHA
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-gold">
            Builders
          </p>
        </div>

        <div className="relative max-w-md">
          <p className="text-[10px] uppercase tracking-[0.35em] text-brand-gold">
            Restricted area
          </p>
          <h1 className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Enquiry records are private.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-brand-secondary">
            This area is protected on the server. Sessions are signed, stored in
            an HttpOnly cookie and expire automatically. Customer details are
            never included in the public pages or client bundles.
          </p>
          <ul className="mt-8 space-y-3 text-[11px] uppercase tracking-[0.18em] text-brand-secondary/80">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              Server-side session verification
            </li>
            <li className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-brand-gold" />
              No password stored in the browser
            </li>
          </ul>
        </div>

        <p className="relative text-[10px] uppercase tracking-[0.2em] text-brand-secondary/60">
          Sraddha Builders · Admin
        </p>
      </section>

      <section className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-secondary transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>

          <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-brand-gold lg:hidden">
            Sraddha Builders
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium tracking-tight text-brand-ink">
            Admin sign in
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-secondary">
            Use the admin password configured in the server environment.
          </p>

          {!configured ? (
            <div
              className="mt-6 border border-brand-bronze/40 bg-brand-card p-5 text-sm leading-relaxed text-brand-ink"
              role="status"
            >
              <p className="flex items-center gap-2 font-medium">
                <Lock className="h-4 w-4 text-brand-bronze" />
                Admin access is not configured
              </p>
              <p className="mt-2 text-brand-secondary">
                Add these server-only environment variables, then restart:
              </p>
              <ul className="mt-3 space-y-1 text-[12px] text-brand-ink">
                <li>
                  <code>ADMIN_PASSWORD</code> — required, the sign-in password
                </li>
                <li>
                  <code>ADMIN_SESSION_SECRET</code> — recommended, a long random
                  string
                </li>
              </ul>
              <p className="mt-3 text-xs text-brand-secondary">
                Never prefix these with <code>NEXT_PUBLIC_</code>.
              </p>
            </div>
          ) : null}

          {params?.setup ? (
            <p className="mt-4 border-l-2 border-brand-gold pl-4 text-xs leading-relaxed text-brand-secondary">
              The admin area redirected here because the server session could not
              be verified or admin access is not yet configured.
            </p>
          ) : null}

          <AdminLoginForm next={requested} configured={configured} />
        </div>
      </section>
    </main>
  );
}
