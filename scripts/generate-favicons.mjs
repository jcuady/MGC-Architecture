/**
 * Regenerates circular chestnut favicons for SERP + PWA.
 * Transparent outside the circle; embeds brand monogram (not system text).
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const monoRaw = readFileSync(join(publicDir, "brand", "monogram-white.png"));

const browser = await chromium.launch();
const page = await browser.newPage();

// Strip black background → transparent white monogram once.
await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(
  `<canvas id="c" width="512" height="512"></canvas>
   <script>
     const img = new Image();
     img.onload = () => {
       const c = document.getElementById('c');
       const ctx = c.getContext('2d');
       ctx.drawImage(img, 0, 0, 512, 512);
       const id = ctx.getImageData(0, 0, 512, 512);
       const d = id.data;
       for (let i = 0; i < d.length; i += 4) {
         const lum = (d[i] + d[i+1] + d[i+2]) / 3;
         if (lum < 40) { d[i+3] = 0; }
       }
       ctx.putImageData(id, 0, 0);
       window.__mono = c.toDataURL('image/png');
     };
     img.src = 'data:image/png;base64,${monoRaw.toString("base64")}';
   </script>`,
  { waitUntil: "load" },
);
await page.waitForFunction(() => Boolean(window.__mono));
const monoDataUrl = await page.evaluate(() => window.__mono);
const mono = monoDataUrl.replace(/^data:image\/png;base64,/, "");
writeFileSync(
  join(publicDir, "brand", "monogram-white-transparent.png"),
  Buffer.from(mono, "base64"),
);
console.log("wrote brand/monogram-white-transparent.png");

function pageHtml(size) {
  // Full chestnut square + transparent white monogram (Google crops to circle in SERP).
  return `<!doctype html><html><head><style>
    html,body{margin:0;width:${size}px;height:${size}px;background:#753627;overflow:hidden}
    .frame{
      width:${size}px;height:${size}px;background:#753627;
      display:flex;align-items:center;justify-content:center;
    }
    img{
      width:${Math.round(size * 0.72)}px;height:${Math.round(size * 0.72)}px;
      object-fit:contain;display:block;
    }
  </style></head><body>
    <div class="frame"><img src="data:image/png;base64,${mono}" alt=""/></div>
  </body></html>`;
}

const outs = [
  { name: "favicon-48x48.png", size: 48 },
  { name: "favicon-96x96.png", size: 96 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "web-app-manifest-192x192.png", size: 192 },
  { name: "web-app-manifest-512x512.png", size: 512 },
  { name: "favicon-32x32.png", size: 32 },
];

const pngBySize = new Map();

for (const { name, size } of outs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(pageHtml(size), { waitUntil: "load" });
  await page.waitForTimeout(50);
  const buf = await page.screenshot({ type: "png" });
  writeFileSync(join(publicDir, name), buf);
  pngBySize.set(size, buf);
  console.log(`wrote ${name} (${buf.length} bytes)`);
}

await browser.close();

// Real ICO: PNG-in-ICO (Vista+) from 48px — Google wants multiples of 48.
const png48 = pngBySize.get(48);
const ico = buildPngIco(png48);
writeFileSync(join(publicDir, "favicon.ico"), ico);
console.log(`wrote favicon.ico (${ico.length} bytes, PNG-in-ICO)`);

writeFileSync(
  join(publicDir, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="MGC Architecture">
  <rect width="48" height="48" rx="24" ry="24" fill="#753627"/>
  <image href="data:image/png;base64,${mono}" x="7" y="7" width="34" height="34" preserveAspectRatio="xMidYMid meet"/>
</svg>
`,
);
console.log("wrote favicon.svg");
console.log("favicon generation complete");

/** Minimal ICO container embedding one PNG (valid for modern browsers + Google). */
function buildPngIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(48, 0);
  entry.writeUInt8(48, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12);

  return Buffer.concat([header, entry, png]);
}

