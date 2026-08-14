import ProjectsCrud from "@/components/studio/ProjectsCrud";
import { getAllProjects } from "@/lib/projects-admin";

export const dynamic = "force-dynamic";

export default async function StudioProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
        Portfolio
      </p>
      <h1 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
        Projects
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/70">
        Create, edit, publish, or delete portfolio works. Published projects
        appear on /work and the homepage Works grid. Site Content → Work only
        edits the section header copy.
      </p>
      <ProjectsCrud initial={projects} />
    </div>
  );
}
