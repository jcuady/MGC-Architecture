import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  defaultBlogPosts,
  type BlogPost,
  type BlogPostCard,
  toBlogCard,
} from "./blog";

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function mapRow(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    body: String(row.body ?? ""),
    cover_image: String(row.cover_image ?? ""),
    cover_alt: String(row.cover_alt ?? ""),
    read_mins: Number(row.read_mins) || 3,
    sort_order: Number(row.sort_order) || 0,
    is_published: Boolean(row.is_published),
    published_at: String(row.published_at ?? new Date().toISOString()),
  };
}

const SELECT =
  "id, title, slug, excerpt, body, cover_image, cover_alt, read_mins, sort_order, is_published, published_at";

/** Published posts for public pages (cached per request). Falls back to blog.md seeds. */
export const getPublishedPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await anonClient()
      .from("blog_posts")
      .select(SELECT)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("published_at", { ascending: false });
    if (error || !data?.length) return defaultBlogPosts.filter((p) => p.is_published);
    return data.map(mapRow);
  } catch {
    return defaultBlogPosts.filter((p) => p.is_published);
  }
});

export const getPublishedPostCards = cache(async (): Promise<BlogPostCard[]> => {
  const posts = await getPublishedPosts();
  return posts.map(toBlogCard);
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await anonClient()
      .from("blog_posts")
      .select(SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!error && data) return mapRow(data);
  } catch {
    /* fall through */
  }
  return defaultBlogPosts.find((p) => p.slug === slug && p.is_published) ?? null;
});

/** All posts for studio (including drafts). Uses cookie session client. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { createClient: createServerClient } = await import("@/lib/supabase/server");
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });
  if (error || !data) return defaultBlogPosts;
  return data.map(mapRow);
}
