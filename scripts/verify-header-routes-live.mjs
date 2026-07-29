/**
 * Live HTTP check: every header destination returns 200 and expected markers.
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

const routes = [
  { path: "/work", must: ["Selected", "mgc architecture", "/work/"] },
  { path: "/process", must: ["How Your Project Moves Forward", "mgc architecture"] },
  { path: "/inquire", must: ["Tell Us About Your Project", "mgc architecture"] },
  { path: "/estimate", must: ["Cost", "mgc architecture"] },
  { path: "/faq", must: ["Got questions?", "mgc architecture"] },
  { path: "/about", must: ["About", "mgc architecture"] },
  { path: "/blog", must: ["Before you build", "mgc architecture"] },
  { path: "/contact", must: ["Planning a project", "mgc architecture"] },
  { path: "/", must: ['href="/work"', 'href="/faq"', 'href="/about"', 'href="/contact"'] },
];

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

for (const r of routes) {
  const url = `${BASE}${r.path}`;
  try {
    const res = await fetch(url, { cache: "no-store", redirect: "manual" });
    check(`${r.path} status 200`, res.status === 200, `status=${res.status}`);
    const html = await res.text();
    for (const m of r.must) {
      check(`${r.path} contains ${JSON.stringify(m)}`, html.includes(m));
    }
    check(`${r.path} no Next error overlay`, !html.includes("Application error") && !html.includes("Internal Server Error"));
  } catch (e) {
    check(`${r.path} reachable`, false, String(e));
  }
}

console.log(failures === 0 ? "\nHEADER ROUTES LIVE OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
