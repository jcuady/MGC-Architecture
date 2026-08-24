/**
 * Project credits CMS contract — schema, studio editor, public render.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const migration = readFileSync(
  join(root, "supabase/migrations/0008_project_credits.sql"),
  "utf8",
);
const crud = readFileSync(
  join(root, "src/components/studio/ProjectsCrud.tsx"),
  "utf8",
);
const page = readFileSync(join(root, "src/app/work/[slug]/page.tsx"), "utf8");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const projects = readFileSync(join(root, "src/lib/projects.ts"), "utf8");
const server = readFileSync(join(root, "src/lib/projects-server.ts"), "utf8");

check("0008 migration exists", existsSync(join(root, "supabase/migrations/0008_project_credits.sql")));
check("adds credits jsonb column", migration.includes("add column if not exists credits"));
check("seeds RC-only projects", migration.includes("c-house") && migration.includes("rclc-logo"));
check("ProjectCredit type", content.includes("export type ProjectCredit"));
check("parseCredits helper", projects.includes("export function parseCredits"));
check("server selects credits", server.includes("credits"));
check("studio credits editor", crud.includes("Project credits") && crud.includes("Add RCLC"));
check("studio persists credits", crud.includes("credits: d.credits"));
check("public page uses project.credits", page.includes("project.credits") || page.includes("credits.map"));
check("no hard-coded underRc gate", !page.includes("underRc"));

console.log(failures === 0 ? "\nPROJECT CREDITS OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
