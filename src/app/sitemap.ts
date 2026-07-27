import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";

const BASE = "https://mgcarchitectureph.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/estimate`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
