/**
 * Projects CRUD contract — schema migration, studio UI, public wiring.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const migration = readFileSync(
  join(root, "supabase/migrations/0006_projects.sql"),
  "utf8",
);
const crud = readFileSync(
  join(root, "src/components/studio/ProjectsCrud.tsx"),
  "utf8",
);
const page = readFileSync(
  join(root, "src/app/studio/(admin)/projects/page.tsx"),
  "utf8",
);
const sidebar = readFileSync(
  join(root, "src/components/studio/Sidebar.tsx"),
  "utf8",
);
const work = readFileSync(
  join(root, "src/components/sections/Work.tsx"),
  "utf8",
);
const slugPage = readFileSync(
  join(root, "src/app/work/[slug]/page.tsx"),
  "utf8",
);
const server = readFileSync(join(root, "src/lib/projects-server.ts"), "utf8");

check("0006_projects.sql exists", existsSync(join(root, "supabase/migrations/0006_projects.sql")));
check("projects table DDL", migration.includes("create table if not exists public.projects"));
check("projects RLS policies", migration.includes("anyone reads published projects"));
check("projects seed inserts", migration.includes("on conflict (slug) do nothing"));
check("ProjectsCrud component", crud.includes("from(\"projects\")") && crud.includes("Create project"));
check("studio projects page", page.includes("ProjectsCrud") && page.includes("getAllProjects"));
check("sidebar Projects link", sidebar.includes('href: "/studio/projects"'));
check("Work uses getPublishedProjects", work.includes("getPublishedProjects"));
check("work slug uses projects-server", slugPage.includes("getPublishedProjects"));
check("fallback to defaultProjects", server.includes("defaultProjects"));
check("pending SQL bundle", existsSync(join(root, "supabase/migrations/_pending_studio_apply.sql")));

console.log(failures === 0 ? "\nPROJECTS CRUD OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
