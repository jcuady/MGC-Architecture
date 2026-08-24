/**
 * Portfolio projects — offline fallback + helpers (blog.ts pattern).
 * Public pages prefer DB via projects-server.
 */

import type { ProjectCredit } from "./content";

export type {
  CapstoneCaseStudy,
  Project,
  ProjectCredit,
  ProjectImage,
  ProjectPiece,
} from "./content";

export {
  creditMgc,
  creditRclc,
  defaultCreditsForSlug,
  projects as defaultProjects,
} from "./content";

export function slugifyProject(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function parseCredits(value: unknown): ProjectCredit[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const logo = String(row.logo ?? "").trim();
      if (!logo) return null;
      const layout = row.layout === "logo" ? "logo" : "badge";
      return {
        name: String(row.name ?? "").trim(),
        logo,
        logoAlt: String(row.logoAlt ?? row.logo_alt ?? row.name ?? "").trim(),
        layout,
      };
    })
    .filter((x): x is ProjectCredit => Boolean(x));
}
