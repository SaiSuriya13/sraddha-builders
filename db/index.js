import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export { schema };

let cachedDb = null;

/**
 * Returns a configured Drizzle client for Neon Postgres.
 * The client is created lazily and cached for the lifetime of the serverless
 * function so that connection handling stays efficient on Vercel.
 *
 * If DATABASE_URL is not configured, getDb returns null. Callers are expected
 * to handle that case gracefully (e.g. the enquiries API responds with a clear
 * setup message instead of crashing).
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    if (!globalThis.__dbWarned) {
      console.warn(
        "[sraddha-builders] DATABASE_URL is not configured — database features are disabled."
      );
      globalThis.__dbWarned = true;
    }
    return null;
  }

  if (!cachedDb) {
    const sql = neon(process.env.DATABASE_URL);
    cachedDb = drizzle(sql, { schema });
  }
  return cachedDb;
}