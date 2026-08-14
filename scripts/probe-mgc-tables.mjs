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

console.log("url", env.NEXT_PUBLIC_SUPABASE_URL);
const sb = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
for (const t of [
  "inquiries",
  "site_content",
  "finish_rates",
  "blog_posts",
  "projects",
]) {
  const col = t === "site_content" ? "key" : "id";
  const r = await sb.from(t).select(col, { count: "exact" }).limit(1);
  if (r.error) {
    console.log(t + ":", `ERR ${r.error.code} ${r.error.message}`);
  } else {
    console.log(t + ":", `OK count=${r.count} rows=${(r.data || []).length}`);
  }
}
