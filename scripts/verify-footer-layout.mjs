// Smoke-check: compact footer architect revisions
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const idx = html.lastIndexOf("<footer");
const end = html.indexOf("</footer>", idx);
const slice =
  idx >= 0 && end > idx ? html.slice(idx, end + "</footer>".length) : "";

check("footer present", idx >= 0);
check("tagline removed from footer UI", !/Design with Purpose/.test(slice));
check("Explore present", slice.includes("Explore"));
check("two-column explore grid", slice.includes("grid-cols-2"));
check("monogram on right", /(-right-|right-)/.test(slice) && slice.includes("monogram-white"));
check("compact padding", slice.includes("py-8") || slice.includes("py-10"));
check("copyright present", slice.includes("All rights reserved"));
check("Manila present", slice.includes("Manila"));
check("Works/nav links", slice.includes("Works") || slice.includes("work"));

console.log(failures === 0 ? "\nFOOTER LAYOUT OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
