import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mod = await import(pathToFileURL(join(root, "src/lib/process-chapters.ts")).href);
const { phaseIndexFromProgress, phaseLabel } = mod;

const N = 5;
assert.equal(phaseIndexFromProgress(0, N), 0);
assert.equal(phaseIndexFromProgress(0.19, N), 0);
assert.equal(phaseIndexFromProgress(0.2, N), 1);
assert.equal(phaseIndexFromProgress(0.99, N), 4);
assert.equal(phaseIndexFromProgress(1, N), 4);
assert.equal(phaseLabel(0), "01");
assert.equal(phaseLabel(4), "05");

const phases = readFileSync(join(root, "src/components/process/ProcessPhases.tsx"), "utf8");
const gsapLib = readFileSync(join(root, "src/lib/gsap.ts"), "utf8");
const hero = readFileSync(join(root, "src/components/process/ProcessHero.tsx"), "utf8");

assert.ok(phases.includes("pin: true"));
assert.ok(phases.includes("pinSpacing: true"));
assert.ok(phases.includes("window.innerHeight * n"));
assert.ok(phases.includes("goToPhase"));
assert.ok(phases.includes("ArrowRight"));
assert.ok(phases.includes("prefers-reduced-motion"));
assert.ok(phases.includes("data-phase-row"));
assert.ok(phases.includes('id: "process-phases"'));
assert.ok(!phases.includes('id: "process-rail"'), "no competing rail ScrollTrigger");
assert.ok(hero.includes("data-hero-in"));
assert.ok(gsapLib.includes("ScrollToPlugin"));

console.log("PASS  process immersive motion + chapter helper (asserts ok)");
