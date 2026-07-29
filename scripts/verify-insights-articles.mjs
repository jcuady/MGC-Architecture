/**
 * Smoke + source checks: Insights lock shell + chapter sync wiring.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const insightsSrc = readFileSync(
  join(root, "src/components/sections/InsightsImmersive.tsx"),
  "utf8",
);
const chaptersSrc = readFileSync(join(root, "src/lib/insights-chapters.ts"), "utf8");

const insightsIdx = html.indexOf('id="insights"');
const blogIdx = html.indexOf('id="blog"');
const insightsSlice =
  insightsIdx >= 0
    ? html.slice(insightsIdx, blogIdx > insightsIdx ? blogIdx : insightsIdx + 28000)
    : "";

check("insights section", insightsIdx >= 0);
check("pin scene marker", insightsSlice.includes("data-insights-scene"));
check("insight stage", insightsSlice.includes("data-insight-stage"));
check("insight panels", (insightsSlice.match(/data-insight-panel/g) || []).length >= 4);
check("index live region", insightsSlice.includes("data-insights-index"));
check("title present", insightsSlice.includes("Read this before you break ground"));

check("uses chapterIndexFromProgress", insightsSrc.includes("chapterIndexFromProgress"));
check("React state active chapter", insightsSrc.includes("useState(0)"));
check("ScrollTrigger pin true (auto spacer)", insightsSrc.includes("pin: true"));
check("px header offset (rem breaks ST start)", insightsSrc.includes("HEADER_PX = 76"));
check("no manual runway left", !insightsSrc.includes("pinSpacing: false") && !insightsSrc.includes("420vh"));
check("ST id insights-chapters", insightsSrc.includes('id: "insights-chapters"'));
check("chapter helper exported", chaptersSrc.includes("export function chapterIndexFromProgress"));

console.log(failures === 0 ? "\nINSIGHTS LOCK OK" : `\n${failures} FAILED`);
// process.exit() races libuv fetch teardown on Windows; exitCode is safe
process.exitCode = failures === 0 ? 0 : 1;
