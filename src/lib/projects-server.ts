import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  defaultCreditsForSlug,
  defaultProjects,
  parseCredits,
  type CapstoneCaseStudy,
  type Project,
  type ProjectImage,
  type ProjectPiece,
} from "./projects";

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  year: string;
  status: string;
  location: string | null;
  role: string;
  description: string;
  story: string;
  scope: string[] | null;
  hero: string;
  hero_alt: string;
  images: unknown;
  pieces: unknown;
  capstone: unknown;
  credits: unknown;
  sort_order: number;
  is_published: boolean;
};

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function asImages(value: unknown): ProjectImage[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const src = String(row.src ?? "");
      const alt = String(row.alt ?? "");
      const kind = row.kind;
      if (!src) return null;
      if (kind !== "render" && kind !== "diagram" && kind !== "drawing") {
        return { src, alt, kind: "render" as const };
      }
      return { src, alt, kind };
    })
    .filter((x): x is ProjectImage => Boolean(x));
}

function asPieces(value: unknown): ProjectPiece[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      return {
        title: String(row.title ?? ""),
        picture: String(row.picture ?? ""),
        pictureAlt: String(row.pictureAlt ?? row.picture_alt ?? ""),
        diagram: String(row.diagram ?? ""),
        diagramAlt: String(row.diagramAlt ?? row.diagram_alt ?? ""),
      };
    })
    .filter((x): x is ProjectPiece => Boolean(x?.title && x.picture));
}

function asCapstone(value: unknown): CapstoneCaseStudy | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value as CapstoneCaseStudy;
}

function mapRow(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    year: row.year,
    status: row.status,
    location: row.location || undefined,
    role: row.role,
    description: row.description,
    story: row.story,
    scope: Array.isArray(row.scope) ? row.scope : [],
    hero: row.hero,
    heroAlt: row.hero_alt,
    images: asImages(row.images),
    pieces: asPieces(row.pieces),
    capstone: asCapstone(row.capstone),
    credits: (() => {
      const parsed = parseCredits(row.credits);
      return parsed.length ? parsed : defaultCreditsForSlug(row.slug);
    })(),
    sort_order: row.sort_order,
    is_published: row.is_published,
  };
}

const SELECT_BASE =
  "id, slug, name, category, year, status, location, role, description, story, scope, hero, hero_alt, images, pieces, capstone, sort_order, is_published";
const SELECT = `${SELECT_BASE}, credits`;

function withFallbackIds(list: Project[]): Project[] {
  return list.map((p, i) => ({
    ...p,
    id: p.id ?? `default-${p.slug}`,
    sort_order: p.sort_order ?? (i + 1) * 10,
    is_published: p.is_published ?? true,
    credits: p.credits?.length ? p.credits : defaultCreditsForSlug(p.slug),
  }));
}

function creditsColumnMissing(error: { message?: string; code?: string } | null) {
  if (!error) return false;
  const msg = error.message ?? "";
  return (
    error.code === "42703" ||
    msg.includes("credits") ||
    msg.includes("schema cache")
  );
}

/** Published projects for public pages. Falls back to content.ts seeds. */
export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  try {
    const client = anonClient();
    const primary = await client
      .from("projects")
      .select(SELECT)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    const fallback = creditsColumnMissing(primary.error)
      ? await client
          .from("projects")
          .select(SELECT_BASE)
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
      : null;
    const data = (fallback ?? primary).data as ProjectRow[] | null;
    const error = (fallback ?? primary).error;
    if (error || !data?.length) return withFallbackIds(defaultProjects);
    return data.map((row) => mapRow(row));
  } catch {
    return withFallbackIds(defaultProjects);
  }
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    try {
      const client = anonClient();
      const primary = await client
        .from("projects")
        .select(SELECT)
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      const fallback = creditsColumnMissing(primary.error)
        ? await client
            .from("projects")
            .select(SELECT_BASE)
            .eq("slug", slug)
            .eq("is_published", true)
            .maybeSingle()
        : null;
      const data = (fallback ?? primary).data as ProjectRow | null;
      const error = (fallback ?? primary).error;
      if (!error && data) return mapRow(data);
    } catch {
      /* fall through */
    }
    const fallback = defaultProjects.find((p) => p.slug === slug);
    return fallback ? withFallbackIds([fallback])[0] : null;
  },
);
