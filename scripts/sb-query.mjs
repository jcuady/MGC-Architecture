// One-off helper: run SQL against the Supabase project via the Management API.
// Usage: node scripts/sb-query.mjs <file.sql | inline SQL string>
import { readFileSync, existsSync } from "node:fs";

const token = process.env.SB_TOKEN;
const ref = "nbdfkhzjmkppoohhjelg";
if (!token) {
  console.error("SB_TOKEN env var required");
  process.exit(1);
}

const arg = process.argv[2];
const query = existsSync(arg) ? readFileSync(arg, "utf8") : arg;

const res = await fetch(
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  },
);

const text = await res.text();
console.log(`HTTP ${res.status}`);
console.log(text.slice(0, 4000));
process.exit(res.ok ? 0 : 1);
