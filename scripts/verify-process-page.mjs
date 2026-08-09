/**
 * Verify /process page follows process.md: 5 phases, finish levels + photos, nav.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/process`, { cache: "no-store" })).text();
const home = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const md = readFileSync(join(root, "process.md"), "utf8");
const pageSrc = readFileSync(join(root, "src/lib/process-page.ts"), "utf8");

const phases = [
  "Pre-Design",
  "Design Development",
  "Construction Drawings",
  "Permits & Contracts",
  "Construction Phase",
];

check("process route 200 body", html.length > 2000);
check("page title", html.includes("How Your Project Moves Forward"));
check("page lede", html.includes("first planning meeting to project completion"));

for (const title of phases) {
  check(`phase present: ${title}`, html.includes(title));
  check(`md contains ${title}`, md.includes(title));
  check(`src contains ${title}`, pageSrc.includes(title));
}

// Finish levels live on /estimate (moved off /process).
const estimateHtml = await (await fetch(`${BASE}/estimate`, { cache: "no-store" })).text();
const calcSrc = readFileSync(join(root, "src/lib/calculator.ts"), "utf8");
const estimatorSrc = readFileSync(join(root, "src/components/estimate/EstimatorFlow.tsx"), "utf8");
const finishes = ["Bare Finish", "Standard Finish", "Premium Finish", "Luxury Finish"];
for (const name of finishes) {
  check(`estimate finish present: ${name}`, estimateHtml.includes(name));
  check(`md finish: ${name}`, md.includes(name));
  check(`process-page finish: ${name}`, pageSrc.includes(name));
}
check("estimator shows finish photos", estimatorSrc.includes("finishGuideMedia") && estimatorSrc.includes("Image"));
check(
  "bare finish description",
  calcSrc.includes("concrete flooring, unpainted concrete walls"),
);
check(
  "luxury finish description",
  calcSrc.includes("A luxury home with natural stone or solid wood flooring"),
);
check(
  "estimator card image below copy",
  estimatorSrc.includes("mt-auto aspect-[16/10]") &&
    estimatorSrc.indexOf("{f.description}") < estimatorSrc.indexOf("aspect-[16/10]"),
);

const photos = [
  "type-of-finish-bare.png",
  "type-of-finish-standard.png",
  "type-of-finish-premium.png",
  "type-of-finish-luxury.png",
];
for (const file of photos) {
  check(`public photo ${file}`, existsSync(join(root, "public/finishes", file)));
  check(`estimate references ${file}`, estimateHtml.includes(`/finishes/${file}`));
}

check("What We’ll Do", html.includes("What We’ll Do") || html.includes("What We\u2019ll Do"));
check("What You’ll Do", html.includes("What You’ll Do") || html.includes("What You\u2019ll Do"));
check("You’ll Receive", html.includes("You’ll Receive") || html.includes("You\u2019ll Receive"));
check("Estimated time labels", (html.match(/Estimated [Tt]ime/g) || []).length >= 1);
check("cost calculator CTA", html.includes("/estimate"));
const phasesSrc = readFileSync(join(root, "src/components/process/ProcessPhases.tsx"), "utf8");
check("pin trigger wired", pageSrc.includes("processPage") && phasesSrc.includes('id: "process-phases"'));
check("interactive phase rail", phasesSrc.includes("goToPhase") && phasesSrc.includes("aria-current"));
check("scroll snap chapters", phasesSrc.includes("snap:"));
check("keyboard navigation", phasesSrc.includes("ArrowRight"));
check("reduced motion branch", phasesSrc.includes("prefers-reduced-motion"));
check("hero entrance component", existsSync(join(root, "src/components/process/ProcessHero.tsx")));

// Landing teaser
check("landing process teaser CTA", home.includes("Explore the full process"));
check("landing links to /process", home.includes('href="/process"'));
check("nav Process → /process", home.includes('href="/process"') && home.includes(">Process<"));

console.log(failures === 0 ? "\nPROCESS PAGE OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
