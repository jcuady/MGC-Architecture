/**
 * Emit 0006_projects.sql seed from content.ts defaults.
 * Run: node scripts/generate-projects-migration.mjs
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load TS via dynamic import of compiled path — instead parse content with a small eval of projects export by importing from a temp approach:
// Use tsx if available; else read and JSON-stringify from a hardcoded import using next's transpile.
async function main() {
  let projects;
  try {
    const mod = await import(
      pathToFileURL(join(root, "src/lib/content.ts")).href
    );
    projects = mod.projects;
  } catch {
    // Fallback: spawn tsx
    const { execSync } = await import("node:child_process");
    const out = execSync(
      `npx --yes tsx -e "import { projects } from './src/lib/content.ts'; console.log(JSON.stringify(projects))"`,
      { cwd: root, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
    );
    projects = JSON.parse(out.trim().split("\n").pop());
  }

  const sqlEscape = (s) => String(s ?? "").replace(/'/g, "''");
  const jsonb = (v) => {
    if (v == null) return "null";
    return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
  };

  const inserts = projects
    .map((p, i) => {
      const sort = (i + 1) * 10;
      const location = p.location
        ? `'${sqlEscape(p.location)}'`
        : "null";
      const scope = `array[${(p.scope || [])
        .map((s) => `'${sqlEscape(s)}'`)
        .join(", ")}]::text[]`;
      return `(
  '${sqlEscape(p.slug)}',
  '${sqlEscape(p.name)}',
  '${sqlEscape(p.category)}',
  '${sqlEscape(p.year)}',
  '${sqlEscape(p.status)}',
  ${location},
  '${sqlEscape(p.role)}',
  '${sqlEscape(p.description)}',
  '${sqlEscape(p.story)}',
  ${scope},
  '${sqlEscape(p.hero)}',
  '${sqlEscape(p.heroAlt)}',
  ${jsonb(p.images)},
  ${jsonb(p.pieces ?? null)},
  ${jsonb(p.capstone ?? null)},
  ${sort},
  true
)`;
    })
    .join(",\n");

  const sql = `-- Portfolio projects for /work and studio CRUD.
-- Public reads published rows; authenticated admins full CRUD.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  name text not null,
  category text not null default '',
  year text not null default '',
  status text not null default '',
  location text,
  role text not null default '',
  description text not null default '',
  story text not null default '',
  scope text[] not null default '{}',
  hero text not null default '',
  hero_alt text not null default '',
  images jsonb not null default '[]'::jsonb,
  pieces jsonb,
  capstone jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create index if not exists projects_published_sort_idx
  on public.projects (is_published, sort_order);

alter table public.projects enable row level security;

drop policy if exists "anyone reads published projects" on public.projects;
create policy "anyone reads published projects"
  on public.projects for select
  to anon, authenticated
  using (is_published = true or auth.role() = 'authenticated');

drop policy if exists "admin inserts projects" on public.projects;
create policy "admin inserts projects"
  on public.projects for insert
  to authenticated
  with check (true);

drop policy if exists "admin updates projects" on public.projects;
create policy "admin updates projects"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin deletes projects" on public.projects;
create policy "admin deletes projects"
  on public.projects for delete
  to authenticated
  using (true);

insert into public.projects (
  slug, name, category, year, status, location, role, description, story,
  scope, hero, hero_alt, images, pieces, capstone, sort_order, is_published
) values
${inserts}
on conflict (slug) do nothing;
`;

  const outPath = join(root, "supabase/migrations/0006_projects.sql");
  writeFileSync(outPath, sql, "utf8");
  console.log("Wrote", outPath, "rows", projects.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
