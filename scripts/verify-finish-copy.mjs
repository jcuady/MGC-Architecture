/**
 * Finish-level copy contract — exact studio descriptions in calculator + process-page.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const calc = readFileSync(join(root, "src/lib/calculator.ts"), "utf8");
const page = readFileSync(join(root, "src/lib/process-page.ts"), "utf8");

const required = [
  "A basic bare home with concrete flooring, unpainted concrete walls, minimal windows, and an exposed ceiling.",
  "A clean and practical home with tiled flooring, painted walls, standard aluminum-framed windows, and a simple flat ceiling.",
  "A refined home with large-format tiles or engineered wood flooring, decorative wall cladding, full-height glass windows, and detailed ceilings.",
  "A premium customized home with natural stone or solid wood flooring, imported wall finishes, double-glazed windows, and custom wood or acoustic ceilings.",
];

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

for (const text of required) {
  const label = text.slice(0, 28) + "…";
  check(`calculator: ${label}`, calc.includes(text));
  check(`process-page: ${label}`, page.includes(text));
}
check("no old luxury opener", !calc.includes('"A luxury home with natural stone'));

console.log(failures === 0 ? "\nFINISH COPY OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
