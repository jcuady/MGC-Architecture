import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — MGC Architecture`,
    description: project.description,
    openGraph: {
      title: `${project.name} — MGC Architecture`,
      description: project.description,
      images: [project.hero],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const renders = project.images.filter((img) => img.kind === "render");
  const drawings = project.images.filter((img) => img.kind !== "render");
  // The hero render opens the page, so the gallery starts from the second view.
  const gallery = renders.filter((img) => img.src !== project.hero);

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
                  <Link href="/#work" className="link-draw">
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
                  <div className="flex gap-12 border-t border-warm-gray/60 pt-6">
                    <div>
                      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                        Views
                      </dt>
                      <dd className="mt-2 font-heading text-2xl font-semibold text-charcoal">
                        {renders.length}
                      </dd>
                    </div>
                    {drawings.length > 0 && (
                      <div>
                        <dt className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                          Drawings &amp; Diagrams
                        </dt>
                        <dd className="mt-2 font-heading text-2xl font-semibold text-charcoal">
                          {drawings.length}
                        </dd>
                      </div>
                    )}
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Gallery — every render, editorial rhythm: full-width, then pairs */}
        <section aria-label={`${project.name} gallery`}>
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              {gallery.map((img, i) => (
                <Reveal
                  key={img.src}
                  delay={(i % 2) * 90}
                  className={i % 3 === 0 ? "sm:col-span-2" : ""}
                >
                  <figure>
                    <div
                      className={`relative overflow-hidden bg-warm-gray ${
                        i % 3 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes={
                          i % 3 === 0
                            ? "(min-width: 1280px) 1216px, 100vw"
                            : "(min-width: 640px) 50vw, 100vw"
                        }
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

        {/* Drawings & diagrams — the process behind the renders */}
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

        {/* CTA + prev/next */}
        <section className="border-t border-warm-gray/60">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
                    Planning something similar?
                  </h2>
                  <p className="mt-2 leading-relaxed text-charcoal/75">
                    The initial consultation is complimentary.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="bg-chestnut px-7 py-3.5 font-heading text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta"
                >
                  Start a project
                </Link>
              </div>
            </Reveal>

            <nav
              aria-label="More projects"
              className="mt-14 grid gap-px border border-warm-gray/60 bg-warm-gray/60 sm:grid-cols-2"
            >
              <Link
                href={`/work/${prev.slug}`}
                className="group bg-warm-white p-6 transition-colors hover:bg-beige sm:p-8"
              >
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">
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
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">
                  Next project
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
