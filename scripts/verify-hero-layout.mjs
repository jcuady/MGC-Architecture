// Smoke-check: Minimalist split layout
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();

check("hero-line-mask protects descenders", html.includes("hero-line-mask"));
check("rectangular Start a project CTA", html.includes("Start a project") && html.includes("bg-charcoal"));
check("no rounded-full pill CTA", !html.includes("rounded-full bg-warm-white px-6"));
check("no acid-lime accent", !html.includes("#e1fcad"));
check("services lede from website flow", html.includes("Choose the option below that best fits your project"));

console.log(failures === 0 ? "\nHERO LAYOUT OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
