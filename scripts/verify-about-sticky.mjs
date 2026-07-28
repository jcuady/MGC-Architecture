// Smoke-check: About sticky intro + credentials column
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const idx = html.indexOf('id="about"');
const next = html.indexOf('id="process"', idx + 1);
const slice = idx >= 0 ? html.slice(idx, next > idx ? next : idx + 20000) : "";

check("about section", idx >= 0);
check("sticky marker", slice.includes("data-about-sticky") || slice.includes("about-sticky"));
check("credentials marker", slice.includes("data-about-credentials"));
check("CSS sticky fallback class", slice.includes("lg:sticky") || slice.includes("lg\\:sticky"));
check("no overflow-hidden on about section shell", !/^[^>]*>/.test(slice) || !slice.slice(0, 200).includes("overflow-hidden"));
check("portrait present", slice.includes("professional-shot"));
check("Learn More present", slice.includes("Learn More"));
check("Education + Awards in credentials", slice.includes("Education") && slice.includes("Awards"));

// Self-check: pin config intent (source smoke via JS bundle markers)
check(
  "about sticky chunk or marker in page",
  html.includes("about-sticky") || html.includes("data-about-sticky") || html.includes("AboutSticky"),
);

console.log(failures === 0 ? "\nABOUT STICKY OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
