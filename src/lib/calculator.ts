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

/** Offline / empty-DB fallback so the public page never renders blank. */
export const defaultFinishRates: FinishRate[] = [
  {
    id: "default-bare",
    name: "Bare Finish",
    slug: "bare",
    description:
      "Structure complete — walls, roof, and utilities in place, ready for your own finishing touches.",
    rate_per_sqm: 25000,
    sort_order: 10,
    is_active: true,
  },
  {
    id: "default-standard",
    name: "Standard Finish",
    slug: "standard",
    description:
      "Move-in ready with dependable standard materials and clean, simple finishes.",
    rate_per_sqm: 35000,
    sort_order: 20,
    is_active: true,
  },
  {
    id: "default-premium",
    name: "Premium Finish",
    slug: "premium",
    description:
      "Upgraded materials, custom details, and refined fixtures throughout the home.",
    rate_per_sqm: 45000,
    sort_order: 30,
    is_active: true,
  },
  {
    id: "default-luxury",
    name: "Luxury Finish",
    slug: "luxury",
    description:
      "High-end materials, bespoke cabinetry, and designer finishes in every room.",
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
