// Verifies the CMS typography pipeline end-to-end:
// - default hero line2 is Lora italic
// - hero title SIZE is locked to the fluid .hero-title clamp (can't smash header)
// - font/italic overrides still apply on hero titles
// - size overrides still apply on the lede
// - reset reverts
// Usage: STUDIO_EMAIL=... STUDIO_PASSWORD=... node scripts/verify-typography.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => l.split("=", 2).map((s) => s.trim())),
);
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

let html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
check(
  "hero line2 renders in Lora italic by default",
  html.includes("font-family:var(--font-body)") && html.includes("font-style:italic"),
);
check(
  "hero stage uses collision-proof layout",
  html.includes("hero-title") && html.includes("--header-offset"),
);

if (!process.env.STUDIO_EMAIL || !process.env.STUDIO_PASSWORD) {
  console.error("Set STUDIO_EMAIL and STUDIO_PASSWORD env vars to run this check.");
  process.exit(1);
}
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
  email: process.env.STUDIO_EMAIL,
  password: process.env.STUDIO_PASSWORD,
});
check("admin signs in", !authError, authError?.message);
const token = auth.session?.access_token;

const { error: upsertError } = await supabase.from("site_content").upsert({
  key: "hero",
  data: {
    styles: {
      line1: { font: "body", size: 72, italic: true },
      lede: { size: 20 },
    },
  },
});
check("typography override saved", !upsertError, upsertError?.message);

await fetch(`${BASE}/api/revalidate`, {
  method: "POST",
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
check(
  "hero title font/italic override applies",
  html.includes("font-family:var(--font-body)") &&
    html.includes("font-style:italic") &&
    html.includes("Design with Purpose."),
);
check(
  "hero title SIZE override is ignored (fluid clamp wins)",
  !html.includes("font-size:72px"),
);
check(
  "hero lede SIZE override still applies",
  html.includes("font-size:20px"),
);

await supabase.from("site_content").delete().eq("key", "hero");
await fetch(`${BASE}/api/revalidate`, {
  method: "POST",
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
check("reset reverts lede size", !html.includes("font-size:20px"));

await supabase.auth.signOut();
console.log(failures === 0 ? "\nTYPOGRAPHY OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
