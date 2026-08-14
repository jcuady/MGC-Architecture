/**
 * Auth site_content upsert/reset using a temp user + service role cleanup.
 * Env: SUPABASE_SERVICE_ROLE_KEY required.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i < 0) continue;
  let v = t.slice(i + 1).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  env[t.slice(0, i).trim()] = v;
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!service) {
  console.error("Need SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const email = `qa-cms-${Date.now()}@mgcarchitecture.com`;
const password = `QaCms_${Date.now()}!x`;
const { data: u, error: cErr } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});
if (cErr) {
  console.error(cErr.message);
  process.exit(1);
}

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

try {
  const sb = createClient(url, anon);
  const { error: authErr } = await sb.auth.signInWithPassword({ email, password });
  check("cms auth", !authErr, authErr?.message);

  const key = "hero";
  const marker = `QA Eyebrow ${Date.now()}`;
  const { data: before } = await sb
    .from("site_content")
    .select("data")
    .eq("key", key)
    .maybeSingle();
  const payload = { ...(before?.data || { eyebrow: "x", line1: "a", line2: "b", lede: "c", image: "/x.png", primaryCta: "p", secondaryCta: "s", estimateCta: "e", proofStat: "1", proofLabel: "l", proofImages: [] }), eyebrow: marker };

  const { error: upErr } = await sb.from("site_content").upsert({
    key,
    data: payload,
    updated_at: new Date().toISOString(),
  });
  check("auth upsert site_content", !upErr, upErr?.message);

  const { data: after } = await sb
    .from("site_content")
    .select("data")
    .eq("key", key)
    .maybeSingle();
  check("readback matches", after?.data?.eyebrow === marker);

  const { error: delErr } = await sb.from("site_content").delete().eq("key", key);
  check("reset delete", !delErr, delErr?.message);
} finally {
  await admin.auth.admin.deleteUser(u.user.id);
}

console.log(failures === 0 ? "\nCMS SAVE QA OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
