/**
 * Latest Articles layout contract: responsive grid, uniform media, no pin overlap.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const latest = readFileSync(join(root, "src/components/sections/LatestArticles.tsx"), "utf8");

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("file exists", existsSync(join(root, "src/components/sections/LatestArticles.tsx")));
check("server component (no use client)", !latest.includes('"use client"'));
check("no GSAP pin", !latest.includes("useGSAP") && !latest.includes("ScrollTrigger") && !latest.includes("pin: true"));
check("CSS grid", latest.includes("grid grid-cols-1"));
check("tablet 2-col", latest.includes("sm:grid-cols-2"));
check("desktop 4-col", latest.includes("lg:grid-cols-4"));
check("items-start alignment", latest.includes("items-start"));
check("uniform aspect-[3/4]", latest.includes("aspect-[3/4]") && !latest.includes("max-h-["));
check("object-cover", latest.includes("object-cover"));
check("heading z above cards", latest.includes("relative z-10") && latest.includes("relative z-0"));
check("heading before grid in source", latest.indexOf("<header") < latest.indexOf("<ul"));

console.log(failures === 0 ? "\nLATEST ARTICLES GRID OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
