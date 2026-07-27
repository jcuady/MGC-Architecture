# MGC Architecture — Brand System

Source of truth distilled from `MGC Architecture/01 Branding/MGCArchitecture - Brand Identity Guidelines` (27 pages). Every visual decision on the website derives from this document.

## 1. Brand Essence

- **Brand**: MGC Architecture (MGCaballero Architecture) — portfolio of Mariane Gayle Caballero, Architectural Designer (Manila, PH).
- **Tagline**: *Design with Purpose. Build for Life.*
- **Logo concept**: The MGC monogram merges the designer's initials into a bold, angular mark — simple, memorable, legible at distance, deliberately avoiding literal architectural clichés.

### Personality (from guidelines, pp. 11–15)

| Trait | Meaning | Web translation |
|---|---|---|
| **Minimalist** | Clean, intentional, uncluttered. Strong typography, generous white space, bigger visuals. | Large imagery, airy sections, restrained ornamentation. |
| **Warm** | Professional yet welcoming. Earthy tones, natural textures, inviting photography. | Beige/brown surfaces, warm neutrals, human copy. |
| **Refined** | Elegant through precision, not extravagance. | Consistent spacing/alignment, high detail polish, simple well-composed layouts. |

### Tone scale (p. 16)

Leans: slightly **casual**, **friendly**, **minimal**, strongly **approachable**, mid **bold/calm**, strongly **simple**.

### Voice pillars (pp. 17–20)

- **Clear** — direct, honest, simple. Avoid architectural jargon, buzzwords, wordy sentences. *"We design spaces that are functional, comfortable, and built around your needs."*
- **Thoughtful** — intentional, detail-oriented. Avoid generic design statements. *"Every project begins with understanding how you live, work, and use your space."*
- **Reliable** — transparent, dependable. Avoid overpromising, vague timelines. *"We'll guide you through every step with clear communication and practical solutions."*
- **Human** — warm, collaborative. Avoid sounding distant or scripted. *"We believe the best spaces begin with listening to the people who will use them."*

## 2. Color Palette (pp. 6–7)

### Primary — logos, headers/footers, headings, primary buttons, key brand elements

| Token | Hex | Name |
|---|---|---|
| `--color-chestnut` | `#753627` | Chestnut Brown (brand anchor) |
| `--color-warm-white` | `#F3F2F2` | Warm White (page background) |
| `--color-charcoal` | `#2F2A28` | Charcoal (dark surfaces, body ink) |

### Secondary — accents, icons, section backgrounds, highlights

| Token | Hex | Name |
|---|---|---|
| `--color-military` | `#43533D` | Military Green |
| `--color-gold` | `#C89B4B` | Muted Gold |
| `--color-terracotta` | `#A64327` | Terracotta |

### Neutral — backgrounds, borders, dividers, cards, forms

| Token | Hex | Name |
|---|---|---|
| `--color-beige` | `#F1E8DE` | Light Beige |
| `--color-warm-gray` | `#D8D2CC` | Warm Gray |
| `--color-white` | `#FFFFFF` | White |

### Usage rules

- Chestnut on Warm White / Beige = headline + CTA color. White text on Chestnut passes AA for large/bold text; body text on Chestnut uses Warm White at ≥16px.
- Charcoal (`#2F2A28`) is the default body ink on light surfaces (better contrast than chestnut for long text).
- Muted Gold and Terracotta are *accents only* (eyebrows, rules, hover states) — never large text on light backgrounds (contrast).
- Military Green reserved for small highlights/labels; do not mix more than one secondary accent per section.

## 3. Typography (pp. 8–10)

| Role | Face | Weights | Notes |
|---|---|---|---|
| Headings | **Poppins** | Regular 400, SemiBold 600, Bold 700 | Geometric sans; the brand's voice for titles, nav, buttons, labels |
| Body | **Lora** | Regular 400, Bold 700 (+ italics) | Refined serif; long-form copy, descriptions, quotes |

### Web type scale (fluid, 16px base)

- Display / hero: Poppins 600, `clamp(2.5rem, 6vw, 4.5rem)`, tight leading (1.05–1.1), slight negative tracking
- H2 section titles: Poppins 600, `clamp(1.75rem, 3.5vw, 2.75rem)`
- H3 card titles: Poppins 600, 1.125–1.375rem
- Eyebrow/labels: Poppins 500–600, 0.75–0.8125rem, uppercase, letter-spacing 0.12–0.2em, chestnut or gold
- Body: Lora 400, 1rem–1.125rem, line-height 1.6–1.7
- UI/buttons: Poppins 500–600, 0.875–1rem

## 4. Logo System (pp. 3–5, 26–27)

Files live in `public/brand/` (copied from `01 Branding/01 Logo`).

| Variant | Use |
|---|---|
| Landscape lockup (monogram + "mgc architecture") | Header/nav. Charcoal-on-light or white-on-dark versions. |
| Primary stacked (monogram over "architecture") | Footer, hero watermark, social cards |
| Monogram only | Favicon, avatars, watermark, small spaces |

Rules: keep clear space ≈ height of the "a" in wordmark around the logo; never recolor outside palette; never distort; monogram may be used as a low-opacity (4–8%) oversized watermark on chestnut/charcoal surfaces (as in guideline covers).

### Favicon
Complete set exists at `01 Branding/01 Logo/02 Favicon` (`favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, web manifest icons). Ship as-is in `public/` + `site.webmanifest`.

## 5. Art Direction

- Photography/renders: warm natural light, wood/stone/concrete textures, human-centered. Use full-bleed hero imagery and large project cards (minimalist = bigger visuals).
- Texture: subtle leather/paper grain on chestnut surfaces (as in guideline covers) — achieved with low-opacity noise/monogram watermark, never busy patterns.
- Structural devices: thin hairline rules in warm gray, generous section spacing (96–160px desktop), grid-aligned edges.

## 6. Component Rules

| Component | Spec |
|---|---|
| **Buttons (primary)** | Chestnut bg, warm-white Poppins 600 text, generous x-padding, sharp or barely-rounded (2px) corners; hover → terracotta; visible focus ring (gold, 2px offset). |
| **Buttons (ghost)** | 1px chestnut border, chestnut text; hover → chestnut bg + white text. |
| **Nav** | Sticky, warm-white/blur bg, charcoal landscape logo, Poppins links, chestnut active state. Inverts to chestnut bg + white logo when over hero. |
| **Cards** | White or beige bg, no drop shadows (refined = flat + precise), 1px warm-gray border or none, image-first, Poppins title + Lora description. |
| **Section headers** | Uppercase eyebrow (gold/chestnut) + Poppins H2 + optional Lora lede, left-aligned. |
| **Footer** | Chestnut bg, monogram watermark, warm-white text, contact + socials. |
| **Forms** | White inputs on beige section, 1px warm-gray border, chestnut focus border, visible labels (never placeholder-only), errors adjacent to fields. |
| **Accordion (FAQ)** | Hairline dividers, Poppins question, Lora answer, plus/minus indicator. |

## 7. Motion

- Purposeful and calm: 150–300ms ease-out reveals (fade + 12–24px rise) on scroll, staggered ~60–90ms.
- Hero (GSAP): one orchestrated load sequence — slow image scale-settle (≈2s) + masked headline line rise + staggered fades; on scroll, the image parallaxes down while content lifts away (transform-only, scrubbed).
- Full-screen showcases (GSAP ScrollTrigger): image travels ±8% against scroll inside an oversized clipped frame; caption rises once on entry.
- Hover: image scale 1.03–1.05 with overflow hidden; link underline draw-in.
- Always respect `prefers-reduced-motion` — handled via `gsap.matchMedia()`; transforms disabled, content shown immediately.

## 8. Contacts & Social (p. 25)

- Mobile: `09560753154`
- Email: `mgcarchitectureph@gmail.com`
- Facebook: **MGC Architecture** (@mgcarchitecture)
- Instagram: **@mgcarchitectureph**

## 9. About the Designer (pp. 23–24)

- Mariane Gayle Caballero — Architectural Designer.
- BS Architecture, Pamantasan ng Lungsod ng Maynila (2020–2025), **Magna Cum Laude**.
- Awards: Top 1 College Academic Excellence Awardee (2024); Dean's Lister (2020–2025); Best UAPSA National Architecture Week Award – Creatives Head (2024); Best World Architecture Day Celebration Award – Event Head (2022).
- Experience: Architectural Designer (freelance, 2025–present); Architectural Intern — RC Jacinto Construction (2025–present); Graphic & Visual Designer (freelance, 2023–present); Flower Business Owner (2024–present); Architect's Assistant — Cellokey Inc. (2018).
- Skills: Architectural Design & Planning, Construction Documentation & Coordination, CAD Drafting, 3D Modeling/Rendering/Visualization, Graphic Design, Branding & Visual Communication.
- Software: AutoCAD, SketchUp, Revit, Enscape, Adobe Photoshop, MS Office.

## 10. Professional Notice (required)

Must appear visibly within the Services section, worded to keep the site portfolio-first:

> MGC Architecture showcases architectural and interior design work and welcomes project inquiries. For projects requiring a Registered and Licensed Architect's signature and seal, we work in collaboration with a licensed Architect.
