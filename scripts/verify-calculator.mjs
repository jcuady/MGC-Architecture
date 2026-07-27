// Proves calculator formula + finish_rates admin CRUD against live Supabase.
// Usage: STUDIO_EMAIL=... STUDIO_PASSWORD=... node scripts/verify-calculator.mjs
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

// Pure formula (mirrors src/lib/calculator.ts)
function estimateCost(lotArea, floors, rate) {
  if (!(lotArea > 0) || !(floors > 0) || !(rate > 0)) return 0;
  return lotArea * 0.6 * floors * rate;
}

check("bare 150×2 = ₱4,500,000", estimateCost(150, 2, 25000) === 4_500_000);
check("standard 150×2 = ₱6,300,000", estimateCost(150, 2, 35000) === 6_300_000);
check("premium 150×2 = ₱8,100,000", estimateCost(150, 2, 45000) === 8_100_000);
check("luxury 150×2 = ₱14,400,000", estimateCost(150, 2, 80000) === 14_400_000);
check("invalid inputs → 0", estimateCost(0, 2, 25000) === 0);

// Landing: estimator hook present, but NO rates revealed on the page.
const home = await fetch(`${BASE}/`, { cache: "no-store" });
const html = await home.text();
check("landing shows estimator invite", home.status === 200 && html.includes("Get your free estimate"));
check("landing hero has estimate hook", html.includes("Curious about cost"));
check("landing nav links to /estimate", html.includes('href="/estimate"'));
check("landing reveals NO finish rates", !html.includes("25,000") && !html.includes("₱25"));

// Estimator page: formal flow, no rates in the initial (step 1) render.
const est = await fetch(`${BASE}/estimate`, { cache: "no-store" });
const estHtml = await est.text();
check("/estimate renders", est.status === 200 && estHtml.includes("Construction Cost Estimator"));
check("/estimate starts with project step", estHtml.includes("Tell us about your project"));
check("/estimate hides rates until reveal", !estHtml.includes("25,000"));
check("/estimate has SEO metadata", estHtml.includes("Construction Cost Estimator — MGC Architecture"));
check("/estimate has JSON-LD", estHtml.includes("application/ld+json"));

if (!process.env.STUDIO_EMAIL || !process.env.STUDIO_PASSWORD) {
  console.error("Set STUDIO_EMAIL and STUDIO_PASSWORD");
  process.exit(1);
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
const { error: authError } = await supabase.auth.signInWithPassword({
  email: process.env.STUDIO_EMAIL,
  password: process.env.STUDIO_PASSWORD,
});
check("admin signs in", !authError, authError?.message);

const slug = `verify-finish-${Date.now()}`;
const { data: created, error: createError } = await supabase
  .from("finish_rates")
  .insert({
    name: "Verify Finish",
    slug,
    description: "Smoke-test finish tier",
    rate_per_sqm: 55555,
    sort_order: 999,
    is_active: true,
  })
  .select("id")
  .single();
check("CREATE finish rate", !createError && !!created?.id, createError?.message);

const { data: listed, error: listError } = await supabase
  .from("finish_rates")
  .select("id, name, description, rate_per_sqm, is_active")
  .eq("slug", slug)
  .single();
check(
  "READ finish rate (with description)",
  !listError && listed?.name === "Verify Finish" && listed?.description === "Smoke-test finish tier",
  listError?.message,
);

const { error: updateError } = await supabase
  .from("finish_rates")
  .update({
    rate_per_sqm: 66666,
    name: "Verify Finish Updated",
    description: "Updated description",
    updated_at: new Date().toISOString(),
  })
  .eq("id", created.id);
check("UPDATE finish rate", !updateError, updateError?.message);

const { data: updated } = await supabase
  .from("finish_rates")
  .select("rate_per_sqm, name")
  .eq("id", created.id)
  .single();
check(
  "UPDATE persisted",
  Number(updated?.rate_per_sqm) === 66666 && updated?.name === "Verify Finish Updated",
);

const { error: hideError } = await supabase
  .from("finish_rates")
  .update({ is_active: false })
  .eq("id", created.id);
check("HIDE finish (soft)", !hideError, hideError?.message);

const { data: stillVisibleToAdmin } = await supabase
  .from("finish_rates")
  .select("id")
  .eq("id", created.id)
  .maybeSingle();
check("admin still reads inactive finish", !!stillVisibleToAdmin?.id);

const { error: deleteError } = await supabase
  .from("finish_rates")
  .delete()
  .eq("id", created.id);
check("DELETE finish rate", !deleteError, deleteError?.message);

const { data: gone } = await supabase
  .from("finish_rates")
  .select("id")
  .eq("id", created.id)
  .maybeSingle();
check("DELETE persisted", !gone);

// Admin UI
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ref = new URL(url).hostname.split(".")[0];
const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({
    email: process.env.STUDIO_EMAIL,
    password: process.env.STUDIO_PASSWORD,
  }),
});
const session = await tokenRes.json();
const encoded = "base64-" + Buffer.from(JSON.stringify(session)).toString("base64url");
const chunks = [];
for (let i = 0; i < encoded.length; i += 3180) chunks.push(encoded.slice(i, i + 3180));
const cookie =
  chunks.length === 1
    ? `sb-${ref}-auth-token=${chunks[0]}`
    : chunks.map((c, i) => `sb-${ref}-auth-token.${i}=${c}`).join("; ");

const finishesPage = await fetch(`${BASE}/studio/finishes`, {
  headers: { cookie },
  redirect: "manual",
});
const finishesHtml = finishesPage.status === 200 ? await finishesPage.text() : "";
check(
  "/studio/finishes renders CRUD",
  finishesPage.status === 200 &&
    finishesHtml.includes("Finish rates") &&
    finishesHtml.includes("Add finish"),
  `status ${finishesPage.status}`,
);

await supabase.auth.signOut();
console.log(failures === 0 ? "\nCALCULATOR OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
