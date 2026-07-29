import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const start = content.indexOf('slug: "saro"');
const end = content.indexOf('slug: "', start + 10);
const block = content.slice(start, end > 0 ? end : undefined);

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("saro project exists", start >= 0);
check("concept illustration removed", !block.includes("saro-illustration-1.png"));
check("form development diagram removed", !block.includes("sasro-diagram-1.png"));
check("pavilion renders kept", block.includes("saro-view-1.png") && block.includes("saro-view-4.png"));
check("no diagram kind left on saro", !/\bkind:\s*"diagram"/.test(block));

console.log(failures === 0 ? "\nSARO ILLUSTRATION/DIAGRAM REMOVAL OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
