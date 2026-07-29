/** Process phase index from scroll progress (same contract as insights chapters). */
export function phaseIndexFromProgress(progress: number, n: number): number {
  if (n <= 0) return 0;
  const p = Math.min(1, Math.max(0, progress));
  if (p >= 1) return n - 1;
  return Math.min(n - 1, Math.floor(p * n));
}

export function phaseLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}
