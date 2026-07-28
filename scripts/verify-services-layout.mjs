// Smoke-check: architect Services split-pane layout
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

const WORK_HEROES = [
  "/portfolio/c-house/c-house-01-exterior-view-1.png",
  "/portfolio/tile-co/tile-co-interior-view-1.png",
  "/portfolio/the-noir/the-noir-living-view-1.png",
  "/portfolio/the-hearth/the-hearth-kitchen-view-1.png",
  "/portfolio/guest-quarter/guest-quarter-view-1.png",
  "/portfolio/capstone/archi-capstone-exterior-view-1.png",
  "/portfolio/saro/saro-view-1.png",
  "/portfolio/built-in/built-in-proj-01-view.png",
];

/** Must match cms.ts serviceImages — unique, non-hero assets */
const SERVICE_IMAGES = [
  "/portfolio/c-house/c-house-02-exterior-view-3.png",
  "/portfolio/the-hearth/the-hearth-kitchen-view-2.png",
  "/portfolio/built-in/built-in-proj-02-view.png",
  "/portfolio/capstone/archi-capstone-axonometric-view-1.png",
  "/portfolio/tile-co/tile-co-interior-view-3.png",
  "/portfolio/the-noir/the-noir-living-view-4.png",
];

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const servicesIdx = html.indexOf('id="services"');
const calcIdx = html.indexOf('id="calculator"');
const slice =
  servicesIdx >= 0
    ? html.slice(servicesIdx, calcIdx > servicesIdx ? calcIdx : servicesIdx + 30000)
    : "";

check("services section present", servicesIdx >= 0);
check("professional notice present", slice.includes("Professional Notice"));
check(
  "notice before service tabs",
  (() => {
    const n = slice.indexOf("Professional Notice");
    const t = slice.indexOf("tablist");
    return n >= 0 && t > n;
  })(),
);
check("split-pane tablist", slice.includes("tablist"));
check("tabpanel present", slice.includes("tabpanel"));
check("Inquire Now CTA", slice.includes("Inquire Now"));
check("Architectural Design", slice.includes("Architectural Design"));
check("Renovation & Remodeling", slice.includes("Renovation"));
check("sub-category tags", slice.includes("Residential Design"));
check("active charcoal tab styling", slice.includes("bg-charcoal"));
check(
  "default panel uses dedicated service image",
  slice.includes("c-house-02-exterior-view-3.png"),
);

const overlap = SERVICE_IMAGES.filter((img) => WORK_HEROES.includes(img));
check("service images ≠ Works heroes (catalog)", overlap.length === 0, overlap.join(", "));

for (const hero of WORK_HEROES) {
  const file = hero.split("/").pop();
  check(`services markup excludes Works hero ${file}`, !slice.includes(file));
}

console.log(failures === 0 ? "\nSERVICES LAYOUT OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
