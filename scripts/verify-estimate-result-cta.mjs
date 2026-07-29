import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/components/estimate/EstimatorFlow.tsx"), "utf8");

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

check("no estimated floor area row", !src.includes("Estimated floor area"));
check("no Book a free consultation CTA", !src.includes("Book a free consultation"));
check("Inquire CTA label present", />\s*Inquire\s*</.test(src));
check("Inquire links to /inquire", src.includes("/inquire?category="));
check("finish level row kept", src.includes('label="Finish level"'));
check("rate applied row kept", src.includes('label="Rate applied"'));

console.log(failures === 0 ? "\nESTIMATE RESULT REVISIONS OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
