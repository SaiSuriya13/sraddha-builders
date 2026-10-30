import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";
import { enquirySummary, enquiriesByDay } from "@/data/insights";
import { findProject } from "@/data/projects";
import { formatNumber } from "@/lib/format";

const STATUS_LABELS = { new: "New", contacted: "Contacted", closed: "Closed" };

// Server-rendered analytics over real enquiry rows. When there are no rows,
// every panel shows an honest empty state rather than fake trends.
export function AdminAnalytics({ rows = [] }) {
  const summary = enquirySummary(rows);
  const days = enquiriesByDay(rows, 14);
  const maxDay = Math.max(...days.map((day) => day.count), 1);

  const projectCounts = new Map();
  for (const row of rows) {
    const key = row.interestedProject || "";
    if (!key) continue;
    projectCounts.set(key, (projectCounts.get(key) || 0) + 1);
  }
  const topProjects = [...projectCounts.entries()]
    .map(([slug, count]) => ({
      slug,
      count,
      name: findProject(slug)?.name || slug,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 6);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-px border border-brand-line bg-brand-line lg:grid-cols-4">
        {[
          ["Total enquiries", summary.total],
          ["New", summary.byStatus.new],
          ["Contacted", summary.byStatus.contacted],
          ["Closed", summary.byStatus.closed],
        ].map(([label, value]) => (
          <div key={label} className="bg-brand-card p-5">
            <p className="font-serif text-4xl font-medium text-brand-ink">
              {formatNumber(value)}
            </p>
            <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-brand-secondary">
              {label}
            </p>
          </div>
        ))}
      </div>

      {summary.total === 0 ? (
        <div className="border border-dashed border-brand-line py-20 text-center">
          <Inbox className="mx-auto h-8 w-8 text-brand-secondary/60" />
          <p className="mt-4 font-serif text-2xl font-medium text-brand-ink">
            No enquiries to analyse yet.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-secondary">
            Analytics are calculated only from real records in the database.
            Once a visitor submits the contact form, the first charts will
            appear here.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-brand-gold"
          >
            Open the public contact page
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <section className="lg:col-span-7" aria-labelledby="enquiries-per-day">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Last 14 Days</p>
                <h2
                  id="enquiries-per-day"
                  className="mt-3 font-serif text-3xl font-medium tracking-tight text-brand-ink"
                >
                  Enquiry volume
                </h2>
              </div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                IST calendar days
              </p>
            </div>

            <div className="mt-8 flex h-48 items-end gap-1.5 border-b border-brand-line pb-0">
              {days.map((day) => {
                const height = `${Math.max(
                  day.count === 0 ? 2 : 8,
                  Math.round((day.count / maxDay) * 100)
                )}%`;
                return (
                  <div
                    key={day.key}
                    className="group relative flex h-full flex-1 items-end"
                    title={`${day.key}: ${day.count} enquiries`}
                  >
                    <div
                      className={`w-full transition-colors ${
                        day.count > 0
                          ? "bg-brand-gold group-hover:bg-brand-bronze"
                          : "bg-brand-line"
                      }`}
                      style={{ height }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.14em] text-brand-secondary">
              <span>{days[0]?.key.slice(8)}/{days[0]?.key.slice(5, 7)}</span>
              <span>Today</span>
            </div>

            <div className="mt-10">
              <p className="eyebrow">Pipeline</p>
              <div className="mt-4 space-y-4">
                {["new", "contacted", "closed"].map((status) => {
                  const value = summary.byStatus[status] || 0;
                  const share = summary.total
                    ? Math.round((value / summary.total) * 100)
                    : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-brand-ink">
                          {STATUS_LABELS[status]}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
                          {value} · {share}%
                        </p>
                      </div>
                      <div className="mt-1.5 h-2 w-full bg-brand-elevated/60">
                        <div
                          className={`h-full ${
                            status === "new"
                              ? "bg-brand-gold"
                              : status === "contacted"
                                ? "bg-brand-line/70"
                                : "bg-brand-secondary"
                          }`}
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-brand-secondary">
                {summary.handled} of {summary.total} enquiries marked contacted
                or closed ({summary.conversion}% handled). This is a workflow
                measure, not a sales conversion rate.
              </p>
            </div>
          </section>

          <section className="lg:col-span-5" aria-labelledby="top-projects">
            <p className="eyebrow">Interest</p>
            <h2
              id="top-projects"
              className="mt-3 font-serif text-3xl font-medium tracking-tight text-brand-ink"
            >
              Projects mentioned
            </h2>

            {topProjects.length === 0 ? (
              <p className="mt-6 border border-dashed border-brand-line p-6 text-sm leading-relaxed text-brand-secondary">
                No enquiry has named a project yet. Enquiries submitted without a
                project selection are recorded but not counted here.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-brand-line border-y border-brand-line">
                {topProjects.map((project) => {
                  const share = Math.round((project.count / summary.total) * 100);
                  return (
                    <li key={project.slug} className="py-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-serif text-lg leading-snug text-brand-ink">
                          {project.name}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-brand-secondary">
                          {project.count}
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-brand-elevated/60">
                        <div
                          className="h-full bg-brand-gold"
                          style={{ width: `${Math.max(share, 4)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="mt-5 text-[11px] leading-relaxed text-brand-secondary">
              Counts refer to the number of enquiries naming each record. They do
              not imply availability, demand or sales performance.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
