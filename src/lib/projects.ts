/**
 * Portfolio projects — offline fallback + helpers (blog.ts pattern).
 * Public pages prefer DB via projects-server.
 */

export type {
  CapstoneCaseStudy,
  Project,
  ProjectImage,
  ProjectPiece,
} from "./content";

export { projects as defaultProjects } from "./content";

export function slugifyProject(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}
