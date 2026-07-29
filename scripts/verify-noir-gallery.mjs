import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const start = content.indexOf('slug: "the-noir"');
const end = content.indexOf('slug: "the-hearth"');
const block = content.slice(start, end);
const srcs = [...block.matchAll(/src: "([^"]+)"/g)].map((m) => m[1]);
const hero = "/portfolio/the-noir/the-noir-living-view-1.png";
const rest = srcs.filter((s) => s !== hero);
const gallery = rest.length === 0 ? srcs : [rest[0], hero, ...rest.slice(1)];

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("no living-view-5", !srcs.some((s) => s.includes("living-view-5")));
check("no bedroom-view-2", !srcs.some((s) => s.includes("bedroom-view-2")));
check("bedroom-view-1 kept once", srcs.filter((s) => s.includes("bedroom-view-1")).length === 1);
check("gallery opens bedroom | living", gallery[0].includes("bedroom-view-1") && gallery[1] === hero);
check("gallery has no trailing bedroom pair", !gallery.slice(2).some((s) => s.includes("bedroom")));

console.log("gallery:", gallery.map((s) => s.split("/").pop()).join(" | "));
console.log(failures === 0 ? "\nNOIR BEDROOM SWAP + TRIM OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
