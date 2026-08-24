/**
 * Prefer lossless PNG siblings for portfolio hero/showcase sources.
 * Studio may still store .jpg; on-disk PNGs are the HD encode source.
 */
export function portfolioHdSrc(src: string | null | undefined, fallback: string): string {
  const value = (src || fallback).trim();
  if (!value.startsWith("/portfolio/")) return value || fallback;
  if (/\.jpe?g$/i.test(value)) return value.replace(/\.jpe?g$/i, ".png");
  return value;
}
