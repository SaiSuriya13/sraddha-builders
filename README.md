# SRADDHA BUILDERS — Website

A premium, production-ready website for **Sraddha Builders**, a Bangalore
partnership firm operating since 1999. Built with the Next.js App Router and
deployable directly to Vercel.

All company and project information comes from the supplied company profile.
The site is **document-driven**: nothing beyond that profile is invented, and
completed projects are presented as an editorial catalogue using schematic
architectural graphics — **not** stock photographs that would misrepresent real
projects.

---

## 1. Project Overview

- **Homepage** — hero, company-at-a-glance, statistics (animated counters),
  introduction, legacy band, project preview, explore-by-location, ongoing
  project, customer-care statement, enquiry CTA.
- **/about** — company introduction, animated firm statistics, full company profile, partners, office address.
- **/projects** — interactive archive of all **29 past project records** with a
  **Smart Project Finder** (guided filters by location and unit range), search
  (name / locality / city), region filters, grid/list views, and a
  **side-by-side project comparison** (compare up to three projects).
  Get Directions actions open Google Maps directly to the verified office
  address.
- **/projects/[slug]** — typography-led detail page per project with an
  “Enquire About This Project” CTA that preselects the project on the contact page.
- **/ongoing** — the current ongoing project **Sri Sai Sradddha** (Chittoor, Apartment, 35 Flats).
- **/catalogue** — the complete archive as an A4 print / PDF document. Every
  record is included and source spellings are preserved.
- **/insights** — calculated intelligence: unit distribution, region split,
  locality concentration and a region → locality → project relationship map.
- **/explore** — a schematic location atlas. Positions follow archive order and
  are explicitly **not** geographic coordinates.
- **/recommend** — a transparent, rule-based shortlist with visible reasons,
  plus an indicative (clearly labelled) home dimension guide.
- **/experience** — an illustrative line-art walkthrough of the firm and a
  two-dimensional room visualiser. No project photographs or real floor plans.
- **/contact** — direct contact (call / email / optional WhatsApp), **Get
  Directions** to the office, an enquiry form and a phone-first callback request.
- **/admin** — server-protected enquiry inbox and analytics (`/admin/login`,
  `/admin/enquiries`, `/admin/analytics`). Disabled unless `ADMIN_PASSWORD` is
  configured.
- **POST /api/enquiries** — serverless route that stores enquiries in Neon
  PostgreSQL and emails a notification via Resend.

### Data fidelity notes
- Source spellings are preserved (e.g. *Sraddha Temple Tress*, *White Field*,
  *B'lore*, *Sraddha LakeFront* vs *Sraddha Lakefront*, *Sraddha Sunnyside* vs
  *Sraddha Sunny side*). Variant rows are separate entries, matching the source.
- Unit totals (`1,273` past / `1,308` including ongoing) are **calculated
  programmatically** from the dataset and labelled as calculated.

### Interactive features
- **Direct Directions** — `Get Directions` buttons open Google Maps to the
  verified office address (constructed from the address alone; no invented
  coordinates). Present on the contact page, footer, and homepage contact CTA.
- **Smart Project Finder** — a guided filter for location and unit range
  (`Any / 1–50 / 51–100 / 100+ flats` — thresholds shown in the UI), with
  staggered animated results and a no-reload reset. Shares its filter state
  with the archive search.
- **Animated project counts** — the statistics section counts up once on
  scroll into view, from data only; reduced-motion users see final values.
- **Project comparison** — visit up to three projects, a sticky tray with the
  selection, and an editorial side-by-side modal (table on desktop, stacked
  cards on mobile). Comparison is React state only — never persisted.

---

## 2. Tech Stack

- **Next.js 15** (App Router) — React 19
- **JavaScript / JSX only** — no TypeScript
- **Tailwind CSS** with a custom brand palette
- **Framer Motion** — subtle, intentional animations
- **Lucide React** — icons
- **PostgreSQL (Neon)** — enquiry storage
- **Drizzle ORM** — typed query builder + schema
- **Resend** — email lead notifications
- **Vercel** — deployment

---

## 3. Local Setup

Requirements: Node.js 18.18+ (Node 20+ recommended).

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env.local
```

### 3.1 Environment variables

| Variable | Purpose | Required for |
| --- | --- | --- |
| `DATABASE_URL` | Neon Postgres connection string | storing enquiries |
| `RESEND_API_KEY` | Resend API key | email notifications |
| `LEAD_NOTIFICATION_EMAIL` | Recipient of new-lead emails (defaults to the company email) | email notifications |
| `EMAIL_FROM` | Verified sender address in Resend (e.g. `Sraddha Builders <mail@yourdomain.com>`) | email notifications |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format without `+`/spaces (e.g. `919845198438`). The WhatsApp button is hidden when empty. | WhatsApp buttons |
| `ADMIN_PASSWORD` | Server-only password for `/admin`. When unset, the admin area responds with a clear 503. | admin area |
| `ADMIN_SESSION_SECRET` | Server-only random string used to sign the admin session cookie (recommended; falls back to `ADMIN_PASSWORD`). | admin sessions |

> **No secrets are exposed to the browser.** `DATABASE_URL`, `RESEND_API_KEY`,
> `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` are server-only. Only
> `NEXT_PUBLIC_WHATSAPP_NUMBER` is public.

### 3.2 Neon database setup

1. Create a project at https://neon.tech and copy the connection string.
2. Set it as `DATABASE_URL` in `.env.local`.
3. Generate and apply the schema (either approach):

```bash
# Option A — generate SQL migrations and apply them
npm run db:generate
npm run db:migrate

# Option B — push schema directly (fastest for getting started)
npm run db:push
```

The migrations are written to `./drizzle/`. The table created is `enquiries`
(id UUID, name, email, phone, interested_project, message, status, created_at).

### 3.3 Resend setup

1. Create a key at https://resend.com/api-keys → `RESEND_API_KEY`.
2. Verify a domain in Resend → keep the default `onboarding@resend.dev` sender
   for testing, or set `EMAIL_FROM` to your verified domain.
3. Set `LEAD_NOTIFICATION_EMAIL` to the address that should receive leads
   (defaults to `sraddhabuilders@gmail.com`).

---

## 4. Running the app

```bash
# Development
npm run dev                 # -> http://localhost:3000

# Production build
npm run build

# Run the production build locally
npm start                   # -> http://localhost:3000

# Lint
npm run lint
```

> The site runs even when `DATABASE_URL` / `RESEND_API_KEY` are missing. The
> contact form and email simply respond with a clear, friendly setup message
> instead of crashing.

---

## 5. Enquiry flow

1. Visitor submits the contact form.
2. `POST /api/enquiries` validates input (server-side), checks a honeypot,
   enforces a minimum submit time, and applies a light per-IP throttle.
3. The enquiry is **stored in Neon Postgres first**; only then is an email
   notification sent (best-effort, non-blocking).
4. The visitor receives a success response.

The `interested_project` field stores the project slug so the lead is actionable.

Callback requests from the contact page reuse the same endpoint with
`kind: "callback"`. Email is optional for callbacks; when omitted an empty
string is stored (the database column is `NOT NULL`). No schema change is
required.

---

## 6. Admin area

The admin area is protected **server-side** — there is no frontend-only gate and
no hardcoded password.

1. Set `ADMIN_PASSWORD` (and preferably `ADMIN_SESSION_SECRET`) as server-only
   environment variables.
2. Sign in at `/admin/login`.
3. Access `/admin/enquiries` (inbox, status updates) and `/admin/analytics`.

How it works:

- `middleware.js` verifies a signed, HttpOnly session cookie on every
  `/admin` and `/api/admin` request.
- The admin API routes verify the same cookie again (defence in depth).
- The protected admin layout verifies it a third time before rendering.
- Session tokens are HMAC-SHA256 signed with Web Crypto, expire after 8 hours,
  and use `Secure` cookies in production.
- Login attempts are lightly throttled per IP.
- Enquiry data is never included in public pages or client bundles.

If `ADMIN_PASSWORD` is not set, the admin area stays disabled and responds with
a clear setup message rather than accepting any default password.

---

## 7. Vercel Deployment

1. Push this folder to a GitHub repository.
2. Import the repo at https://vercel.com/new.
3. Add the environment variables (from `.env.local`) under **Settings → Environment Variables** on Vercel.
4. Deploy — the framework preset automatically detects Next.js.

No server processes, Docker, or databases run on Vercel; the DB lives in Neon
and email goes through Resend.

---

## 8. Project Structure

```
sraddha-builders/
├── app/
│   ├── api/enquiries/route.js    # public enquiry + callback endpoint
│   ├── api/admin/                # admin login / logout / enquiries API
│   ├── admin/                    # login + protected enquiries & analytics
│   ├── projects/[slug]/page.jsx  # dynamic project detail pages
│   ├── catalogue/page.jsx        # A4 print / PDF catalogue
│   ├── insights/page.jsx         # calculated intelligence dashboard
│   ├── explore/page.jsx          # schematic location atlas
│   ├── recommend/page.jsx        # rule-based shortlist + dimension guide
│   ├── experience/page.jsx       # line-art walkthrough + room visualiser
│   ├── about/page.jsx
│   ├── projects/page.jsx
│   ├── ongoing/page.jsx
│   ├── contact/page.jsx
│   ├── layout.jsx
│   ├── globals.css
│   └── page.jsx                  # homepage
├── components/                   # Navbar, Hero, ProjectCard, ProjectGrid,
│                                 # EnquiryForm, admin UI, data visualisations
├── data/
│   ├── company.js                # company-level source data
│   ├── projects.js               # all project rows + calculated stats
│   └── insights.js               # derived analytics, atlas, recommender
├── lib/
│   ├── session.js                # edge-safe signed session helpers
│   ├── admin.js                  # server-side admin guards
│   └── format.js                 # deterministic IST formatters
├── db/
│   ├── schema.js                 # Drizzle schema (enquiries table)
│   └── index.js                  # Neon/Drizzle client (guarded)
├── middleware.js                 # server-side admin gate
├── drizzle/                      # generated SQL migrations
├── .env.example
├── drizzle.config.mjs
├── jsconfig.json
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 9. Updating project data

Everything is data-driven from `data/projects.js`. Add, edit or remove rows in
the `raw` array; search, filters, the project index, and the calculated unit
totals update automatically. `data/company.js` holds firm-level details used
across the site.