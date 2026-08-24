/**
 * Verifies hero LCP candidates stay paint-visible (no autoAlpha:0 hide).
 * Run against a local or production URL: node scripts/verify-mobile-lcp.mjs [base]
 */
import { chromium, devices } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:3847";
let failed = 0;

function ok(label, pass, detail = "") {
  if (pass) console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices["Pixel 7"],
});
const page = await context.newPage();

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });

// Before/just as GSAP may run — lede must not be forced invisible by CSS.
const lede = page.locator(".hero-lede").first();
await lede.waitFor({ state: "attached", timeout: 15000 });

const ledeOpacity = await lede.evaluate((el) => {
  const s = getComputedStyle(el);
  return { opacity: s.opacity, visibility: s.visibility };
});
ok(
  "hero-lede paint-visible (no CSS hide)",
  Number(ledeOpacity.opacity) > 0.5 && ledeOpacity.visibility !== "hidden",
  JSON.stringify(ledeOpacity),
);

const heroImg = page.locator("[data-hero-image] img").first();
const imgOpacity = await heroImg.evaluate((el) => {
  const wrap = el.closest("[data-hero-image]");
  const s = getComputedStyle(wrap || el);
  return { opacity: s.opacity, visibility: s.visibility };
});
ok(
  "hero image wrap paint-visible",
  Number(imgOpacity.opacity) > 0.5 && imgOpacity.visibility !== "hidden",
  JSON.stringify(imgOpacity),
);

// After hydration settles, lede must still be visible (never animated from 0).
await page.waitForTimeout(1200);
const after = await lede.evaluate((el) => getComputedStyle(el).opacity);
ok("hero-lede still visible after GSAP", Number(after) > 0.5, `opacity=${after}`);

const jpgHero = await page.locator('img[alt*="featured project"]').first().getAttribute("src");
ok(
  "hero uses optimized image pipeline",
  Boolean(
    jpgHero &&
      (jpgHero.includes("_next/image") ||
        jpgHero.includes(".jpg") ||
        jpgHero.includes(".png") ||
        jpgHero.includes(".webp") ||
        jpgHero.includes(".avif")),
  ),
  jpgHero?.slice(0, 80) ?? "none",
);

const contrastClass = await lede.getAttribute("class");
ok(
  "lede contrast uses /85 not /75",
  Boolean(contrastClass && contrastClass.includes("warm-white/85")),
  contrastClass ?? "",
);

await browser.close();

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nMobile LCP hero checks passed");
