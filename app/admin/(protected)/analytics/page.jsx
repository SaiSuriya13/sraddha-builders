import { desc } from "drizzle-orm";
import { AdminAnalytics } from "@/components/AdminAnalytics";
import { getDb } from "@/db";
import { enquiries } from "@/db/schema";

export const metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

function serialize(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email || "",
    phone: row.phone,
    interestedProject: row.interestedProject || "",
    message: row.message || "",
    status: row.status,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : String(row.createdAt),
  };
}

export default async function AdminAnalyticsPage() {
  const db = getDb();

  if (!db) {
    return (
      <div>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-brand-ink">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-brand-secondary">
          Enquiry analytics calculated from real database records.
        </p>
        <div className="mt-8 border border-brand-bronze/40 bg-brand-card p-5 text-sm leading-relaxed text-brand-ink">
          <p className="font-medium">Database not connected</p>
          <p className="mt-2 text-brand-secondary">
            Set <code className="text-brand-ink">DATABASE_URL</code> in the
            server environment, then run{" "}
            <code className="text-brand-ink">npm run db:push</code> to create
            the enquiries table.
          </p>
        </div>
        <div className="mt-10">
          <AdminAnalytics rows={[]} />
        </div>
      </div>
    );
  }

  let rows = [];
  let dbError = "";

  try {
    rows = await db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt))
      .limit(2000);
  } catch (error) {
    console.error("[admin/analytics page] read failed", error);
    dbError =
      "The database is configured but could not be read. Run npm run db:push if the enquiries table does not exist yet.";
  }

  return (
    <div>
      <h1 className="font-serif text-4xl font-medium tracking-tight text-brand-ink">
        Analytics
      </h1>
      <p className="mt-2 text-sm text-brand-secondary">
        Calculated from {rows.length} recorded enquire
        {rows.length === 1 ? "y" : "ies"} in the database.
      </p>

      {dbError ? (
        <p className="mt-4 border border-brand-bronze/40 bg-brand-card p-4 text-sm text-brand-ink">
          {dbError}
        </p>
      ) : null}

      <div className="mt-10">
        <AdminAnalytics rows={rows.map(serialize)} />
      </div>
    </div>
  );
}
