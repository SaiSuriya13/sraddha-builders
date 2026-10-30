import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { enquiries, enquiryStatus } from "@/db/schema";
import { isAuthorizedRequest } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function serialize(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
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

export async function GET(request) {
  if (!(await isAuthorizedRequest(request))) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401, headers: NO_STORE }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      {
        error:
          "DATABASE_URL is not configured, so enquiries cannot be loaded.",
        missing: "DATABASE_URL",
      },
      { status: 503, headers: NO_STORE }
    );
  }

  try {
    const rows = await db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.createdAt))
      .limit(300);

    return NextResponse.json(
      {
        ok: true,
        enquiries: rows.map(serialize),
        fetchedAt: new Date().toISOString(),
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("[admin/enquiries] read failed", error);
    return NextResponse.json(
      { error: "Could not load enquiries from the database." },
      { status: 500, headers: NO_STORE }
    );
  }
}

export async function PATCH(request) {
  if (!(await isAuthorizedRequest(request))) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401, headers: NO_STORE }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400, headers: NO_STORE }
    );
  }

  const id = typeof body?.id === "string" ? body.id.trim() : "";
  const status = typeof body?.status === "string" ? body.status.trim() : "";

  if (!id) {
    return NextResponse.json(
      { error: "An enquiry id is required." },
      { status: 422, headers: NO_STORE }
    );
  }

  if (!Object.values(enquiryStatus).includes(status)) {
    return NextResponse.json(
      { error: "Unknown enquiry status." },
      { status: 422, headers: NO_STORE }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured." },
      { status: 503, headers: NO_STORE }
    );
  }

  try {
    const updated = await db
      .update(enquiries)
      .set({ status })
      .where(eq(enquiries.id, id))
      .returning({ id: enquiries.id, status: enquiries.status });

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404, headers: NO_STORE }
      );
    }

    return NextResponse.json(
      { ok: true, enquiry: updated[0] },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("[admin/enquiries] update failed", error);
    return NextResponse.json(
      { error: "Could not update the enquiry." },
      { status: 500, headers: NO_STORE }
    );
  }
}
