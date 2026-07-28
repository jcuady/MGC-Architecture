import Image from "next/image";
import type { Project } from "@/lib/content";

/** Next photoreal view that isn't the hero — used for hover swap. */
export function projectHoverImage(project: Project) {
  return (
    project.images.find((img) => img.kind === "render" && img.src !== project.hero) ??
    project.images.find((img) => img.src !== project.hero) ??
    null
  );
}

type Props = {
  project: Project;
  aspectClass: string;
  sizes: string;
  priority?: boolean;
};

/**
 * Work cover: hero by default, alternate gallery render on hover
 * (architect request). Only activates where hover exists — touch keeps hero.
 */
export default function ProjectCover({
  project,
  aspectClass,
  sizes,
  priority = false,
}: Props) {
  const hover = projectHoverImage(project);

  return (
    <div className={`relative overflow-hidden bg-warm-gray ${aspectClass}`}>
      <Image
        src={project.hero}
        alt={project.heroAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={
          hover
            ? "object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-0"
            : "object-cover transition-transform duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.04]"
        }
      />
      {hover ? (
        <Image
          src={hover.src}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-100"
        />
      ) : null}
    </div>
  );
}
