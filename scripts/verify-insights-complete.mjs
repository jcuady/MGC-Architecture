import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const immersive = readFileSync(
  join(root, "src/components/sections/InsightsImmersive.tsx"),
  "utf8",
);
const start = content.indexOf("export const insights");
const block = content.slice(start, content.indexOf("export const faqs"));

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("no Coming soon label", !immersive.includes("Coming soon"));
check("no soon panel kind", !immersive.includes('kind: "soon"'));
check("upcoming uses items lists", block.includes("Permits & paperwork") && block.includes("items: ["));
check("permits chapter has title docs", block.includes("Title (TCT or OCT)"));
check("budget chapter has finalize design", block.includes("Finalize design first"));
check("articles see-all → /blog", block.includes('seeAllHref: "/blog"'));
check(
  "article hrefs are blog posts",
  block.includes("/blog/before-you-build-read-this") &&
    block.includes("/blog/budget-saving-tips-before-you-build") &&
    !block.includes('href: "/#faq"') &&
    !block.includes('href: "/#blog"'),
);
check("no mojibake em dash in insights block", !block.includes("â€”") && !block.includes("â‚±"));

console.log(failures === 0 ? "\nINSIGHTS CHAPTERS COMPLETE OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
