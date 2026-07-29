import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const page = readFileSync(join(root, "src/app/work/[slug]/page.tsx"), "utf8");

const start = content.indexOf('slug: "the-hearth"');
const end = content.indexOf('slug: "guest-quarter"');
const block = content.slice(start, end);
const srcs = [...block.matchAll(/src: "([^"]+)"/g)].map((m) => m[1]);
const hero = "/portfolio/the-hearth/the-hearth-kitchen-view-1.png";
const rest = srcs.filter((s) => s !== hero);
const gallery = rest.length === 0 ? srcs : [rest[0], hero, ...rest.slice(1)];

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("IMAGE 1 is dining", gallery[0].includes("dining-view-1"));
check("IMAGE 2 is kitchen (hero)", gallery[1] === hero);
check("dining listed before kitchen-view-2", block.indexOf("dining-view-1") < block.indexOf("kitchen-view-2"));
check("dining asset exists", existsSync(join(root, "public/portfolio/the-hearth/the-hearth-dining-view-1.png")));
check("kitchen asset exists", existsSync(join(root, "public/portfolio/the-hearth/the-hearth-kitchen-view-1.png")));
check("gallery two-column", page.includes("sm:grid-cols-2") && page.includes("heroImg"));

console.log("gallery head:", gallery.slice(0, 2).map((s) => s.split("/").pop()).join(" | "));
console.log(failures === 0 ? "\nHEARTH DINING|KITCHEN PAIR OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
