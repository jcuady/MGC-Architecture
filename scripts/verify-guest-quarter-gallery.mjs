import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const page = readFileSync(join(root, "src/app/work/[slug]/page.tsx"), "utf8");

const start = content.indexOf('slug: "guest-quarter"');
const end = content.indexOf('slug: "capstone"');
const block = content.slice(start, end);
const srcs = [...block.matchAll(/src: "([^"]+)"/g)].map((m) => m[1]);
const hero = "/portfolio/guest-quarter/guest-quarter-view-1.png";
const rest = srcs.filter((s) => s !== hero);
const gallery = rest.length === 0 ? srcs : [rest[0], hero, ...rest.slice(1)];

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("IMAGE 1 is window/bedroom view", gallery[0].includes("view-4"));
check("IMAGE 2 is hero", gallery[1] === hero);
check("view-4 listed before view-2", block.indexOf("view-4") < block.indexOf("view-2"));
check("hero asset exists", existsSync(join(root, "public/portfolio/guest-quarter/guest-quarter-view-1.png")));
check("view-4 asset exists", existsSync(join(root, "public/portfolio/guest-quarter/guest-quarter-view-4.png")));
check("gallery two-column with hero reuse", page.includes("sm:grid-cols-2") && page.includes("heroImg"));

console.log("gallery head:", gallery.slice(0, 2).map((s) => s.split("/").pop()).join(" | "));
console.log(failures === 0 ? "\nGUEST QUARTER PAIR OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
