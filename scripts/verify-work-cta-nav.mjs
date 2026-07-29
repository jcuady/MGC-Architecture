import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const src = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../src/app/work/[slug]/page.tsx"),
  "utf8",
);

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("new CTA copy", src.includes("Book a free discussion call"));
check("old consultation copy gone", !src.includes("initial consultation is complimentary"));
check("CTA button under text", src.includes("max-w-2xl") && src.includes("mt-6 inline-flex"));
check("links to inquire", src.includes('href="/inquire"'));
check("prev arrow", src.includes("←"));
check("next arrow", src.includes("→"));
check("CTA separated from nav", src.includes("spaced below CTA"));

console.log(failures === 0 ? "\nWORK CTA + NAV REVISIONS OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
