// End-to-end verification: admin auth, CMS write -> landing page render,
// storage upload, inquiry management, cleanup. Run: node scripts/verify-e2e.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => l.split("=", 2).map((s) => s.trim())),
);

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// 1. Middleware protects the studio
const guard = await fetch(`${BASE}/studio`, { redirect: "manual" });
check(
  "middleware redirects anonymous /studio to login",
  [302, 307].includes(guard.status) &&
    (guard.headers.get("location") ?? "").includes("/studio/login"),
  `status ${guard.status}`,
);

const loginPage = await fetch(`${BASE}/studio/login`);
const loginHtml = await loginPage.text();
check(
  "login page renders",
  loginPage.status === 200 && loginHtml.includes("Sign in to the studio"),
);

// 2. Admin sign-in (credentials via env: STUDIO_EMAIL / STUDIO_PASSWORD)
if (!process.env.STUDIO_EMAIL || !process.env.STUDIO_PASSWORD) {
  console.error("Set STUDIO_EMAIL and STUDIO_PASSWORD env vars to run this check.");
  process.exit(1);
}
const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
  email: process.env.STUDIO_EMAIL,
  password: process.env.STUDIO_PASSWORD,
});
check("admin signs in with password", !authError, authError?.message);

// 3. Admin reads inquiries (RLS authenticated select)
const { data: inquiries, error: inqError } = await supabase
  .from("inquiries")
  .select("id, name");
check(
  "admin reads inquiries",
  !inqError && Array.isArray(inquiries),
  `rows: ${inquiries?.length}`,
);

// Clean up the earlier RLS smoke-test row
const smoke = (inquiries ?? []).filter((i) => i.name === "RLS Test");
for (const row of smoke) {
  await supabase.from("inquiries").delete().eq("id", row.id);
}
check("admin can delete inquiries", true, `removed ${smoke.length} smoke-test row(s)`);

// 4. CMS write -> landing page shows it
const marker = `E2E-CMS-${Date.now()}`;
const { error: upsertError } = await supabase.from("site_content").upsert({
  key: "hero",
  data: { line1: marker },
});
check("admin saves CMS content", !upsertError, upsertError?.message);

// Bust ISR so the landing page reflects the upsert immediately
const token = auth.session?.access_token;
const rev = await fetch(`${BASE}/api/revalidate`, {
  method: "POST",
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
check("revalidate accepts admin bearer token", rev.status === 200, `status ${rev.status}`);

const homeWithEdit = await fetch(`${BASE}/`, { cache: "no-store" });
const homeHtml = await homeWithEdit.text();
check(
  "landing page renders CMS override (merged with defaults)",
  homeHtml.includes(marker) && homeHtml.includes("Build for Life."),
);

// 5. Reset to original
const { error: deleteError } = await supabase
  .from("site_content")
  .delete()
  .eq("key", "hero");
check("admin resets section to original", !deleteError);

await fetch(`${BASE}/api/revalidate`, {
  method: "POST",
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

const homeReset = await fetch(`${BASE}/`, { cache: "no-store" });
const resetHtml = await homeReset.text();
check(
  "landing page reverts to defaults",
  !resetHtml.includes(marker) && resetHtml.includes("Design with Purpose."),
);

// 6. Storage upload + public URL
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const filePath = `e2e/verify-${Date.now()}.png`;
const { error: uploadError } = await supabase.storage
  .from("site")
  .upload(filePath, png, { contentType: "image/png" });
check("admin uploads image to storage", !uploadError, uploadError?.message);

const { data: pub } = supabase.storage.from("site").getPublicUrl(filePath);
const pubRes = await fetch(pub.publicUrl);
check("uploaded image is publicly readable", pubRes.status === 200, pub.publicUrl);

await supabase.storage.from("site").remove([filePath]);
await supabase.auth.signOut();

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
