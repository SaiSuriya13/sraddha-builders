import { desc } from "drizzle-orm";
import { AdminEnquiries } from "@/components/AdminEnquiries";
import { getDb } from "@/db";
import { enquiries } from "@/db/schema";

export const metadata = { title: "Enquiries" };
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

export default async function AdminEnquiriesPage() {
  const db = getDb();

  if (!db) {
    return (
      <div>
        <h1 className="font-serif text-4xl font-medium tracking-tight text-brand-ink">
          Enquiries
        </h1>
        <p className="mt-2 text-sm text-brand-secondary">
          Customer submissions from the public contact form.
        </p>
        <div className="mt-8">
          <AdminEnquiries initial={[]} dbReady={false} dbError="" />
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
      .limit(300);
  } catch (error) {
    console.error("[admin/enquiries page] read failed", error);
    dbError =
      "The database is configured but could not be read. Run npm run db:push if the enquiries table does not exist yet.";
  }

  return (
    <div>
      <h1 className="font-serif text-4xl font-medium tracking-tight text-brand-ink">
        Enquiries
      </h1>
      <p className="mt-2 text-sm text-brand-secondary">
        Customer submissions from the public contact form, newest first. Data is
        rendered on the server and never exposed publicly.
      </p>
      <div className="mt-8">
        <AdminEnquiries
          initial={rows.map(serialize)}
          dbReady={true}
          dbError={dbError}
        />
      </div>
    </div>
  );
}
