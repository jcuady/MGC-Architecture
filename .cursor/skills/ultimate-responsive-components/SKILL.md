---
name: ultimate-responsive-components
description: >-
  Ultimate responsiveness and performance optimization for UI components —
  CSS Grid/Flex layouts, uniform media, safe zones, fluid type, Next.js Image,
  and when NOT to use GSAP pin/horizontal scroll. Use when building or fixing
  sections, cards, grids, carousels, overlapping headings, uneven images,
  mobile/tablet breakpoints, CLS, or component performance on this site.
---

# Ultimate Responsive Components

Use this skill whenever a section, card grid, or media-heavy component must look correct from phone → tablet → desktop, stay fast, and not fight document flow.

**Project context (MGC Architecture):** Next.js App Router, Tailwind v4, brand tokens (`charcoal`, `chestnut`, `gold`, `beige`, `warm-white`), Poppins + Lora, occasional GSAP. Prefer boring layout that holds over clever scroll tricks.

## Done looks like

1. Heading / chrome never overlaps media (normal flow first).
2. Sibling media cells share one aspect-ratio + `object-cover` (equal row).
3. Breakpoints are content-driven: typically **1 → 2 → 4** columns for card catalogs.
4. Safe horizontal inset (`max-w-7xl` + `px-5 sm:px-8 lg:px-10`) — nothing in edge gutters.
5. Touch targets ≥ 44px; reduced motion respected if motion exists.
6. Images use `next/image` with honest `sizes`; no layout shift from missing dimensions/aspect.
7. A small verify script or checklist proves the contract after the change.

## Decision ladder (before writing CSS)

1. **Does this need motion at all?** Content catalogs (blog, finishes, works) → static responsive grid first.
2. **Does a pattern already exist?** Reuse `max-w-7xl` safe zones, card link styles, eyebrow/heading rhythm from nearby sections.
3. **Can Grid/Flex do it?** Prefer CSS Grid for equal columns; Flex for toolbars/CTAs.
4. **Only then** add GSAP — and never pin a section if the pinned viewport can clip headings or unequal cards.

## Layout contracts

### Safe zone shell

```tsx
<div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
  {/* header then content */}
</div>
```

### Responsive card catalog (default)

```tsx
<ul className="mt-10 grid grid-cols-1 items-start gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-7">
  <li className="min-w-0">{/* card */}</li>
</ul>
```

- `items-start` — titles of different lengths don’t stretch siblings oddly.
- `min-w-0` — prevent grid blowout from long words / images.
- Mobile CTA under the grid; desktop CTA in the header row.

### Heading above media (anti-overlap)

- Header and grid are **siblings in normal flow**, not absolute/fixed children competing for the same space.
- Put `relative z-10` on the header and `relative z-0` on the grid only as a belt-and-suspenders guard — **do not** “fix” overlap with z-index alone while cards are absolutely positioned over the title.
- Never put the heading inside a pinned, overflow-clipped, fixed-height flex child that also contains the cards.

### Uniform media

```tsx
<div className="relative aspect-[3/4] w-full overflow-hidden">
  <Image fill className="object-cover" sizes="..." alt="..." />
</div>
```

**Forbidden combo:** `aspect-*` + conflicting `max-h-*` / fluid widths that make the first card taller than the rest.

Use one ratio per collection (`3/4` portraits, `16/10` finish guides, `4/3` galleries). Crop with `object-cover`, don’t stretch.

### Fluid type

```tsx
className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] text-balance"
```

Avoid `whitespace-nowrap` on marketing headlines. Prefer `text-balance` / wrapping.

## GSAP / scroll rules (optimization + stability)

| Do | Don’t |
|----|--------|
| Animate transforms/opacity on a child track | Pin an entire section that must show a multi-line heading + tall cards |
| `matchMedia` + `prefers-reduced-motion` | Ship pin/scrub with no reduced-motion path |
| Kill triggers on cleanup (`useGSAP` / `gsap.context`) | Leave ScrollTriggers alive across route changes |
| Use pin only when content **fits** the pinned viewport | Fake-horizontal scroll for ≤4 cards that fit a 4-col grid |

If a pin causes heading clip, uneven cards, or jank: **delete the pin** and ship the grid. YAGNI wins.

## Next.js Image optimization

- Always set `sizes` to match real breakpoints, e.g. `(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 92vw`.
- `priority` only for LCP candidates (usually first visible card or hero — not every card).
- Prefer WebP/AVIF via Next defaults; keep source assets reasonably compressed in `public/`.
- Remote Supabase images need `remotePatterns` in `next.config.ts` (already configured for this project).

## Performance checklist

- Prefer **server components** when no hooks/GSAP are required (smaller client JS).
- Lazy-load below-fold images (default `next/image` behavior without `priority`).
- Avoid `will-change` permanently; only during active animation if needed.
- Prefer CSS transitions for hover scale on cards over JS tweens.
- Don’t ship duplicate heavy sections (e.g. second pinned “immersive” that repeats the same content).

## Accessibility & interaction

- Whole-card links are fine; keep focus rings visible (`focus-visible:outline` + brand gold).
- Minimum tap height `min-h-11` (44px) on CTAs.
- Preserve heading hierarchy (`h2` section / `h3` cards).
- Decorative gradients: `aria-hidden`.

## Verification (required before claiming done)

Run from repo root after component layout changes:

```bash
npx tsc --noEmit
node scripts/verify-latest-articles-grid.mjs   # when touching Latest Articles
node scripts/verify-annotated-fixes.mjs        # broader UI contracts
```

For a new section, add a tiny `scripts/verify-<section>.mjs` that asserts:

- grid breakpoints present
- no forbidden pin/overlap pattern
- uniform `aspect-[…]` without `max-h-[` fights
- assets exist under `public/`

## Anti-patterns seen in this codebase (do not reintroduce)

1. **Pinned horizontal track** overlapping “Stay up to date…” heading.
2. **First card larger** because `max-h` + variable width broke aspect lock.
3. **Full-bleed card track** ignoring side safe zones (“AVOID ELEMENTS HERE”).
4. **Client island for static grids** — pulling GSAP for a layout CSS can solve.

## Quick recipe: new media section

1. Shell with safe zones.
2. Header (eyebrow + `h2` + optional See all).
3. `ul` CSS grid `1 / 2 / 4` + `items-start`.
4. Card: aspect box → title → excerpt → meta.
5. Mobile-only secondary CTA if header CTA is `sm+`.
6. Verify script + hard refresh at 375 / 768 / 1280 widths.
