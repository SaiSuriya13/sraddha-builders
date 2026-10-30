// Server-only admin helpers (imports next/headers, so this must never be
// imported by middleware or a client component).

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  isAdminConfigured,
  verifySessionToken,
} from "@/lib/session";

/** Read and verify the admin session from the incoming cookie store. */
export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Verify a NextRequest's cookie directly (used by API route handlers). */
export async function isAuthorizedRequest(request) {
  const token = request?.cookies?.get?.(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Redirect unauthenticated visitors away from protected pages. */
export async function requireAdmin(nextPath = "/admin/enquiries") {
  if (!isAdminConfigured()) {
    redirect("/admin/login?setup=1");
  }
  const session = await getAdminSession();
  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
}
