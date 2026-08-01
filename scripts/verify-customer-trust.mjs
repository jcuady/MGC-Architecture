/**
 * Customer trust surfaces: 404/403, legal pages, cookie banner, form consent.
 * Usage: node scripts/verify-customer-trust.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:3847";
let failed = 0;

function ok(label, pass, detail = "") {
  if (pass) console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function statusOf(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return res.status;
}

for (const [path, expect] of [
  ["/privacy", 200],
  ["/terms", 200],
  ["/cookies", 200],
  ["/403", 200],
  ["/this-page-does-not-exist-mgc-404", 404],
]) {
  const code = await statusOf(path);
  ok(`${path} → ${expect}`, code === expect, `got ${code}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.removeItem("mgc-cookie-consent-v1"));
await page.reload({ waitUntil: "domcontentloaded" });
const banner = page.locator('[aria-label="Cookie notice"]');
await banner.waitFor({ state: "visible", timeout: 8000 });
ok("cookie consent dialog", await banner.isVisible());

await page.getByRole("button", { name: "Accept" }).click();
await banner.waitFor({ state: "hidden", timeout: 5000 });
ok("cookie consent dismisses", !(await banner.isVisible()));

await page.goto(`${BASE}/contact`, { waitUntil: "domcontentloaded" });
ok(
  "contact form has privacy link",
  (await page.locator('form a[href="/privacy"]').count()) >= 1,
);
ok(
  "contact form has terms link",
  (await page.locator('form a[href="/terms"]').count()) >= 1,
);
ok(
  "contact consent checkbox",
  (await page.locator("#inq-consent").count()) === 1,
);

await page.goto(`${BASE}/inquire`, { waitUntil: "domcontentloaded" });
// Jump to last step is hard; check footer legal always present
ok(
  "footer privacy link",
  (await page.locator('footer a[href="/privacy"]').count()) >= 1,
);

await page.goto(`${BASE}/not-a-real-route-xyz`, { waitUntil: "domcontentloaded" });
ok(
  "404 branded copy",
  (await page.getByRole("heading", { name: /isn’t here|isn't here/i }).count()) >= 1,
);
ok(
  "404 chestnut brand band",
  (await page.locator("main section.bg-chestnut").count()) >= 1,
);
ok(
  "404 gold eyebrow",
  (await page.locator("main .text-gold").count()) >= 1,
);

await page.goto(`${BASE}/403`, { waitUntil: "domcontentloaded" });
ok(
  "403 chestnut brand band",
  (await page.locator("main section.bg-chestnut").count()) >= 1,
);
ok(
  "403 studio login CTA",
  (await page.getByRole("link", { name: /studio login/i }).count()) >= 1,
);

await page.goto(`${BASE}/privacy`, { waitUntil: "domcontentloaded" });
ok(
  "privacy FAQ-style terracotta eyebrow",
  (await page.locator("main .text-terracotta").count()) >= 1,
);
ok(
  "privacy document (no chestnut hero)",
  (await page.locator("main > section.bg-chestnut").count()) === 0,
);
ok(
  "privacy has footer",
  (await page.locator("footer").count()) >= 1,
);
ok(
  "privacy Poppins heading + Lora body classes present",
  (await page.locator("main .font-heading").count()) >= 1 &&
    (await page.locator("main .font-body, main .system-prose").count()) >= 1,
);

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.removeItem("mgc-cookie-consent-v1"));
await page.reload({ waitUntil: "domcontentloaded" });
const cookieBar = page.locator('[aria-label="Cookie notice"]');
await cookieBar.waitFor({ state: "visible", timeout: 8000 });
ok(
  "cookie bar chestnut surface",
  await cookieBar.evaluate((el) => el.classList.contains("bg-chestnut")),
);
ok(
  "cookie bar gold label",
  (await cookieBar.locator(".text-gold").count()) >= 1,
);

await browser.close();

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nCustomer trust checks passed");
