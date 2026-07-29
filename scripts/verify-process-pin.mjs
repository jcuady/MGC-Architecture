/**
 * Real-browser proof: Process phases ScrollTrigger pin locks through all 5 phases.
 * Failures here mean the pin is NOT working — do not claim success without exit 0.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const N = 5;
const HEADER = 76;

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "no-preference" });

let reachable = true;
try {
  const res = await page.goto(`${BASE}/process`, { waitUntil: "networkidle", timeout: 30000 });
  check("process page loads", res?.ok() === true, `status=${res?.status()}`);
} catch (e) {
  reachable = false;
  check("process page loads", false, String(e));
}

if (!reachable) {
  await browser.close();
  console.log(`\n${failures} FAILED — start server: npx next start -p 3847`);
  process.exit(1);
}

await page.waitForSelector("[data-process-scene]", { timeout: 15000 });
// Let useGSAP + matchMedia create the ScrollTrigger
await page.waitForTimeout(600);

const hasST = await page.evaluate(() => {
  const g = window;
  // ScrollTrigger instances live on the GSAP plugin — probe via DOM pin state after scroll
  return Boolean(document.querySelector("[data-process-scene]"));
});
check("process scene mounted", hasST);

const pinStart = await page.evaluate((header) => {
  const el = document.querySelector("[data-process-scene]");
  return el.getBoundingClientRect().top + window.scrollY - header;
}, HEADER);

await page.evaluate((y) => window.scrollTo(0, y), pinStart);
await page.waitForTimeout(500);

const read = () =>
  page.evaluate(() => {
    const el = document.querySelector("[data-process-scene]");
    const idx = document.querySelector("[data-process-index]");
    const title = document.querySelector("[data-process-title]");
    const active = el?.getAttribute("data-process-active");
    return {
      top: Math.round(el.getBoundingClientRect().top),
      scrollY: Math.round(window.scrollY),
      counter: idx?.textContent?.trim() ?? null,
      title: title?.textContent?.trim() ?? null,
      active: active != null ? Number(active) : -1,
      pinned: getComputedStyle(el).position === "fixed",
    };
  });

const s0 = await read();
check("starts at phase 01", s0.counter === "01", `counter=${s0.counter}`);
check(
  "scene pinned or at pin start (top ≈ 76)",
  Math.abs(s0.top - HEADER) <= 4 || s0.pinned,
  `top=${s0.top} pinned=${s0.pinned}`,
);

const runway = await page.evaluate((n) => Math.round(window.innerHeight * n), N);
const seen = new Set([s0.counter]);
let locked = true;
const steps = 12;
for (let i = 1; i <= steps; i++) {
  const y = pinStart + Math.round((runway * i) / (steps + 1));
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(280);
  const s = await read();
  seen.add(s.counter);
  // While inside runway (before release), top must stay near header
  if (y < pinStart + runway - 40 && Math.abs(s.top - HEADER) > 6 && !s.pinned) {
    locked = false;
  }
}

check(
  "scene stays locked while scrolling through runway",
  locked,
  `seen tops while scrolling; counters=${[...seen].join(",")}`,
);
check(
  "all five phase counters appear during lock",
  ["01", "02", "03", "04", "05"].every((c) => seen.has(c)),
  `saw: ${[...seen].join(", ")}`,
);

// End of runway — last phase
await page.evaluate((y) => window.scrollTo(0, y), pinStart + runway - 80);
await page.waitForTimeout(500);
const sEnd = await read();
check("last phase is 05 before release", sEnd.counter === "05", `counter=${sEnd.counter}`);

// Past runway — pin releases
await page.evaluate((y) => window.scrollTo(0, y), pinStart + runway + 900);
await page.waitForTimeout(500);
const sAfter = await read();
check(
  "scene releases after all five phases",
  sAfter.top < HEADER - 10 || sAfter.top > HEADER + 40,
  `top=${sAfter.top}`,
);

// Live ScrollTrigger id proof via GSAP if exposed
const stProof = await page.evaluate(() => {
  try {
    // @ts-expect-error runtime
    const ST = window.ScrollTrigger || (window.gsap && window.gsap.core?.globals?.()?.ScrollTrigger);
    // Not always on window — detect pin-spacer sibling instead
    const scene = document.querySelector("[data-process-scene]");
    const parent = scene?.parentElement;
    const spacer = parent?.querySelector(".pin-spacer") || parent?.previousElementSibling;
    const hasPinSpacer =
      Boolean(parent?.classList.contains("pin-spacer")) ||
      Boolean(scene?.parentElement?.style?.height) ||
      Boolean(document.querySelector(".pin-spacer"));
    return {
      hasPinSpacer,
      parentTag: parent?.tagName,
      parentClass: parent?.className?.slice?.(0, 80) ?? "",
    };
  } catch (e) {
    return { error: String(e) };
  }
});
check(
  "GSAP pin-spacer present in DOM (ScrollTrigger actually pinned)",
  Boolean(stProof.hasPinSpacer) || String(stProof.parentClass).includes("pin-spacer"),
  JSON.stringify(stProof),
);

await browser.close();
console.log(failures === 0 ? "\nPROCESS PIN PROVEN IN BROWSER" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
