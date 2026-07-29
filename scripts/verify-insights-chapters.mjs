/**
 * Red/green checks for Insights chapter sync (no test framework).
 * Expected values are literals from the scroll→chapter contract.
 */
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const modPath = join(root, "src/lib/insights-chapters.ts");

const mod = await import(pathToFileURL(modPath).href);
const { chapterIndexFromProgress, chapterLabel } = mod;

const N = 4;

assert.equal(chapterIndexFromProgress(0, N), 0);
assert.equal(chapterIndexFromProgress(0.24, N), 0);
assert.equal(chapterIndexFromProgress(0.25, N), 1);
assert.equal(chapterIndexFromProgress(0.49, N), 1);
assert.equal(chapterIndexFromProgress(0.5, N), 2);
assert.equal(chapterIndexFromProgress(0.74, N), 2);
assert.equal(chapterIndexFromProgress(0.75, N), 3);
assert.equal(chapterIndexFromProgress(1, N), 3);
assert.equal(chapterIndexFromProgress(-0.2, N), 0);
assert.equal(chapterIndexFromProgress(1.5, N), 3);
assert.equal(chapterIndexFromProgress(0.5, 0), 0);
assert.equal(chapterLabel(0), "01");
assert.equal(chapterLabel(3), "04");

console.log("PASS  insights chapterIndexFromProgress + chapterLabel (13 asserts)");
