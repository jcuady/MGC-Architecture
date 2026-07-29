/**
 * Map ScrollTrigger progress (0–1) → chapter index.
 * Seam: public sync logic for Insights locked scroll (counter ↔ card).
 */
export function chapterIndexFromProgress(progress: number, count: number): number {
  if (count <= 0) return 0;
  const p = Math.min(1, Math.max(0, progress));
  if (p >= 1) return count - 1;
  return Math.min(count - 1, Math.floor(p * count));
}

export function chapterLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}
