/**
 * Live credits CRUD + logo upload against MGC Supabase.
 * Env: SUPABASE_SERVICE_ROLE_KEY (or fetched via SUPABASE_ACCESS_TOKEN).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

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
let service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!service && process.env.SUPABASE_ACCESS_TOKEN) {
  const res = await fetch(
    "https://api.supabase.com/v1/projects/nbdfkhzjmkppoohhjelg/api-keys",
    {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    },
  );
  if (!res.ok) {
    console.error("FAIL  could not fetch API keys", res.status);
    process.exit(1);
  }
  const keys = await res.json();
  service = keys.find((k) => k.name === "service_role")?.api_key;
}

if (!service) {
  console.error(
    "Need SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ACCESS_TOKEN for live CRUD.",
  );
  process.exit(1);
}

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const email = `qa-credits-${Date.now()}@mgcarchitecture.com`;
const password = `QaCredits_${Date.now()}!x`;
const { data: created, error: createUserErr } =
  await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
check("create temp studio user", !createUserErr && !!created?.user?.id, createUserErr?.message);

const userId = created?.user?.id;
const sb = createClient(url, anon);
const { error: signErr } = await sb.auth.signInWithPassword({ email, password });
check("auth sign-in", !signErr, signErr?.message);

const logoPath = join(
  process.cwd(),
  "public/brand/monogram-chestnut.png",
);
check("logo fixture exists", existsSync(logoPath));

const logoBytes = readFileSync(logoPath);
const storagePath = `projects/qa-credits/credits/${Date.now()}-monogram.png`;
const { error: uploadErr } = await sb.storage
  .from("site")
  .upload(storagePath, logoBytes, {
    contentType: "image/png",
    upsert: true,
  });
check("authenticated credit logo upload", !uploadErr, uploadErr?.message);

const { data: pub } = sb.storage.from("site").getPublicUrl(storagePath);
const logoUrl = pub.publicUrl;
check("public logo URL", logoUrl.includes("/storage/v1/object/public/site/"));

const slug = `qa-credits-${Date.now()}`;
const credits = [
  {
    name: "QA Credit Org",
    logo: logoUrl,
    logoAlt: "QA Credit Org",
    layout: "badge",
  },
];

const { data: inserted, error: insertErr } = await sb
  .from("projects")
  .insert({
    slug,
    name: "QA Credits Project",
    category: "Residential",
    year: "2026",
    status: "Design",
    role: "QA",
    description: "qa",
    story: "qa",
    scope: ["QA"],
    hero: "/portfolio/c-house/c-house-01-exterior-view-1.png",
    hero_alt: "qa",
    images: [],
    credits,
    sort_order: 9999,
    is_published: true,
  })
  .select("id, slug, credits")
  .single();
check("create project with credits", !insertErr && !!inserted?.id, insertErr?.message);
check(
  "credits stored on insert",
  inserted?.credits?.[0]?.logo === logoUrl,
  JSON.stringify(inserted?.credits)?.slice(0, 120),
);

const { data: readAnon, error: readErr } = await createClient(url, anon)
  .from("projects")
  .select("slug, credits")
  .eq("slug", slug)
  .maybeSingle();
check("anon reads published credits", !readErr && readAnon?.credits?.length === 1, readErr?.message);

const updatedCredits = [
  ...credits,
  {
    name: "RC LLaguno Construction",
    logo: "/brand/rclc-logo.png",
    logoAlt: "RC LLaguno Construction",
    layout: "logo",
  },
];
const { error: updErr } = await sb
  .from("projects")
  .update({ credits: updatedCredits, updated_at: new Date().toISOString() })
  .eq("id", inserted.id);
check("update credits (add second logo)", !updErr, updErr?.message);

const { data: afterUpd } = await createClient(url, anon)
  .from("projects")
  .select("credits")
  .eq("id", inserted.id)
  .maybeSingle();
check("updated credits length 2", afterUpd?.credits?.length === 2);

const { error: clearErr } = await sb
  .from("projects")
  .update({ credits: [], updated_at: new Date().toISOString() })
  .eq("id", inserted.id);
check("clear credits (empty array)", !clearErr, clearErr?.message);

const { error: delErr } = await sb.from("projects").delete().eq("id", inserted.id);
check("delete project", !delErr, delErr?.message);

await sb.storage.from("site").remove([storagePath]);
if (userId) await admin.auth.admin.deleteUser(userId);

console.log(failures === 0 ? "\nCREDITS LIVE CRUD OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
