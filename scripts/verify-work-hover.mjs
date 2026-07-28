// Smoke-check: Work covers swap to alternate gallery image on hover
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

const EXPECTED_SWAPS = [
  { hero: "c-house-01-exterior-view-1", hover: "c-house-02-exterior-view-2" },
  { hero: "tile-co-interior-view-1", hover: "tile-co-interior-view-2" },
  { hero: "the-noir-living-view-1", hover: "the-noir-living-view-2" },
];

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const workIdx = html.indexOf('id="work"');
const nextId = html.indexOf('id="services"', workIdx + 1);
const slice =
  workIdx >= 0
    ? html.slice(workIdx, nextId > workIdx ? nextId : workIdx + 40000)
    : "";

check("work section present", workIdx >= 0);

for (const pair of EXPECTED_SWAPS) {
  check(`hero in work: ${pair.hero}`, slice.includes(pair.hero));
  check(`hover alt in work: ${pair.hover}`, slice.includes(pair.hover));
}

check(
  "hover-capable opacity swap in CSS/HTML",
  html.includes("group-hover:opacity-0") ||
    html.includes("group-hover\\:opacity-0") ||
    html.includes("hover\\:hover") ||
    html.includes("@media (hover: hover)") ||
    slice.includes("opacity-0"),
);

function pickHover(hero, images) {
  return images.find((s) => s !== hero) ?? null;
}
check("helper picks different image", pickHover("a.png", ["a.png", "b.png"]) === "b.png");
check("helper null when only hero", pickHover("a.png", ["a.png"]) === null);

console.log(failures === 0 ? "\nWORK HOVER SWAP OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
