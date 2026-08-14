// Verify the admin pages render for an authenticated session by building the
// @supabase/ssr auth cookie and requesting each studio page through Next.js.
// Without STUDIO_EMAIL/STUDIO_PASSWORD, falls back to static route-marker checks.
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => l.split("=", 2).map((s) => s.trim())),
);

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ref = new URL(url).hostname.split(".")[0];

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// Always: studio routes exist in the tree.
check(
  "studio projects page exists",
  existsSync(join(root, "src/app/studio/(admin)/projects/page.tsx")),
);
check(
  "studio blog page exists",
  existsSync(join(root, "src/app/studio/(admin)/blog/page.tsx")),
);
const sidebar = readFileSync(
  join(root, "src/components/studio/Sidebar.tsx"),
  "utf8",
);
check("sidebar lists Projects", sidebar.includes('href: "/studio/projects"'));
check("sidebar lists Blog", sidebar.includes('href: "/studio/blog"'));

if (!process.env.STUDIO_EMAIL || !process.env.STUDIO_PASSWORD) {
  console.log(
    "\nSKIP live admin fetch — set STUDIO_EMAIL and STUDIO_PASSWORD to smoke authenticated pages.",
  );
  console.log(failures === 0 ? "\nADMIN UI MARKERS OK" : `\n${failures} FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({
    email: process.env.STUDIO_EMAIL,
    password: process.env.STUDIO_PASSWORD,
  }),
});
const session = await tokenRes.json();
if (!session.access_token) {
  console.log("FAIL  could not obtain session");
  process.exit(1);
}

// @supabase/ssr stores the session as base64url JSON, chunked if long.
const encoded =
  "base64-" +
  Buffer.from(JSON.stringify(session)).toString("base64url");
const chunks = [];
for (let i = 0; i < encoded.length; i += 3180) {
  chunks.push(encoded.slice(i, i + 3180));
}
const cookie =
  chunks.length === 1
    ? `sb-${ref}-auth-token=${chunks[0]}`
    : chunks.map((c, i) => `sb-${ref}-auth-token.${i}=${c}`).join("; ");

for (const [path, expect] of [
  ["/studio", "Dashboard"],
  ["/studio/inquiries", "Inquiries"],
  ["/studio/content", "Site Content"],
  ["/studio/content/hero", "Live preview"],
  ["/studio/content/footer", "Live preview"],
  ["/studio/content/showcaseNoir", "Live preview"],
  ["/studio/content/contact", "Live preview"],
  ["/studio/content/estimator", "Live preview"],
  ["/studio/content/services", "Live preview"],
  ["/studio/content/process", "Live preview"],
  ["/studio/finishes", "Finish rates"],
  ["/studio/blog", "Blog"],
  ["/studio/projects", "Projects"],
]) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { cookie },
    redirect: "manual",
  });
  const html = res.status === 200 ? await res.text() : "";
  const ok = res.status === 200 && html.includes(expect);
  check(`${path}`, ok, `status ${res.status}`);
}

console.log(failures === 0 ? "\nADMIN UI OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
