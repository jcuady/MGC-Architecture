import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "src/app/work/[slug]/page.tsx"), "utf8");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const work = readFileSync(join(root, "src/components/sections/Work.tsx"), "utf8");

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

check("work detail has no Views counter", !page.includes(">Views<") && !page.includes("Views\n"));
check("work detail shows project credits", page.includes("Project credits"));
check("MGC monogram in credits", page.includes("/brand/monogram-chestnut.png"));
check("RC logo only when underRc", page.includes("underRc") && page.includes("/brand/rclc-logo.png"));
check("RC logo asset exists", existsSync(join(root, "public/brand/rclc-logo.png")));
const cHouse = content.slice(content.indexOf('slug: "c-house"'), content.indexOf('slug: "tile-co"'));
check("C House story uses was handled by", cHouse.includes("this project was handled by the design team"));
check("C House scope has Construction Drawings", cHouse.includes("Construction Drawings"));
check("C House scope drops Interior Design tag", !cHouse.includes('"Interior Design"'));
check("work grid has no views count", !work.includes("views"));

console.log(failures === 0 ? "\nWORK PAGE REVISIONS OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
