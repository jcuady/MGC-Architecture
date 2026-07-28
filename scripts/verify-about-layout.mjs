// Smoke-check: About short bio + portrait + Learn More + experience
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const aboutIdx = html.indexOf('id="about"');
const processIdx = html.indexOf('id="process"', aboutIdx + 1);
const slice =
  aboutIdx >= 0
    ? html.slice(aboutIdx, processIdx > aboutIdx ? processIdx : aboutIdx + 35000)
    : "";

check("about section present", aboutIdx >= 0);
check("portrait shot-2", slice.includes("professional-shot-2.png") || html.includes("professional-shot-2"));
check("hover/alt shot-1", slice.includes("professional-shot-1.png") || html.includes("professional-shot-1"));
check("Learn More CTA", slice.includes("Learn More"));
check("full bio dialog", slice.includes("<dialog") || slice.includes("dialog"));
check("Professional Experience section", slice.includes("Professional Experience"));
check("RC LLaguno experience", slice.includes("RC LLaguno"));
check("Education before Experience", (() => {
  const e = slice.indexOf("Education");
  const x = slice.indexOf("Professional Experience");
  return e >= 0 && x > e;
})());
check("Experience before Awards", (() => {
  const x = slice.indexOf("Professional Experience");
  const a = slice.indexOf("Awards");
  return x >= 0 && a > x;
})());
check("short bio intro on page", slice.includes("passionate about creating thoughtful"));
// Full body para should live in dialog markup (still in HTML) — presence ok
check("full bio content available", slice.includes("Magna Cum Laude") || slice.includes("flower business"));

const shot2 = await fetch(`${BASE}/about/professional-shot-2.png`);
const shot1 = await fetch(`${BASE}/about/professional-shot-1.png`);
check("shot-2 asset served", shot2.ok, `status ${shot2.status}`);
check("shot-1 asset served", shot1.ok, `status ${shot1.status}`);

console.log(failures === 0 ? "\nABOUT LAYOUT OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
