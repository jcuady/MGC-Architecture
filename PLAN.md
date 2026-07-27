# MGC Architecture — Website Plan

Single-page portfolio-first landing page. Content sourced from `MGC Architecture/03 Document Files/MGCArchitecture Website Content` (12 pages); visuals governed by `BRANDING.md`.

## 1. Goals

1. **Portfolio-first**: showcase 8 projects with large, warm imagery.
2. **Inquiries second**: a low-friction "Planning a project?" contact path (call, email, socials) — *not* a full-service sales site (per the professional notice).
3. Communicate the brand: minimalist, warm, refined; tagline *Design with Purpose. Build for Life.*

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, TypeScript) | Latest stable; RSC by default, `next/image` optimization (WebP/AVIF), `next/font` for zero-CLS fonts. |
| Styling | **Tailwind CSS v4** | CSS-first `@theme` tokens map 1:1 to the brand palette; no config file needed. |
| Fonts | `next/font/google` — Poppins (400/500/600/700) + Lora (400/700 + italic) | Brand typefaces, self-hosted, no layout shift. |
| Motion | CSS transitions + one tiny `Reveal` component (IntersectionObserver) | Calm 150–300ms reveals per brand; no animation dependency needed for this scope. |
| Images | Portfolio PNGs copied to `public/portfolio`, served via `next/image` | Automatic responsive sizes + modern formats. |
| Deploy | Vercel-ready | Standard Next build. |

No component library — the design system is small and bespoke (see `BRANDING.md` §6).

## 3. Information Architecture (single page)

| # | Section | id | Content source | Key elements |
|---|---|---|---|---|
| 0 | **Header** | — | — | Sticky nav: landscape logo, links (Work, Services, About, Process, FAQ, Contact), CTA "Start a project". |
| 1 | **Hero** | `top` | Tagline + Overview | Full-bleed C House exterior render, "Design with Purpose. Build for Life.", short Lora lede, CTAs (View work / Start a project). Orchestrated load animation. |
| 2 | **Overview strip** | `studio` | "Overview" copy | Welcome statement + 3 quiet stat/value points (Magna Cum Laude, projects, services). |
| 3 | **Selected Works** | `work` | `02 Portfolio` | 8 projects, editorial grid (mixed spans). Card: image, name, category, view count of images. Featured: C House. |
| 4 | **Services** | `services` | "Planning a project?" | Framed as "how we can help": 6 numbered service cards (Architectural Design; Renovation & Remodeling; Cabinetry & Built-In Furniture; Design Documentation & Permit Assistance; Cost Estimation & Budget Planning; 3D Visualization) with sub-scope lists. **Visible Professional Notice** beneath. |
| 5 | **About** | `about` | Personal Bio + Credentials | Portrait-style panel: bio (first-person, warm), education, awards, skills/software tags. Chestnut surface with monogram watermark. |
| 6 | **Process** | `process` | "From Idea to Reality" | 3 steps: Conversation → Design & documents → Permits & construction. Lora narrative + numbered rail (order is real sequence). |
| 7 | **Before You Build** | `insights` | Education section | 2 editorial cards: "Why the right team matters" + "5 mistakes to avoid" (compact list). |
| 8 | **FAQ** | `faq` | FAQs | Accordion (native `<details>`): cost guide (₱/sqm finishes), timeline, property ownership, permit documents, consultation fee, first-meeting prep. |
| 9 | **Contact** | `contact` | Contacts + questionnaire intent | "Planning a project?" panel: mobile, email, Facebook, Instagram + short reassurance copy (free initial consultation). Primary CTA = email; secondary = call. |
| 10 | **Footer** | — | — | Chestnut, stacked logo, nav recap, contacts, tagline, © year. |

> The full multi-step Client Onboarding Questionnaire (content doc pp. 2–10) is intentionally **out of scope for the landing page** — phase 2 as `/inquire` wizard. The Contact section covers inquiry capture meanwhile.

## 4. Portfolio Data

| Project | Category | Hero image | Images |
|---|---|---|---|
| C House | Residential Design | `c-house-01-exterior-view-1` | 9 perspectives (+4 plan PDFs, not shown) |
| Tile Co. Office & Showroom | Commercial Interior | `tile-co-interior-view-1` | 5 interiors |
| The Noir | Residential Interior | `the-noir-living-view-1` | 7 views |
| The Hearth | Residential Interior | `the-hearth-kitchen-view-1` | 6 views |
| Guest Quarter | Residential Interior | `guest-quarter-view-1` | 4 views |
| Architectural Capstone | Institutional / Academic | `archi-capstone-exterior-view-1` | 8 perspectives + 7 diagrams |
| Saro | Concept / Pavilion | `saro-view-1` | 4 perspectives + 2 diagrams |
| Built-In Furnitures | Cabinetry & Furniture | `built-in-proj-01-view` | 3 view+drawing pairs |

Landing page shows the grid with hero image + metadata per project; full galleries are phase 2 (`/work/[slug]`).

## 5. Design Direction (from brand)

- **Canvas**: warm white `#F3F2F2`; alternating beige `#F1E8DE` sections; chestnut `#753627` for hero overlay, about panel, footer.
- **Signature element**: oversized low-opacity MGC monogram watermark on chestnut surfaces (straight from the guideline covers) + hairline-ruled editorial grid.
- **Type**: Poppins headlines with tight leading; Lora body at 1.6–1.7 leading. Uppercase letter-spaced eyebrows.
- **Imagery**: big, warm renders; hover scale inside clipped frames.
- **Corners**: sharp (0–2px) — architectural precision.
- **Motion**: one hero sequence; scroll reveals; `prefers-reduced-motion` respected.

## 6. Quality Bar (pre-delivery checklist)

- [ ] Contrast AA: body ink charcoal on light; warm-white on chestnut; gold used decoratively only.
- [ ] Keyboard: skip link, focus-visible rings, accordion & nav operable; alt text on all portfolio images.
- [ ] Responsive: 360px → 1536px+; mobile-first; no horizontal scroll; touch targets ≥ 44px; mobile nav.
- [ ] Performance: `next/image` everywhere, hero `priority`, below-fold lazy; fonts via `next/font`; zero CLS (aspect ratios reserved).
- [ ] SEO/meta: title, description, OpenGraph image (C House render), favicon set + webmanifest wired.
- [ ] `npm run build` passes clean; page verified in browser at mobile + desktop widths.

## 7. Build Steps

1. Scaffold Next.js 15 + TS + Tailwind v4 in repo root; wire fonts + theme tokens.
2. Copy assets → `public/brand`, `public/portfolio/<slug>/`, favicon set → `public/`.
3. `src/lib/content.ts` — all copy + project/service/FAQ data (single source, no CMS).
4. Components: `Header`, `Hero`, `Studio`, `Work`, `Services`, `About`, `Process`, `Insights`, `Faq`, `Contact`, `Footer`, `Reveal`.
5. Polish pass (motion, responsive, a11y) → build → browser verification.
