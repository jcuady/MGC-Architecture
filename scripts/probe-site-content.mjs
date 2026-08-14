/**
 * Live site_content read path (anon). Write requires authenticated studio session.
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

const sb = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const read = await sb.from("site_content").select("key, data").limit(5);
check("anon can select site_content", !read.error, read.error?.message);
check(
  "site_content schema uses key column",
  !read.error && Array.isArray(read.data),
);

const write = await sb.from("site_content").upsert({
  key: "_anon_probe_should_fail",
  data: { ok: true },
  updated_at: new Date().toISOString(),
});
check(
  "anon cannot upsert site_content (RLS)",
  !!write.error,
  write.error ? write.error.code : "unexpectedly allowed",
);

console.log(failures === 0 ? "\nSITE CONTENT LIVE OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
