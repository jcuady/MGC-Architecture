import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const page = readFileSync(join(root, "src/app/work/[slug]/page.tsx"), "utf8");
const block = content.slice(content.indexOf('slug: "built-in"'));

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("pieces type exists", content.includes("export type ProjectPiece"));
check("built-in has pieces array", block.includes("pieces: ["));
check("proj 1 title", block.includes("Bedroom vanity table, display shelf, TV console"));
check("proj 2 title", block.includes("Vinyl display shelf"));
check("proj 3 title", block.includes("Altar cabinetry"));
check(
  "page renders picture|diagram pairs",
  page.includes("showPairedPieces") && page.includes("Picture") && page.includes("Diagram"),
);
check(
  "all six built-in assets present",
  [
    "built-in-proj-01-view.png",
    "built-in-proj-01-drawing.png",
    "built-in-proj-02-view.png",
    "built-in-proj-02-drawing.png",
    "built-in-proj-03-view.png",
    "built-in-proj-03-plan.png",
  ].every((f) => existsSync(join(root, "public/portfolio/built-in", f))),
);

console.log(failures === 0 ? "\nBUILT-IN PICTURE|DIAGRAM LAYOUT OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
