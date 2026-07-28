// Smoke-check: architect Construction Cost Calculator invite
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();

check(
  "eyebrow is Construction Cost Calculator",
  html.includes("Construction Cost Calculator"),
);
check("old Cost Guide eyebrow gone", !html.includes(">Cost Guide<"));
check("lede mentions no. of floors", html.includes("no. of floors"));
check("lede mentions type of finish", html.includes("type of finish"));
check("lede ends with house", html.includes("for your house."));
check("commitment note removed", !html.includes("Free and no commitment"));
check("count-up peso marker", html.includes("₱") && html.includes("per sqm"));
check("CTA still present below", html.includes("Get your free estimate"));
check("estimator section id", html.includes('id="calculator"'));

console.log(failures === 0 ? "\nESTIMATOR HOOK OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
