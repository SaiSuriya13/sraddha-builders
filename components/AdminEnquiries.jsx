"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Wifi,
  WifiOff,
} from "lucide-react";
import { findProject } from "@/data/projects";
import { enquiryStatuses } from "@/data/insights";
import { formatDateTime } from "@/lib/format";

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const STATUS_STYLES = {
  new: "border-brand-gold/50 bg-brand-gold/10 text-brand-bronze",
  contacted: "border-brand-line bg-brand-line/5 text-brand-ink",
  closed: "border-brand-line bg-transparent text-brand-secondary/70",
};

function projectLabel(slug) {
  if (!slug) return "—";
  const project = findProject(slug);
  return project ? project.name : slug;
}

export function AdminEnquiries({
  initial = [],
  dbReady = true,
  dbError = "",
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [live, setLive] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState("");

  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      if (!dbReady) return;
      if (!silent) setRefreshing(true);
      try {
        const res = await fetch("/api/admin/enquiries", {
          cache: "no-store",
        });
        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Could not refresh enquiries.");
        }
        setItems(data.enquiries || []);
        setError("");
        setLastSync(new Date());
      } catch (err) {
        setError(err?.message || "Could not refresh enquiries.");
      } finally {
        if (!silent) setRefreshing(false);
      }
    },
    [dbReady, router]
  );

  useEffect(() => {
    if (!live || !dbReady) return undefined;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh({ silent: true });
      }
    }, 20_000);
    return () => window.clearInterval(timer);
  }, [live, dbReady, refresh]);

  const counts = useMemo(() => {
    const base = { all: items.length, new: 0, contacted: 0, closed: 0 };
    for (const item of items) {
      if (base[item.status] !== undefined) base[item.status] += 1;
    }
    return base;
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        item.name.toLowerCase().includes(needle) ||
        item.email.toLowerCase().includes(needle) ||
        item.phone.toLowerCase().includes(needle) ||
        item.message.toLowerCase().includes(needle) ||
        item.interestedProject.toLowerCase().includes(needle) ||
        projectLabel(item.interestedProject).toLowerCase().includes(needle)
      );
    });

    return [...list].sort((a, b) => {
      const delta = new Date(b.createdAt) - new Date(a.createdAt);
      return sort === "newest" ? delta : -delta;
    });
  }, [items, query, statusFilter, sort]);

  async function updateStatus(id, status) {
    const previous = items.find((item) => item.id === id)?.status;
    if (!previous || previous === status) return;

    setUpdatingId(id);
    setError("");
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );

    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        throw new Error(data?.error || "Could not update the enquiry.");
      }
    } catch (err) {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: previous } : item
        )
      );
      setError(err?.message || "Could not update the enquiry.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      {!dbReady ? (
        <div className="border border-brand-bronze/40 bg-brand-card p-5 text-sm leading-relaxed text-brand-ink">
          <p className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 text-brand-bronze" />
            Database not connected
          </p>
          <p className="mt-2 text-brand-secondary">
            Set <code className="text-brand-ink">DATABASE_URL</code> in the
            server environment, then run{" "}
            <code className="text-brand-ink">npm run db:push</code> to
            create the enquiries table. The public enquiry form is already
            configured to fail gracefully until then.
          </p>
          {dbError ? (
            <p className="mt-2 text-xs text-brand-bronze">{dbError}</p>
          ) : null}
        </div>
      ) : null}

      {dbReady && dbError ? (
        <div
          className="mb-5 flex items-start gap-3 border border-brand-bronze/40 bg-brand-card p-4 text-sm text-brand-ink"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-bronze" />
          <span>{dbError}</span>
        </div>
      ) : null}

      {error ? (
        <div
          className="mb-5 flex items-start gap-3 border border-brand-bronze/40 bg-brand-card p-4 text-sm text-brand-ink"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-bronze" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* summary + sync */}
      <div className="grid grid-cols-2 gap-px border border-brand-line bg-brand-line sm:grid-cols-4">
        {[
          ["All", counts.all],
          ["New", counts.new],
          ["Contacted", counts.contacted],
          ["Closed", counts.closed],
        ].map(([label, value]) => (
          <button
            key={label}
            type="button"
            onClick={() =>
              setStatusFilter(label === "All" ? "all" : label.toLowerCase())
            }
            aria-pressed={
              statusFilter === (label === "All" ? "all" : label.toLowerCase())
            }
            className={`bg-brand-card p-5 text-left transition-colors hover:bg-brand-bg ${
              statusFilter === (label === "All" ? "all" : label.toLowerCase())
                ? "ring-1 ring-inset ring-brand-gold/60"
                : ""
            }`}
          >
            <p className="font-serif text-3xl font-medium text-brand-ink">
              {value}
            </p>
            <p className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-brand-secondary">
              {label}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-secondary" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, email, project"
            aria-label="Search enquiries"
            className="w-full border border-brand-line bg-transparent py-2.5 pl-10 pr-4 text-sm text-brand-ink placeholder:text-brand-secondary/70 focus:border-brand-gold focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort enquiries"
            className="border border-brand-line bg-transparent px-3 py-2.5 text-[11px] uppercase tracking-[0.14em] text-brand-ink focus:border-brand-gold focus:outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          <button
            type="button"
            onClick={() => setLive((current) => !current)}
            aria-pressed={live}
            className={`inline-flex items-center gap-2 border px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
              live
                ? "border-brand-gold/50 text-brand-bronze"
                : "border-brand-line text-brand-secondary"
            }`}
          >
            {live ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {live ? "Live · 20s" : "Paused"}
          </button>

          <button
            type="button"
            onClick={() => refresh()}
            disabled={refreshing || !dbReady}
            className="inline-flex items-center gap-2 border border-brand-line px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] text-brand-ink transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
        <p aria-live="polite">
          {filtered.length} shown · {items.length} total
        </p>
        <p>{lastSync ? `Synced ${formatDateTime(lastSync)}` : "Server snapshot loaded"}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 border border-dashed border-brand-line py-20 text-center">
          <Inbox className="mx-auto h-8 w-8 text-brand-secondary/60" />
          <p className="mt-4 font-serif text-2xl font-medium text-brand-ink">
            {items.length === 0 ? "No enquiries yet." : "No matching enquiries."}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-brand-secondary">
            {items.length === 0
              ? "New submissions from the public contact form will appear here."
              : "Try a different search term or status filter."}
          </p>
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className="mt-8 hidden overflow-x-auto border border-brand-line lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-brand-line bg-brand-card">
                  {["Received", "Contact", "Project", "Message", "Status", "Update"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-brand-secondary"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-brand-line align-top last:border-b-0"
                  >
                    <td className="w-32 px-4 py-4 text-[11px] leading-relaxed text-brand-secondary">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="w-52 px-4 py-4">
                      <p className="text-sm font-medium text-brand-ink">
                        {item.name}
                      </p>
                      <a
                        href={`tel:${item.phone.replace(/[\s()-]/g, "")}`}
                        className="mt-1 flex items-center gap-1.5 text-[11px] text-brand-secondary hover:text-brand-gold"
                      >
                        <Phone className="h-3 w-3" />
                        {item.phone}
                      </a>
                      {item.email ? (
                        <a
                          href={`mailto:${item.email}`}
                          className="mt-1 flex items-center gap-1.5 break-all text-[11px] text-brand-secondary hover:text-brand-gold"
                        >
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          {item.email}
                        </a>
                      ) : (
                        <span className="mt-1 flex items-center gap-1.5 text-[11px] text-brand-secondary/60">
                          <Mail className="h-3 w-3" />
                          No email provided
                        </span>
                      )}
                    </td>
                    <td className="w-40 px-4 py-4 text-[11px] leading-relaxed text-brand-ink">
                      {projectLabel(item.interestedProject)}
                    </td>
                    <td className="px-4 py-4 text-[12px] leading-relaxed text-brand-secondary">
                      {item.message || "—"}
                    </td>
                    <td className="w-28 px-4 py-4">
                      <span
                        className={`inline-block border px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${
                          STATUS_STYLES[item.status] || STATUS_STYLES.new
                        }`}
                      >
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td className="w-48 px-4 py-4">
                      <StatusButtons
                        current={item.status}
                        busy={updatingId === item.id}
                        onChange={(status) => updateStatus(item.id, status)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile cards */}
          <ul className="mt-8 space-y-4 lg:hidden">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="border border-brand-line bg-brand-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-xl font-medium text-brand-ink">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-brand-secondary">
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-block border px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${
                      STATUS_STYLES[item.status] || STATUS_STYLES.new
                    }`}
                  >
                    {STATUS_LABELS[item.status] || item.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-brand-secondary">
                  <a href={`tel:${item.phone.replace(/[\s()-]/g, "")}`} className="hover:text-brand-gold">
                    {item.phone}
                  </a>
                  {item.email ? (
                    <a href={`mailto:${item.email}`} className="break-all hover:text-brand-gold">
                      {item.email}
                    </a>
                  ) : (
                    <span>No email provided</span>
                  )}
                </div>

                <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-brand-gold">
                  {projectLabel(item.interestedProject)}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-brand-secondary">
                  {item.message || "—"}
                </p>

                <div className="mt-4 border-t border-brand-line pt-3">
                  <StatusButtons
                    current={item.status}
                    busy={updatingId === item.id}
                    onChange={(status) => updateStatus(item.id, status)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function StatusButtons({ current, busy, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {enquiryStatuses.map((status) => {
        const active = current === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            disabled={active || busy}
            aria-pressed={active}
            className={`inline-flex items-center gap-1 border px-2 py-1.5 text-[9px] uppercase tracking-[0.12em] transition-colors ${
              active
                ? "border-brand-gold bg-brand-gold/10 text-brand-bronze"
                : "border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
            } disabled:cursor-default`}
          >
            {active ? <CheckCircle2 className="h-3 w-3" /> : null}
            {STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}
