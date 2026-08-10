/** Residential construction cost estimate — formula from the studio rate sheet. */

export type FinishRate = {
  id: string;
  name: string;
  slug: string;
  description: string;
  rate_per_sqm: number;
  sort_order: number;
  is_active: boolean;
};

/** Floor-area factor: usable building footprint ≈ 60% of lot area. */
export const LOT_COVERAGE = 0.6;

/**
 * Estimated cost = (lotArea × 0.60) × floors × ratePerSqm
 * Matches the studio spreadsheet: 150 sqm × 2 floors × Bare ₱25k = ₱4,500,000.
 */
export function estimateCost(
  lotArea: number,
  floors: number,
  ratePerSqm: number,
): number {
  if (
    !Number.isFinite(lotArea) ||
    !Number.isFinite(floors) ||
    !Number.isFinite(ratePerSqm) ||
    lotArea <= 0 ||
    floors <= 0 ||
    ratePerSqm <= 0
  ) {
    return 0;
  }
  return lotArea * LOT_COVERAGE * floors * ratePerSqm;
}

export function formatPhp(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Studio finish-guide photos keyed by slug (estimator + /estimate gallery). */
export const finishGuideMedia: Record<
  string,
  { image: string; imageAlt: string }
> = {
  bare: {
    image: "/finishes/type-of-finish-bare.png",
    imageAlt:
      "Bare finish home — concrete flooring, unpainted walls, exposed ceiling",
  },
  standard: {
    image: "/finishes/type-of-finish-standard.png",
    imageAlt:
      "Standard finish home — tiled floors, painted walls, aluminum windows",
  },
  premium: {
    image: "/finishes/type-of-finish-premium.png",
    imageAlt:
      "Premium finish home — large-format flooring, wall cladding, glass windows",
  },
  luxury: {
    image: "/finishes/type-of-finish-luxury.png",
    imageAlt:
      "Luxury finish home — stone or wood floors, imported finishes, custom ceiling",
  },
};

/** Offline / empty-DB fallback so the public page never renders blank. */
export const defaultFinishRates: FinishRate[] = [
  {
    id: "default-bare",
    name: "Bare Finish",
    slug: "bare",
    description:
      "A basic bare home with concrete flooring, unpainted concrete walls, minimal windows, and an exposed ceiling.",
    rate_per_sqm: 25000,
    sort_order: 10,
    is_active: true,
  },
  {
    id: "default-standard",
    name: "Standard Finish",
    slug: "standard",
    description:
      "A clean and practical home with tiled flooring, painted walls, standard aluminum-framed windows, and a simple flat ceiling.",
    rate_per_sqm: 35000,
    sort_order: 20,
    is_active: true,
  },
  {
    id: "default-premium",
    name: "Premium Finish",
    slug: "premium",
    description:
      "A refined home with large-format tiles or engineered wood flooring, decorative wall cladding, full-height glass windows, and detailed ceilings.",
    rate_per_sqm: 45000,
    sort_order: 30,
    is_active: true,
  },
  {
    id: "default-luxury",
    name: "Luxury Finish",
    slug: "luxury",
    description:
      "A premium customized home with natural stone or solid wood flooring, imported wall finishes, double-glazed windows, and custom wood or acoustic ceilings.",
    rate_per_sqm: 80000,
    sort_order: 40,
    is_active: true,
  },
];

export function slugifyFinish(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}
