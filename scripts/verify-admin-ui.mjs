// Verify the admin pages render for an authenticated session by building the
// @supabase/ssr auth cookie and requesting each studio page through Next.js.
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => l.split("=", 2).map((s) => s.trim())),
);

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ref = new URL(url).hostname.split(".")[0];

if (!process.env.STUDIO_EMAIL || !process.env.STUDIO_PASSWORD) {
  console.error("Set STUDIO_EMAIL and STUDIO_PASSWORD env vars to run this check.");
  process.exit(1);
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

let failures = 0;
for (const [path, expect] of [
  ["/studio", "Dashboard"],
  ["/studio/inquiries", "Inquiries"],
  ["/studio/content", "Site Content"],
  ["/studio/content/hero", "Live preview"],
  // Preview variants with their own render paths
  ["/studio/content/footer", "Live preview"],
  ["/studio/content/showcaseNoir", "Live preview"],
  ["/studio/content/contact", "Live preview"],
  ["/studio/content/estimator", "Live preview"],
  ["/studio/content/services", "Live preview"],
  ["/studio/content/process", "Live preview"],
  ["/studio/finishes", "Finish rates"],
]) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { cookie },
    redirect: "manual",
  });
  const html = res.status === 200 ? await res.text() : "";
  const ok = res.status === 200 && html.includes(expect);
  console.log(`${ok ? "PASS" : "FAIL"}  ${path} — status ${res.status}`);
  if (!ok) failures++;
}

console.log(failures === 0 ? "\nADMIN UI OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
