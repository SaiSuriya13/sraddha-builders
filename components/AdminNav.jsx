"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, ExternalLink, Inbox, Lock, LogOut } from "lucide-react";

const links = [
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      /* clear the client view regardless */
    }
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-brand-line bg-brand-surface text-brand-ink">
      <div className="mx-auto flex max-w-8xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex items-center justify-between gap-6">
          <Link href="/admin/enquiries" className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold tracking-tight">
              SRADDHA
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-brand-gold">
              Admin
            </span>
          </Link>
          <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-brand-secondary">
            <Lock className="h-3 w-3 text-brand-gold" />
            Server protected
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-1" aria-label="Admin">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? "bg-brand-bg/10 text-brand-gold"
                    : "text-brand-secondary hover:text-brand-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] text-brand-secondary transition-colors hover:text-brand-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Site
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-brand-line px-3.5 py-2 text-[11px] uppercase tracking-[0.16em] text-brand-secondary transition-colors hover:border-brand-gold hover:text-brand-ink disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            {busy ? "Signing out…" : "Sign out"}
          </button>
        </nav>
      </div>
    </header>
  );
}
