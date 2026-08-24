/**
 * Hero HD + mobile responsive contract.
 * Static checks always; optional Playwright pass when BASE_URL is up:
 *   node scripts/verify-hero-hd-mobile.mjs [http://127.0.0.1:3847]
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const hero = readFileSync(join(root, "src/components/sections/Hero.tsx"), "utf8");
const showcase = readFileSync(join(root, "src/components/Showcase.tsx"), "utf8");
const nextCfg = readFileSync(join(root, "next.config.ts"), "utf8");
const cms = readFileSync(join(root, "src/lib/cms.ts"), "utf8");
const css = readFileSync(join(root, "src/app/globals.css"), "utf8");
const hd = readFileSync(join(root, "src/lib/portfolio-hd.ts"), "utf8");

check("hero quality ≥ 90", /quality=\{90\}/.test(hero) || /quality=\{9\d\}/.test(hero));
check("hero uses portfolioHdSrc", hero.includes("portfolioHdSrc"));
check("hero sizes 100vw", hero.includes('sizes="100vw"'));
check("showcase quality ≥ 85", /quality=\{8[5-9]\}/.test(showcase) || /quality=\{9\d\}/.test(showcase));
check("showcase uses portfolioHdSrc", showcase.includes("portfolioHdSrc"));
check("deviceSizes includes 1280+ for retina", nextCfg.includes("1280") && nextCfg.includes("2048"));
check("cms hero default is PNG", cms.includes("the-noir-living-view-1.png"));
check("cms showcaseNoir default is PNG", cms.includes("the-noir-bedroom-view-1.png"));
check("hero-lede ≥ 1rem clamp", /hero-lede[\s\S]*?clamp\(1rem/.test(css));
check("portfolioHdSrc swaps jpg→png", hd.includes(".png") && hd.includes("jpe?g"));
check(
  "PNG sources on disk",
  existsSync(join(root, "public/portfolio/the-noir/the-noir-living-view-1.png")) &&
    existsSync(join(root, "public/portfolio/the-noir/the-noir-bedroom-view-1.png")),
);

const BASE = process.argv[2];
if (BASE) {
  const { chromium, devices } = await import("playwright");
  const browser = await chromium.launch();
  const viewports = [
    { name: "iPhone SE", ...devices["iPhone SE"] },
    { name: "iPhone 15", ...devices["iPhone 15"] },
    { name: "Pixel 7", ...devices["Pixel 7"] },
  ];

  for (const device of viewports) {
    const context = await browser.newContext(device);
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });

    const metrics = await page.evaluate(() => {
      const section = document.querySelector(".hero-stage");
      const img = document.querySelector("[data-hero-image] img");
      const cta = document.querySelector("[data-hero-cta] a");
      const lede = document.querySelector(".hero-lede");
      if (!section || !img || !cta || !lede) return null;
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      const ctaBox = cta.getBoundingClientRect();
      const ledeSize = parseFloat(getComputedStyle(lede).fontSize);
      const src = img.getAttribute("src") || "";
      const q = Number(new URL(src, location.origin).searchParams.get("q") || 0);
      const w = Number(new URL(src, location.origin).searchParams.get("w") || 0);
      return {
        overflow,
        ctaH: ctaBox.height,
        ctaW: ctaBox.width,
        ledeSize,
        q,
        w,
        src: src.slice(0, 120),
      };
    });

    check(`${device.name}: hero rendered`, !!metrics);
    if (metrics) {
      check(`${device.name}: no horizontal overflow`, !metrics.overflow);
      check(`${device.name}: CTA ≥ 44px`, metrics.ctaH >= 44 && metrics.ctaW >= 44);
      check(`${device.name}: lede ≥ 16px`, metrics.ledeSize >= 15.5);
      check(`${device.name}: image q ≥ 85`, metrics.q >= 85, `q=${metrics.q}`);
      check(
        `${device.name}: image width ≥ 750`,
        metrics.w >= 750,
        `w=${metrics.w} ${metrics.src}`,
      );
    }
    await context.close();
  }
  await browser.close();
} else {
  console.log("\nSKIP live viewport matrix — pass a BASE_URL to run Playwright checks.");
}

console.log(failures === 0 ? "\nHERO HD MOBILE OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
