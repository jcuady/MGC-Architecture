/**
 * Principal QA — live MGC Supabase backend for blog_posts + projects.
 * Usage: node scripts/qa-studio-backend.mjs
 * Optional: STUDIO_EMAIL / STUDIO_PASSWORD for authenticated CRUD.
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
const sb = createClient(url, anon);

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

// --- Public reads ---
const blogs = await sb
  .from("blog_posts")
  .select("id, slug, title, is_published, cover_image")
  .eq("is_published", true)
  .order("sort_order");
check("published blog_posts readable", !blogs.error && (blogs.data?.length ?? 0) >= 4, blogs.error?.message);
check(
  "blog covers use /blog/ paths",
  (blogs.data ?? []).every((p) => String(p.cover_image).includes("/blog/")),
);

const projects = await sb
  .from("projects")
  .select("id, slug, name, is_published, hero, images")
  .eq("is_published", true)
  .order("sort_order");
check("published projects readable", !projects.error && (projects.data?.length ?? 0) >= 8, projects.error?.message);
check(
  "projects have hero + images jsonb",
  (projects.data ?? []).every(
    (p) => p.hero && Array.isArray(p.images) && p.images.length > 0,
  ),
);

const slug = projects.data?.[0]?.slug;
if (slug) {
  const one = await sb.from("projects").select("slug, name").eq("slug", slug).maybeSingle();
  check(`get project by slug (${slug})`, !one.error && one.data?.slug === slug, one.error?.message);
}

// --- Anon write denied ---
const anonBlog = await sb.from("blog_posts").insert({
  title: "qa-anon",
  slug: `qa-anon-${Date.now()}`,
  excerpt: "x",
  body: "x",
});
check("anon cannot insert blog_posts", !!anonBlog.error, anonBlog.error?.code);

const anonProj = await sb.from("projects").insert({
  slug: `qa-anon-${Date.now()}`,
  name: "qa",
  category: "x",
  year: "2026",
  status: "x",
  role: "x",
  description: "x",
  story: "x",
  hero: "/x.png",
  hero_alt: "x",
  images: [],
});
check("anon cannot insert projects", !!anonProj.error, anonProj.error?.code);

// --- Auth CRUD (optional) ---
if (process.env.STUDIO_EMAIL && process.env.STUDIO_PASSWORD) {
  const authSb = createClient(url, anon);
  const { data: auth, error: authError } = await authSb.auth.signInWithPassword({
    email: process.env.STUDIO_EMAIL,
    password: process.env.STUDIO_PASSWORD,
  });
  check("studio auth sign-in", !authError && !!auth.session, authError?.message);

  if (auth.session) {
    const testSlug = `qa-proj-${Date.now()}`;
    const { data: created, error: createErr } = await authSb
      .from("projects")
      .insert({
        slug: testSlug,
        name: "QA Temp Project",
        category: "Residential",
        year: "2026",
        status: "Concept",
        role: "Architect",
        description: "qa",
        story: "qa",
        hero: "/portfolio/c-house/c-house-01-exterior-view-1.png",
        hero_alt: "qa",
        images: [{ src: "/portfolio/c-house/c-house-01-exterior-view-1.png", alt: "qa", kind: "render" }],
        sort_order: 999,
        is_published: false,
      })
      .select("id, slug, is_published")
      .single();
    check("auth can insert unpublished project", !createErr && created?.id, createErr?.message);

    if (created?.id) {
      const pub = await sb
        .from("projects")
        .select("id")
        .eq("id", created.id)
        .eq("is_published", true);
      check(
        "anon cannot see unpublished project",
        !pub.error && (pub.data?.length ?? 0) === 0,
        pub.error?.message,
      );

      const { error: updErr } = await authSb
        .from("projects")
        .update({ is_published: true, name: "QA Temp Project Published" })
        .eq("id", created.id);
      check("auth can publish project", !updErr, updErr?.message);

      const seen = await sb.from("projects").select("slug").eq("slug", testSlug).maybeSingle();
      check("anon sees published project", !seen.error && seen.data?.slug === testSlug);

      const { error: delErr } = await authSb.from("projects").delete().eq("id", created.id);
      check("auth can delete project", !delErr, delErr?.message);
    }

    const blogSlug = `qa-blog-${Date.now()}`;
    const { data: post, error: postErr } = await authSb
      .from("blog_posts")
      .insert({
        title: "QA Temp Post",
        slug: blogSlug,
        excerpt: "qa",
        body: "qa body",
        cover_image: "/blog/blog-01-before-you-build.png",
        cover_alt: "qa",
        read_mins: 2,
        sort_order: 999,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    check("auth can insert blog post", !postErr && post?.id, postErr?.message);
    if (post?.id) {
      const { error: delBlog } = await authSb.from("blog_posts").delete().eq("id", post.id);
      check("auth can delete blog post", !delBlog, delBlog?.message);
    }
  }
} else {
  console.log("\nSKIP auth CRUD — set STUDIO_EMAIL and STUDIO_PASSWORD for full write path.");
}

console.log(failures === 0 ? "\nBACKEND QA OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
