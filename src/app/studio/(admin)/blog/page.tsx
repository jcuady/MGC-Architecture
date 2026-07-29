import BlogCrud from "@/components/studio/BlogCrud";
import { getAllBlogPosts } from "@/lib/blog-server";

export const dynamic = "force-dynamic";

export default async function StudioBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
        Content
      </p>
      <h1 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
        Blog
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/70">
        Create, edit, publish, or delete education articles. Published posts
        appear on /blog and in the landing Latest Articles strip. Seed copy
        matches blog.md.
      </p>
      <BlogCrud initial={posts} />
    </div>
  );
}
