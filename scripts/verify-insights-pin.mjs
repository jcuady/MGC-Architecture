/**
 * Real-browser proof of the Before You Build scroll lock.
 * Playwright + Chromium: scrolls through the pin range and asserts:
 *  1. Scene stays fixed below the header (locked) while scrollY increases.
 *  2. Chapter counter advances 01 → 04 during the lock.
 *  3. Scene unlocks (scrolls away) after the runway ends.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

const scene = page.locator("[data-insights-scene]");
await scene.waitFor({ state: "attached" });

// Scroll the scene to its pin start (top at 76px header)
const pinStart = await page.evaluate(() => {
  const el = document.querySelector("[data-insights-scene]");
  const header = 76; // 4.75rem
  return el.getBoundingClientRect().top + window.scrollY - header;
});
await page.evaluate((y) => window.scrollTo(0, y), pinStart);
await page.waitForTimeout(400);

const readState = () =>
  page.evaluate(() => {
    const el = document.querySelector("[data-insights-scene]");
    const idx = document.querySelector("[data-insights-index] span");
    const activePanel = document.querySelector('[data-insight-panel][data-active="true"]');
    return {
      top: Math.round(el.getBoundingClientRect().top),
      scrollY: Math.round(window.scrollY),
      counter: idx ? idx.textContent.trim() : null,
      activeTitle: activePanel ? activePanel.querySelector("h3")?.textContent.trim() : null,
    };
  });

const s0 = await readState();
check("counter starts at 01", s0.counter === "01", `counter=${s0.counter}`);

// Walk through the lock in steps; scene top must stay ~76px the whole time
const seenCounters = new Set([s0.counter]);
let lockedThroughout = true;
const step = 500;
for (let i = 1; i <= 6; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), pinStart + i * step);
  await page.waitForTimeout(350);
  const s = await readState();
  seenCounters.add(s.counter);
  if (Math.abs(s.top - 76) > 3) lockedThroughout = false;
}

check("scene locked during scroll (top ≈ 76px across 3000px)", lockedThroughout);
check(
  "chapters advance while locked",
  seenCounters.size >= 3,
  `saw: ${[...seenCounters].join(", ")}`,
);

// Reaches the last chapter near the end of the runway
const runwayEnd = await page.evaluate(() => Math.round(window.innerHeight * 4 * 0.85));
await page.evaluate((y) => window.scrollTo(0, y), pinStart + runwayEnd - 50);
await page.waitForTimeout(400);
const sEnd = await readState();
check("last chapter reached (04)", sEnd.counter === "04", `counter=${sEnd.counter}`);

// After the runway the scene must release (top rises above header)
await page.evaluate((y) => window.scrollTo(0, y), pinStart + runwayEnd + 1200);
await page.waitForTimeout(400);
const sAfter = await readState();
check("scene releases after runway", sAfter.top < 60, `top=${sAfter.top}px`);

// Counter and visible card agree at the end state we can observe
const agree = await page.evaluate(() => {
  const idx = document.querySelector("[data-insights-index] span")?.textContent.trim();
  const activeLabel = document
    .querySelector('[data-insight-panel][data-active="true"] p')
    ?.textContent.trim()
    .slice(0, 2);
  return { idx, activeLabel, match: idx === activeLabel };
});
check(
  "counter matches visible card label",
  agree.match,
  `counter=${agree.idx} card=${agree.activeLabel}`,
);

await browser.close();
console.log(failures === 0 ? "\nINSIGHTS PIN PROVEN IN BROWSER" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
