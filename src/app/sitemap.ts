import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog-server";
import { projects } from "@/lib/content";

const BASE = "https://mgcarchitectureph.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/work`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/process`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/estimate`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/inquire`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.9 },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

