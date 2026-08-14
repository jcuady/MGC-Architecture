/**
 * Frontend QA against a running Next server (default :3847).
 * Proves /work and /blog render DB-backed content.
 */
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store", redirect: "manual" });
  const html = res.status === 200 ? await res.text() : "";
  return { status: res.status, html };
}

try {
  const home = await get("/");
  check("GET /", home.status === 200);
} catch (e) {
  console.error(`Server not reachable at ${BASE}: ${e.message}`);
  process.exit(1);
}

const work = await get("/work");
check("GET /work", work.status === 200);
check("/work shows C-House", work.html.includes("C-House") || work.html.includes("C House"));
check("/work shows project link", work.html.includes("/work/c-house"));

const detail = await get("/work/c-house");
check("GET /work/c-house", detail.status === 200);
check("/work/c-house has story content", detail.html.length > 2000);

const blog = await get("/blog");
check("GET /blog", blog.status === 200);
check("/blog lists Before You Build", blog.html.includes("Before You Build"));
check("/blog links to slug", blog.html.includes("/blog/before-you-build-read-this"));

const post = await get("/blog/before-you-build-read-this");
check("GET blog slug", post.status === 200);

const sitemap = await get("/sitemap.xml");
check("sitemap includes /work/c-house", sitemap.status === 200 && sitemap.html.includes("/work/c-house"));
check("sitemap includes blog slug", sitemap.html.includes("/blog/before-you-build-read-this"));

console.log(failures === 0 ? "\nFRONTEND PUBLIC QA OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
