import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  isAdminConfigured,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/session";

export const runtime = "nodejs";

// Small in-process throttle. Not a substitute for a WAF, but it makes
// password guessing impractical on a single serverless instance.
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(key, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

function clearAttempts(key) {
  attempts.delete(key);
}

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin access is not configured. Set ADMIN_PASSWORD (and optionally ADMIN_SESSION_SECRET) in the server environment.",
        missing: "ADMIN_PASSWORD",
      },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password = typeof body?.password === "string" ? body.password : "";

  const valid = await verifyPassword(password, process.env.ADMIN_PASSWORD);
  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Admin session could not be created." },
      { status: 500 }
    );
  }

  clearAttempts(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  response.headers.set("Cache-Control", "no-store");
  return response;
}
