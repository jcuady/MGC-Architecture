import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/Reveal";
import CapstoneCaseStudy from "@/components/work/CapstoneCaseStudy";
import {
  getProjectBySlug,
  getPublishedProjects,
} from "@/lib/projects-server";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.category}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.name} | MGC Architecture`,
      description: project.description,
      images: [project.hero],
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const credits = project.credits ?? [];
  const pieces = project.pieces ?? [];
  const capstone = project.capstone;

  const renders = project.images.filter((img) => img.kind === "render");
  const drawings = project.images.filter((img) => img.kind !== "render");
  // Two-up gallery: lead with the next render + reuse the hero beside it, then the rest.
  const rest = renders.filter((img) => img.src !== project.hero);
  const heroImg =
    renders.find((img) => img.src === project.hero) ?? {
      src: project.hero,
      alt: project.heroAlt,
      kind: "render" as const,
    };
  const gallery = rest.length === 0 ? renders : [rest[0], heroImg, ...rest.slice(1)];
  const showPairedPieces = pieces.length > 0;
  const showCapstone = Boolean(capstone);

  return (
    <>
      <Header />
      <main id="main">
        {/* Full-screen project hero */}
        <section className="relative flex h-svh min-h-[32rem] flex-col justify-end overflow-hidden bg-charcoal">
          <Image
            src={project.hero}
            alt={project.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2f2a28]/90 via-[#2f2a28]/30 to-[#2f2a28]/35" />

          <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 sm:pb-20">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-warm-white/70">
                <li>
                  <Link href="/work" className="link-draw">
                    Work
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-warm-white">{project.name}</li>
              </ol>
            </nav>
            <h1 className="mt-6 max-w-4xl font-heading text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight text-warm-white">
              {project.name}
            </h1>
            <p className="mt-4 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-beige">
              {project.category}
            </p>
          </div>
        </section>

        {/* Meta + story */}
        <section className="border-b border-warm-gray/60">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-20">
              <Reveal>
                <p className="text-lg leading-relaxed text-charcoal/85 sm:text-xl">
                  {project.story}
                </p>
              </Reveal>
              <Reveal delay={100}>
                <dl className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                        Year
                      </dt>
                      <dd className="mt-2 font-heading text-sm text-charcoal">
                        {project.year}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                        Status
                      </dt>
                      <dd className="mt-2 font-heading text-sm text-charcoal">
                        {project.status}
                      </dd>
                    </div>
                    {project.location ? (
                      <div className="col-span-2">
                        <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                          Location
                        </dt>
                        <dd className="mt-2 font-heading text-sm text-charcoal">
                          {project.location}
                        </dd>
                      </div>
                    ) : null}
                    <div className="col-span-2">
                      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                        Role
                      </dt>
                      <dd className="mt-2 font-heading text-sm leading-relaxed text-charcoal">
                        {project.role}
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                      Scope
                    </dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {project.scope.map((item) => (
                        <span
                          key={item}
                          className="border border-warm-gray px-3 py-1.5 font-heading text-xs font-medium text-charcoal/80"
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                  {credits.length > 0 ? (
                    <div className="border-t border-warm-gray/60 pt-6">
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                        Project credits
                      </p>
                      <ul className="mt-4 flex flex-wrap items-center gap-6 sm:gap-8">
                        {credits.map((credit) => (
                          <li
                            key={`${credit.logo}-${credit.name}`}
                            className="flex items-center gap-2.5"
                          >
                            {credit.layout === "badge" ? (
                              <>
                                <Image
                                  src={credit.logo}
                                  alt=""
                                  width={40}
                                  height={40}
                                  className="h-9 w-9 object-contain"
                                />
                                <span className="font-heading text-sm font-semibold tracking-[0.04em] text-charcoal">
                                  {credit.name}
                                </span>
                              </>
                            ) : (
                              <Image
                                src={credit.logo}
                                alt={credit.logoAlt || credit.name}
                                width={200}
                                height={72}
                                className="h-12 w-auto object-contain sm:h-14"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Gallery — Capstone case study, paired pieces, or standard two-up renders */}
        {showCapstone && capstone ? (
          <CapstoneCaseStudy data={capstone} />
        ) : showPairedPieces ? (
          <section aria-label={`${project.name} pieces`}>
            <div className="mx-auto max-w-7xl space-y-16 px-5 py-16 sm:px-8 sm:py-20 sm:space-y-20">
              {pieces.map((piece, i) => (
                <Reveal key={piece.title} delay={(i % 2) * 60}>
                  <article>
                    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                      <figure>
                        <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                          <Image
                            src={piece.picture}
                            alt={piece.pictureAlt}
                            fill
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="mt-3 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                          Picture
                        </figcaption>
                      </figure>
                      <figure>
                        <div className="relative aspect-[4/3] overflow-hidden bg-beige">
                          <Image
                            src={piece.diagram}
                            alt={piece.diagramAlt}
                            fill
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="object-contain p-3 sm:p-5"
                          />
                        </div>
                        <figcaption className="mt-3 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                          Diagram
                        </figcaption>
                      </figure>
                    </div>
                    <div className="mt-5 border-t border-warm-gray/60 pt-4">
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                        Project {String(i + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 font-heading text-xl font-semibold text-charcoal sm:text-2xl">
                        {piece.title}
                      </h2>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section aria-label={`${project.name} gallery`}>
              <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                  {gallery.map((img, i) => (
                    <Reveal key={img.src} delay={(i % 2) * 90}>
                      <figure>
                        <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
                          />
                        </div>
                        <figcaption className="mt-3 font-heading text-xs text-charcoal/55">
                          {img.alt}
                        </figcaption>
                      </figure>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {drawings.length > 0 && (
              <section className="bg-beige" aria-label={`${project.name} drawings and diagrams`}>
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
                  <Reveal>
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                      Process
                    </p>
                    <h2 className="mt-4 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                      Drawings &amp; diagrams
                    </h2>
                    <p className="mt-4 max-w-2xl leading-relaxed text-charcoal/75">
                      The thinking behind the design — the plans, strategies, and technical
                      drawings that carry a project from idea to construction.
                    </p>
                  </Reveal>
                  <div className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8">
                    {drawings.map((img, i) => (
                      <Reveal key={img.src} delay={(i % 2) * 90}>
                        <figure className="bg-warm-white p-4 sm:p-6">
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              sizes="(min-width: 640px) 50vw, 100vw"
                              className="object-contain"
                            />
                          </div>
                          <figcaption className="mt-4 border-t border-warm-gray/60 pt-3 font-heading text-xs text-charcoal/55">
                            {img.alt}
                          </figcaption>
                        </figure>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA */}
        <section className="border-t border-warm-gray/60">
          <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-20">
            <Reveal>
              <div className="max-w-2xl">
                <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                  Planning something similar?
                </h2>
                <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-charcoal/75 sm:text-lg">
                  We&apos;re here to help. Book a free discussion call to talk through
                  your project.
                </p>
                <Link
                  href="/inquire"
                  className="mt-6 inline-flex min-h-12 cursor-pointer items-center bg-chestnut px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta"
                >
                  Start a project
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Prev / next — spaced below CTA for breathing room */}
        <section className="border-t border-transparent">
          <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14">
            <nav
              aria-label="More projects"
              className="grid gap-px border border-warm-gray/60 bg-warm-gray/60 sm:grid-cols-2"
            >
              <Link
                href={`/work/${prev.slug}`}
                className="group bg-warm-white p-6 transition-colors hover:bg-beige sm:p-8"
              >
                <span className="inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">
                  <span aria-hidden className="text-base leading-none text-chestnut">
                    ←
                  </span>
                  Previous project
                </span>
                <span className="mt-2 block font-heading text-xl font-semibold text-charcoal group-hover:text-chestnut">
                  {prev.name}
                </span>
              </Link>
              <Link
                href={`/work/${next.slug}`}
                className="group bg-warm-white p-6 text-right transition-colors hover:bg-beige sm:p-8"
              >
                <span className="inline-flex items-center justify-end gap-2 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">
                  Next project
                  <span aria-hidden className="text-base leading-none text-chestnut">
                    →
                  </span>
                </span>
                <span className="mt-2 block font-heading text-xl font-semibold text-charcoal group-hover:text-chestnut">
                  {next.name}
                </span>
              </Link>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
