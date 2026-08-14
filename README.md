# MGC Architecture — Portfolio Website

*Design with Purpose. Build for Life.*

Portfolio-first website for MGC Architecture (Mariane Gayle Caballero, Architectural Designer — Manila, PH), with full project showcases, a booking/inquiry pipeline, and a WordPress-style CMS admin.

## Stack

- **Next.js 15** (App Router, TypeScript, React 19)
- **Tailwind CSS v4** (CSS-first theme tokens mapped to the brand palette)
- **Poppins + Lora** via `next/font` (brand typefaces, zero CLS)
- **GSAP + ScrollTrigger** (`@gsap/react`) — hero load choreography, scroll parallax, full-screen showcase interludes; `prefers-reduced-motion` respected via `gsap.matchMedia()`
- **Supabase** — Postgres (inquiries + CMS content with RLS), Auth (admin login), Storage (CMS image uploads)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3847
npm run build    # production build
```

> Dev/prod local server is pinned to **port 3847** so it never collides with other apps on 3000 or 5173.

Copy `.env.example` to `.env.local` (already done locally). Publishable values only — no secrets in the repo.

## Routes

| Route | What it is |
|---|---|
| `/` | Landing page (ISR, 60s) — every section's text and images come from the CMS with code defaults as fallback |
| `/work/[slug]` | Full project showcase — all renders in an editorial grid, plus a "Drawings & diagrams" process section (8 projects, statically generated) |
| `/studio` | **Secret admin** (not linked anywhere) — SaaS layout with sidebar: Dashboard, Inquiries & Bookings, Site Content |
| `/studio/login` | Admin sign-in (username + password via Supabase Auth) |
| `/api/revalidate` | Auth-guarded — republishes the landing page after a CMS save |

## Admin studio

- **Inquiries & Bookings** — submissions from the landing-page consultation form land in the `inquiries` table; the admin can filter by status (`new → contacted → booked → archived`), keep notes, and delete.
- **Site Content** — every landing-page section is editable like WordPress: text fields, repeatable lists, and image pickers that upload to Supabase Storage (`site` bucket, public read). Saving publishes immediately via on-demand revalidation.
- Security: `/studio` is protected by middleware + a server-side auth check; RLS lets the public *insert* inquiries but only authenticated users read/manage them, and only authenticated users write CMS content.

## Supabase

- Project: `nbdfkhzjmkppoohhjelg` (MGC Architecture)
- Schema: `supabase/migrations/0001_init.sql` (inquiries, site_content, storage bucket + all RLS policies)
- Ops helper: `node scripts/sb-query.mjs <file.sql|sql>` (needs `SB_TOKEN` env var — a Supabase personal access token)

## Inquiry email

Contact (`/contact`) and Inquire (`/inquire`) POST to `/api/inquiries`, which:

1. Saves the row in Supabase `inquiries` (visible in Studio)
2. Emails **mgcarchitectureph@gmail.com** with a branded chestnut/beige HTML template

**Required on Vercel:** `RESEND_API_KEY`, and From on the verified domain:

```bash
INQUIRY_FROM_EMAIL=MGC Architecture <inquiries@mgcarchitecture.com>
INQUIRY_NOTIFY_EMAIL=mgcarchitectureph@gmail.com
```

Do **not** use `onboarding@resend.dev` after the domain is verified — those sends fail in Resend.

```bash
npm run test:inquiry-email   # branding + API wiring (server on :3847)
```

## Studio CMS (Projects, Blog, Content)

| Area | Studio route | Public |
|---|---|---|
| Projects | `/studio/projects` | `/work`, `/work/[slug]` |
| Blog | `/studio/blog` | `/blog`, homepage Latest Articles |
| Site Content | `/studio/content` | Landing sections (Work header copy only; cards under Projects) |
| Finishes | `/studio/finishes` | `/estimate` |

If `blog_posts` / `projects` are missing on Supabase project `nbdfkhzjmkppoohhjelg`, paste [`supabase/migrations/_pending_studio_apply.sql`](supabase/migrations/_pending_studio_apply.sql) into the project’s **SQL Editor** and run it. Public pages keep code fallbacks until those tables exist.

## Verification checks

Contract checks (no credentials):

```bash
npm run test:projects
npm run test:site-content
node scripts/probe-mgc-tables.mjs
node scripts/probe-site-content.mjs
```

End-to-end (dev server on `:3847`; needs Auth user):

```bash
# RLS, CMS write->render->reset, storage upload, inquiry management
STUDIO_EMAIL=... STUDIO_PASSWORD=... node scripts/verify-e2e.mjs

# Admin pages render behind the auth cookie (includes /studio/projects)
STUDIO_EMAIL=... STUDIO_PASSWORD=... npm run test:admin-ui
```

## Project docs

| File | Purpose |
|---|---|
| `BRANDING.md` | Full brand system distilled from the 27-page Brand Identity Guidelines |
| `PLAN.md` | Site architecture, section-by-section content mapping, quality checklist |

## Structure

```
src/
  app/
    page.tsx              landing page (CMS-driven, ISR)
    work/[slug]/          full project showcases (SSG)
    studio/login/         admin sign-in
    studio/(admin)/       dashboard, inquiries, content editor (auth-guarded)
    api/revalidate/       on-demand revalidation after CMS saves
  components/
    sections/             landing sections (take CMS data as props)
    studio/               Sidebar, InquiriesTable, SectionEditor (generic JSON form)
    InquiryForm.tsx       public booking/inquiry form
  lib/
    content.ts            projects (all 58 images), nav, static copy
    cms.ts                CMS defaults + section metadata + merge logic
    cms-server.ts         server-side content loader (Supabase + fallback)
    supabase/             browser + server clients
  middleware.ts           /studio session guard
supabase/migrations/      database schema (source of truth)
public/portfolio/         every render, diagram, and drawing by project slug
```

## Content source

All copy comes from `MGC Architecture/03 Document Files/MGCArchitecture Website Content`; visuals from `MGC Architecture/01 Branding` and `MGC Architecture/02 Portfolio`.
