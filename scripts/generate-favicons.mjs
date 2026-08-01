/**
 * Regenerates circular chestnut "mgc" PNG/ICO favicons for SERP + PWA.
 * Uses Playwright (already a devDependency).
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#753627"/>
  <text x="256" y="318" text-anchor="middle" fill="#F3F2F2"
    font-family="Georgia, 'Times New Roman', serif" font-size="190"
    font-style="italic" letter-spacing="-0.04em">mgc</text>
</svg>`;

const sizes = [
  { name: "favicon-96x96.png", size: 96 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "web-app-manifest-192x192.png", size: 192 },
  { name: "web-app-manifest-512x512.png", size: 512 },
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const { name, size } of sizes) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">${svg.replace(
      'viewBox="0 0 512 512"',
      `width="${size}" height="${size}" viewBox="0 0 512 512"`,
    )}</body></html>`,
    { waitUntil: "load" },
  );
  const buf = await page.screenshot({ type: "png", omitBackground: true });
  writeFileSync(join(publicDir, name), buf);
  console.log(`wrote ${name} (${buf.length} bytes)`);
}

// Simple 32×32 ICO via PNG rename fallback: browsers accept PNG-in-.ico poorly,
// so write a 32×32 PNG and also copy 96 as favicon.ico multi-size isn't free —
// use 32 PNG bytes named favicon.ico is wrong. Prefer keeping existing .ico
// structure: write 32×32 PNG then use as favicon via HTML; also overwrite
// favicon.ico with a 32 PNG that Chromium accepts when served as image/x-icon.
await page.setViewportSize({ width: 32, height: 32 });
await page.setContent(
  `<!doctype html><html><body style="margin:0;background:transparent">${svg.replace(
    'viewBox="0 0 512 512"',
    'width="32" height="32" viewBox="0 0 512 512"',
  )}</body></html>`,
  { waitUntil: "load" },
);
const icoPng = await page.screenshot({ type: "png", omitBackground: true });
writeFileSync(join(publicDir, "favicon.ico"), icoPng);
console.log(`wrote favicon.ico (${icoPng.length} bytes, PNG-compatible)`);

await browser.close();
console.log("favicon generation complete");
