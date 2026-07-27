import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { projects } from "@/lib/content";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Editorial grid: the first project is featured full-width; the rest alternate
 * in a two-column rhythm. Every card routes to its full showcase page.
 */
export default function Work({ data }: { data: SiteContent["work"] }) {
  const [featured, ...rest] = projects;

  return (
    <section id="work" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          lede={data.lede}
          titleStyle={textStyle(data.styles?.title)}
          ledeStyle={textStyle(data.styles?.lede)}
        />

        {/* Featured project */}
        <Reveal className="mt-14">
          <Link href={`/work/${featured.slug}`} className="group block">
            <article>
              <div className="relative aspect-[16/9] overflow-hidden bg-warm-gray">
                <Image
                  src={featured.hero}
                  alt={featured.heroAlt}
                  fill
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-warm-gray/60 pb-6">
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-charcoal group-hover:text-chestnut">
                    {featured.name}
                    <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
                    {featured.category}
                  </p>
                </div>
                <p className="max-w-md leading-relaxed text-charcoal/75">
                  {featured.description}
                </p>
              </div>
            </article>
          </Link>
        </Reveal>

        {/* Remaining projects */}
        <div className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 90}>
              <Link href={`/work/${project.slug}`} className="group block">
                <article>
                  <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                    <Image
                      src={project.hero}
                      alt={project.heroAlt}
                      fill
                      sizes="(min-width: 1024px) 580px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-heading text-xl font-semibold text-charcoal group-hover:text-chestnut">
                        {project.name}
                        <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </h3>
                      <span className="shrink-0 font-heading text-xs text-charcoal/50">
                        {project.images.length} views
                      </span>
                    </div>
                    <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
                      {project.category}
                    </p>
                    <p className="mt-3 leading-relaxed text-charcoal/75">
                      {project.description}
                    </p>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
