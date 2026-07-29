import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const home = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const blog = await (await fetch(`${BASE}/blog`, { cache: "no-store" })).text();
const one = await (await fetch(`${BASE}/blog/before-you-build-read-this`, { cache: "no-store" })).text();

const sidebarSrc = readFileSync(join(root, "src/components/studio/Sidebar.tsx"), "utf8");
const migration = readFileSync(join(root, "supabase/migrations/0004_blog_posts.sql"), "utf8");

check("home loads", home.length > 2000);
check("blog index loads", blog.length > 2000);
check("blog post loads", one.length > 2000);

check("home Latest Articles points to /blog", home.includes("/blog/") || home.includes("href=\"/blog\""));
check("header blog nav points /blog", /href=\"\/blog\"[^>]*>Blog</.test(home));
check("blog hero title", blog.includes("Before you build, read this"));
check("blog has article links", (blog.match(/\/blog\//g) || []).length >= 4);
check("detail has breadcrumb Blog", one.includes("Blog</a>"));
check("detail has CTA start project", one.includes("Start a project"));

check("studio sidebar includes blog", sidebarSrc.includes('/studio/blog'));
check("migration defines blog_posts table", migration.includes("create table if not exists public.blog_posts"));
check("migration has RLS policies", migration.includes("enable row level security") && migration.includes("anyone reads published blog posts"));

console.log(failures === 0 ? "\nBLOG PAGES + ADMIN WIRING OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;


