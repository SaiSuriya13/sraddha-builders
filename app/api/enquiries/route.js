import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/db";
import { enquiries } from "@/db/schema";
import { company } from "@/data/company";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+]?[0-9][0-9\s()-]{6,17}$/;
const MIN_SUBMIT_MS = 1500; // humane typing floor — spam bots submit instantly

// Very small in-process throttler (per serverless instance). Good enough to
// slow down casual abuse; not a substitute for a CDN/WAF rate limit.
const bucket = new Map();

function throttled(key) {
  const now = Date.now();
  const hit = bucket.get(key);
  if (!hit || now - hit.windowStart > 60_000) {
    bucket.set(key, { count: 1, windowStart: now });
    return false;
  }
  hit.count += 1;
  return hit.count > 5;
}

function validate(body, { emailOptional = false } = {}) {
  const errors = {};
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || name.length < 2 || name.length > 120) {
    errors.name = "Please enter your name (2-120 characters).";
  }
  if (!phone || !PHONE_RE.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (emailOptional) {
    // Callback requests are phone-first; email is genuinely optional there.
    if (email && (!EMAIL_RE.test(email) || email.length > 200)) {
      errors.email = "Please enter a valid email address, or leave it blank.";
    }
  } else if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    errors.email = "Please enter a valid email address.";
  }
  if (message.length > 1500) {
    errors.message = "Message must be under 1500 characters.";
  }

  return { errors, clean: { name, phone, email, message } };
}

export async function POST(request) {
  // Honeypot + timing check first (cheap, no DB involved).
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  // Honeypot: bots fill the hidden "website" field.
  if (body?.website) {
    return NextResponse.json({ ok: true });
  }

  // Timing check: too fast = bot.
  if (typeof body?.submittedAt === "number" && Date.now() - body.submittedAt < MIN_SUBMIT_MS) {
    return NextResponse.json(
      { error: "Something felt off with that submission. Please try again." },
      { status: 400 }
    );
  }

  // Light per-IP throttling.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (throttled(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const { errors, clean } = validate(body, {
    emailOptional: body?.kind === "callback",
  });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const interestedProject =
    typeof body?.interestedProject === "string"
      ? body.interestedProject.trim()
      : "";
  const isCallback = body?.kind === "callback";

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      {
        error:
          "Our enquiry system is not fully configured yet. Please contact us directly by phone or email.",
        missing: "DATABASE_URL",
      },
      { status: 503 }
    );
  }

  try {
    await db.insert(enquiries).values({
      name: clean.name,
      email: clean.email,
      phone: clean.phone,
      interestedProject: interestedProject || null,
      message: clean.message || null,
      status: "new",
    });
  } catch (err) {
    console.error("[enquiries] database insert failed", err);
    return NextResponse.json(
      {
        error:
          "We couldn't submit your enquiry right now. Please try again or contact us directly.",
      },
      { status: 500 }
    );
  }

  // Email notification (best-effort). A failure here does not fail the lead —
  // the record is already stored.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const recipient = process.env.LEAD_NOTIFICATION_EMAIL || company.email;
      const from = process.env.EMAIL_FROM || "Sraddha Builders <onboarding@resend.dev>";
      await resend.emails.send({
        from,
        to: recipient,
        subject: isCallback
          ? "New Callback Request — Sraddha Builders"
          : "New Customer Enquiry — Sraddha Builders",
        html: buildEmail(clean, interestedProject, isCallback),
      });
    } catch (err) {
      console.error("[enquiries] email notification failed", err);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Thank you. Your enquiry has been received.",
  });
}

function buildEmail({ name, phone, email, message }, interestedProject, isCallback) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #171717;">
      <h2 style="border-bottom: 1px solid #A58A5A; padding-bottom: 12px;">${
        isCallback ? "New Callback Request" : "New Customer Enquiry"
      }</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #6E6A60; width: 140px;">Type:</td><td style="padding: 6px 0; font-weight: 600;">${
          isCallback ? "Callback request" : "Enquiry form"
        }</td></tr>
        <tr><td style="padding: 6px 0; color: #6E6A60; width: 140px;">Name:</td><td style="padding: 6px 0; font-weight: 600;">${safe(name)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6E6A60;">Phone:</td><td style="padding: 6px 0; font-weight: 600;">${safe(phone)}</td></tr>
        <tr><td style="padding: 6px 0; color: #6E6A60;">Email:</td><td style="padding: 6px 0; font-weight: 600;">${safe(email || "—")}</td></tr>
        <tr><td style="padding: 6px 0; color: #6E6A60;">Interested Project:</td><td style="padding: 6px 0; font-weight: 600;">${safe(interestedProject || "—")}</td></tr>
        <tr><td style="padding: 6px 0; color: #6E6A60; vertical-align: top;">Message:</td><td style="padding: 6px 0;">${safe(message || "—")}</td></tr>
        <tr><td style="padding: 6px 0; color: #6E6A60;">Submitted At:</td><td style="padding: 6px 0; font-weight: 600;">${new Date().toLocaleString("en-IN")}</td></tr>
      </table>
    </div>
  `;
}

function safe(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}