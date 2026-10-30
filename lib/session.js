// Edge-safe session helpers (Web Crypto only — no Node APIs, no dependencies).
//
// The admin area is protected server-side:
//   - middleware verifies this signed, HttpOnly cookie on every /admin and
//     /api/admin request;
//   - API routes verify the same cookie again (defence in depth);
//   - the protected admin layout verifies it a third time before rendering.
//
// Secrets never reach the browser: only a signed token is stored in an
// HttpOnly cookie.

export const SESSION_COOKIE = "sb_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret() {
  // ADMIN_SESSION_SECRET is preferred so rotating the password does not
  // invalidate existing sessions unless intended.
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && getSecret());
}

const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalised = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded =
    normalised + "=".repeat((4 - (normalised.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payload, secret) {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return toBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

async function sha256(value) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", encoder.encode(value))
  );
}

/**
 * Compare a submitted password against the configured ADMIN_PASSWORD.
 * Both sides are hashed first so the comparison does not leak length or
 * timing information about the stored value.
 */
export async function verifyPassword(submitted, expected) {
  if (typeof submitted !== "string" || typeof expected !== "string") {
    return false;
  }
  if (!submitted || !expected) return false;
  const [a, b] = await Promise.all([sha256(submitted), sha256(expected)]);
  if (a.length !== b.length) return false;
  return constantTimeEqual(toBase64Url(a), toBase64Url(b));
}

/** Create a signed session token. Returns null when admin is not configured. */
export async function createSessionToken(ttlSeconds = SESSION_TTL_SECONDS) {
  const secret = getSecret();
  if (!secret) return null;
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        v: 1,
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
        nonce: toBase64Url(crypto.getRandomValues(new Uint8Array(12))),
      })
    )
  );
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

/** Verify a session token's signature and expiry. */
export async function verifySessionToken(token) {
  const secret = getSecret();
  if (!secret || typeof token !== "string" || !token.includes(".")) {
    return false;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  try {
    const expected = await sign(payload, secret);
    if (!constantTimeEqual(signature, expected)) return false;

    const data = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload))
    );
    if (!data || typeof data.exp !== "number") return false;
    return data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
