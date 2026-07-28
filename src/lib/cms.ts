// CMS content model. Every editable string/image on the landing page lives
// here as a default; rows in Supabase `site_content` override per section.
// Shared by the landing page (server) and the admin editor (client).

import type { CSSProperties } from "react";
import { about, faqs, insights, process, professionalNotice, services, site } from "./content";

/** Portfolio renders paired to each service card, in `services` order. */
const serviceImages = [
  {
    image: "/portfolio/c-house/c-house-02-exterior-view-2.png",
    alt: "C-House — modern two-storey residence exterior",
  },
  {
    image: "/portfolio/the-hearth/the-hearth-kitchen-view-1.png",
    alt: "The Hearth — renovated warm kitchen with rattan cabinetry",
  },
  {
    image: "/portfolio/built-in/built-in-proj-01-view.png",
    alt: "Built-in cabinetry drawn to fit the space exactly",
  },
  {
    image: "/portfolio/capstone/archi-capstone-floor-plan.png",
    alt: "Complete floor plan prepared for permit application",
  },
  {
    image: "/portfolio/tile-co/tile-co-interior-view-1.png",
    alt: "Tile Co. office and showroom — planned within budget",
  },
  {
    image: "/portfolio/the-noir/the-noir-living-view-1.png",
    alt: "The Noir — photoreal 3D visualization of a living room",
  },
];

/**
 * Per-text typography override, editable in the studio. Fonts are locked to
 * the two brand typefaces (Poppins for headings, Lora for body) — no arbitrary
 * fonts can enter the system. Size is clamped to a sane display range.
 */
export type TextStyle = {
  font?: "heading" | "body";
  size?: number;
  italic?: boolean;
};

export const fontOptions = [
  { value: "heading", label: "Poppins (headings)" },
  { value: "body", label: "Lora (body)" },
] as const;

export const FONT_SIZE_MIN = 12;
/** Soft ceiling — large enough for section titles, too small to smash the header. */
export const FONT_SIZE_MAX = 72;

/** Convert a TextStyle into inline CSS. Empty style -> undefined (class defaults win). */
export function textStyle(style?: TextStyle): CSSProperties | undefined {
  if (!style) return undefined;
  const css: CSSProperties = {};
  if (style.font === "heading") css.fontFamily = "var(--font-heading)";
  if (style.font === "body") css.fontFamily = "var(--font-body)";
  if (typeof style.size === "number" && style.size > 0) {
    css.fontSize = `${Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, style.size))}px`;
  }
  if (style.italic !== undefined) css.fontStyle = style.italic ? "italic" : "normal";
  return Object.keys(css).length > 0 ? css : undefined;
}

export const defaultContent = {
  hero: {
    eyebrow: "Architectural & Interior Design · Manila, Philippines",
    line1: site.tagline[0],
    line2: site.tagline[1],
    lede: site.heroLede,
    // Full-bleed hero background — editable in studio via ImageField
    image: "/portfolio/the-noir/the-noir-living-view-1.png",
    secondaryCta: "Start a project",
    // Both tagline lines share Poppins (heading) — architect revision.
    // Title size is fluid (.hero-title clamp); font/italic still apply.
    styles: {
      eyebrow: {} as TextStyle,
      line1: {} as TextStyle,
      line2: {} as TextStyle,
      lede: {} as TextStyle,
    },
  },
  studio: {
    statement:
      "We believe the best spaces begin with listening to the people who will use them — this collection showcases selected architectural and interior design works, from concept to completion.",
    styles: { statement: {} as TextStyle },
    points: [
      {
        label: "Approach",
        text: "We design spaces that are functional, comfortable, and built around your needs.",
      },
      {
        label: "Process",
        text: "Every project begins with understanding how you live, work, and use your space.",
      },
      {
        label: "Promise",
        text: "We'll guide you through every step with clear communication and practical solutions.",
      },
    ],
  },
  work: {
    eyebrow: "Selected Works",
    title: "Projects designed with purpose",
    lede: "Architectural and interior design works — each one shaped by the ideas, process, and thoughtful decisions behind it. Open a project to see every view, drawing, and diagram.",
    styles: { title: {} as TextStyle, lede: {} as TextStyle },
  },
  showcaseNoir: {
    eyebrow: "The Noir · Residential Interior",
    line1: "Every design decision",
    line2: "has a purpose.",
    image: "/portfolio/the-noir/the-noir-living-view-3.png",
    styles: { lines: {} as TextStyle },
  },
  services: {
    eyebrow: "Services",
    title: "Planning a project?",
    lede: "Whether you're building, renovating, or need assistance with permits and costing, we're here to help. Choose the option below that best fits your project and share a few details to help us better understand your vision.",
    notice: professionalNotice,
    styles: { title: {} as TextStyle, lede: {} as TextStyle },
    // Each card carries a portfolio render and a destination — the cost card
    // routes to the estimator, everything else opens the inquiry form.
    items: services.map((service, i) => ({
      ...service,
      image: serviceImages[i]?.image ?? "/portfolio/c-house/c-house-02-exterior-view-2.png",
      imageAlt: serviceImages[i]?.alt ?? service.title,
      href: service.title.toLowerCase().includes("cost") ? "/estimate" : "/#contact",
      ctaLabel: service.title.toLowerCase().includes("cost")
        ? "Get your estimate"
        : "Start a project",
    })),
  },
  estimator: {
    eyebrow: "Cost Guide",
    title: "How much will your home cost to build?",
    lede: "Answer three quick questions — lot size, floors, and the finish level you have in mind — and get a realistic starting figure for your build.",
    ctaLabel: "Get your free estimate",
    note: "Free and no commitment. Takes under a minute.",
    image: "/portfolio/capstone/archi-capstone-exterior-view-1.png",
    styles: { title: {} as TextStyle, lede: {} as TextStyle },
  },
  about: {
    eyebrow: "About the Designer",
    name: "Mariane Gayle Caballero",
    role: "Architectural Designer",
    styles: { name: {} as TextStyle, intro: {} as TextStyle },
    intro: about.intro,
    body: about.body,
    education: about.education,
    awards: about.awards,
    skills: about.skills,
    software: about.software,
  },
  process: {
    eyebrow: "Process",
    title: process.title,
    intro: process.intro,
    image: "/portfolio/capstone/archi-capstone-design-strategy-1.png",
    styles: { title: {} as TextStyle, intro: {} as TextStyle },
    steps: process.steps,
  },
  insights: {
    eyebrow: insights.eyebrow,
    title: insights.title,
    lede: "Good planning is one of the best investments you can make before building. The more prepared you are before construction starts, the smoother your project is likely to be.",
    styles: { title: {} as TextStyle, lede: {} as TextStyle },
    teamMatters: insights.teamMatters,
    mistakes: insights.mistakes,
  },
  faq: {
    eyebrow: "FAQs",
    title: "Answers before you ask",
    lede: "The questions most clients start with — costs, timelines, permits, and what to prepare.",
    styles: { title: {} as TextStyle, lede: {} as TextStyle },
    items: faqs,
  },
  showcaseHearth: {
    eyebrow: "The Hearth · Residential Interior",
    line1: "Design with Purpose.",
    line2: "Build for Life.",
    image: "/portfolio/the-hearth/the-hearth-dining-view-1.png",
    ctaLabel: "Start a project",
    styles: { lines: {} as TextStyle },
  },
  contact: {
    eyebrow: "Let's talk about your project",
    title: "Planning a project? Share a few details — we'll take it from there.",
    lede: "Tell us whether you're building, renovating, or need help with permits and costing. The initial consultation is complimentary — expect a call to discuss your project, free of charge.",
    note: "Helpful to prepare, if available: property details, an estimated budget, and design preferences or inspiration. Don't worry if you don't have everything yet — we can work through it together during the consultation.",
    email: site.contact.email,
    phone: site.contact.phone,
    facebookLabel: site.contact.facebook.label,
    facebookHref: site.contact.facebook.href,
    instagramHandle: site.contact.instagram.handle,
    instagramHref: site.contact.instagram.href,
    styles: { title: {} as TextStyle, lede: {} as TextStyle },
  },
  footer: {
    tagline: "Design with Purpose. Build for Life.",
    styles: { tagline: {} as TextStyle },
  },
};

export type SiteContent = typeof defaultContent;
export type SectionKey = keyof SiteContent;

/** Section labels + descriptions shown in the admin content manager. */
export const sectionMeta: Record<SectionKey, { label: string; description: string }> = {
  hero: { label: "Hero", description: "Full-bleed opening — background image, eyebrow, tagline, lede, and Start a project CTA" },
  studio: { label: "Studio statement", description: "Welcome statement and the three value points" },
  work: { label: "Selected works header", description: "Heading above the project grid" },
  showcaseNoir: { label: "Showcase — The Noir", description: "First full-screen image interlude" },
  services: { label: "Services", description: "Service cards with images and the professional notice" },
  estimator: { label: "Estimator invite", description: "Full-screen cost-guide invitation linking to /estimate" },
  about: { label: "About the designer", description: "Bio, education, awards, skills" },
  process: { label: "Process", description: "The three project steps" },
  insights: { label: "Before you build", description: "Educational cards" },
  faq: { label: "FAQs", description: "Questions and answers" },
  showcaseHearth: { label: "Showcase — The Hearth", description: "Closing full-screen interlude with CTA" },
  contact: { label: "Contact", description: "Contact copy, channels, and form intro" },
  footer: { label: "Footer", description: "Footer tagline" },
};

const TEXT_STYLE_KEYS = new Set(["font", "italic", "size"]);

function isTextStyleShell(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).every((k) => TEXT_STYLE_KEYS.has(k));
}

/**
 * Merge a stored section over its defaults so newly added fields keep working
 * after the schema evolves. Arrays are replaced wholesale (the editor always
 * saves complete arrays); objects merge recursively.
 *
 * Keys removed from the code schema are dropped (so the studio stops showing
 * dead fields). Empty TextStyle shells still accept font / italic / size.
 */
export function mergeSection<T>(defaults: T, stored: unknown): T {
  if (
    typeof defaults !== "object" ||
    defaults === null ||
    Array.isArray(defaults) ||
    typeof stored !== "object" ||
    stored === null ||
    Array.isArray(stored)
  ) {
    return (stored ?? defaults) as T;
  }
  const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const [key, value] of Object.entries(stored as Record<string, unknown>)) {
    if (key in out) {
      out[key] = mergeSection(out[key], value);
    } else if (isTextStyleShell(out) && TEXT_STYLE_KEYS.has(key)) {
      out[key] = value;
    }
    // else: schema no longer has this field — drop it
  }
  return out as T;
}
