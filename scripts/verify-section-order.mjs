/**
 * Assert landing-page section IDs appear in header-nav order.
 * Expected (anchors): work → process → services → calculator → faq → about → blog → contact
 * (Inquire nav → #contact; Cost Calculator nav → /estimate; calculator is the landing teaser.)
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

const EXPECTED = [
  "work",
  "process",
  "services",
  "calculator",
  "faq",
  "about",
  "blog",
  "contact",
];

const NAV_LABELS = [
  "Works",
  "Process",
  "Inquire",
  "Cost Calculator",
  "FAQ",
  "About",
  "Blog",
];

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();

const positions = EXPECTED.map((id) => {
  const re = new RegExp(`id=["']${id}["']`);
  const m = re.exec(html);
  return { id, index: m ? m.index : -1 };
});

for (const p of positions) {
  check(`#${p.id} present`, p.index >= 0, p.index >= 0 ? `at ${p.index}` : "missing");
}

for (let i = 1; i < positions.length; i++) {
  const prev = positions[i - 1];
  const cur = positions[i];
  if (prev.index < 0 || cur.index < 0) continue;
  check(
    `#${prev.id} before #${cur.id}`,
    prev.index < cur.index,
    `${prev.index} vs ${cur.index}`,
  );
}

// Header nav labels appear in architect order
let last = -1;
for (const label of NAV_LABELS) {
  const idx = html.indexOf(`>${label}<`);
  check(`nav label ${label}`, idx >= 0);
  if (idx >= 0) {
    check(`nav ${label} after previous`, idx > last, `${last} → ${idx}`);
    last = idx;
  }
}

check("Contact CTA present", html.includes(">Contact<"));
check("nav Process → /process", html.includes('href="/process"'));
check("landing process CTA", html.includes("Explore the full process"));

console.log(failures === 0 ? "\nSECTION ORDER OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
