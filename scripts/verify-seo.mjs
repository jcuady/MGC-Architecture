/**
 * Verifies production SEO signals on a running local server.
 * Usage: node scripts/verify-seo.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:3847";
const SITE = "https://www.mgcarchitecture.com";
let failed = 0;

function ok(label, pass, detail = "") {
  if (pass) console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  return { res, text };
}

const home = await fetchText("/");
ok("home HTTP 200", home.res.status === 200, `status=${home.res.status}`);
ok(
  "title Brand | keywords",
  /<title>MGC Architecture\s*\|\s*Architectural/i.test(home.text),
  home.text.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "missing",
);
ok(
  "meta description present",
  /name="description"\s+content="[^"]{80,}"/i.test(home.text) ||
    /content="[^"]{80,}"\s+name="description"/i.test(home.text),
);
ok(
  "canonical www",
  home.text.includes(`rel="canonical"`) &&
    home.text.includes(SITE),
);
ok(
  "og:site_name",
  /property="og:site_name"\s+content="MGC Architecture"/i.test(home.text) ||
    /content="MGC Architecture"\s+property="og:site_name"/i.test(home.text),
);
ok(
  "Organization JSON-LD",
  home.text.includes("application/ld+json") &&
    home.text.includes("ProfessionalService") &&
    home.text.includes(SITE),
);
ok(
  "favicon.svg linked or present",
  home.text.includes("favicon.svg") || home.text.includes('rel="icon"'),
);
ok(
  "lang en-PH",
  /<html[^>]*lang="en-PH"/i.test(home.text),
);

const robots = await fetchText("/robots.txt");
ok("robots 200", robots.res.status === 200);
ok(
  "robots sitemap www",
  robots.text.includes(`${SITE}/sitemap.xml`),
);
ok("robots disallow studio", /Disallow:\s*\/studio/i.test(robots.text));

const sitemap = await fetchText("/sitemap.xml");
ok("sitemap 200", sitemap.res.status === 200);
ok("sitemap homepage", sitemap.text.includes(`<loc>${SITE}</loc>`));
ok("sitemap /work", sitemap.text.includes(`${SITE}/work`));
ok("sitemap /contact", sitemap.text.includes(`${SITE}/contact`));
ok("sitemap /about", sitemap.text.includes(`${SITE}/about`));
ok("no vercel.app in sitemap", !sitemap.text.includes("vercel.app"));

const fav = await fetch(`${BASE}/favicon.svg`);
ok("favicon.svg 200", fav.status === 200);
const favBody = await fav.text();
ok("favicon chestnut circle", favBody.includes("#753627") && favBody.includes("mgc"));

const apple = await fetch(`${BASE}/apple-touch-icon.png`);
ok("apple-touch-icon 200", apple.status === 200);

const faq = await fetchText("/faq");
ok(
  "FAQPage JSON-LD",
  faq.text.includes("FAQPage") && faq.text.includes("acceptedAnswer"),
);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
const iconHref = await page.locator('link[rel="icon"]').first().getAttribute("href");
ok("icon link in DOM", Boolean(iconHref), iconHref ?? "none");
await browser.close();

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll SEO checks passed");
