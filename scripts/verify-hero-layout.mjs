// Smoke-check: full-bleed editorial hero
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();

check("hero-line-mask protects descenders", html.includes("hero-line-mask"));
check("full-bleed charcoal hero stage", html.includes("bg-charcoal") && html.includes("hero-stage"));
check("hero title scale class", html.includes("hero-title"));
check("hero background image plane", html.includes("data-hero-image"));
check("no acid-lime accent", !html.includes("#e1fcad"));
check("no rounded-full pill CTA", !html.includes("rounded-full bg-warm-white px-6"));
check("Start a project CTA present", html.includes("Start a project"));
check("services lede from website flow", html.includes("Choose the option below that best fits your project"));

console.log(failures === 0 ? "\nHERO LAYOUT OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
