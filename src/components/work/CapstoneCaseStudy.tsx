import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { CapstoneCaseStudy } from "@/lib/content";

/**
 * Architectural Capstone case-study layout from the architect wireframe:
 * 2×2 images → problem/approach zig-zag → classroom → strategy + 3 diagrams → feature → closing pair.
 */
export default function CapstoneCaseStudyLayout({ data }: { data: CapstoneCaseStudy }) {
  return (
    <div className="bg-warm-white">
      {/* IMAGE 1–4 */}
      <section aria-label="Project views" className="border-b border-warm-gray/60">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {data.grid.map((img, i) => (
              <Reveal key={img.src} delay={(i % 2) * 80}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      priority={i < 2}
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

      {/* THE PROBLEM — diagram | text */}
      <section aria-labelledby="capstone-problem" className="border-b border-warm-gray/60 bg-beige">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden bg-warm-white">
                <Image
                  src={data.problem.diagram}
                  alt={data.problem.diagramAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-4 sm:p-6"
                />
              </div>
              <figcaption className="mt-3 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                Design problem diagram
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={90}>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Design problem
            </p>
            <h2
              id="capstone-problem"
              className="mt-3 font-heading text-2xl font-semibold text-charcoal sm:text-3xl"
            >
              {data.problem.title}
            </h2>
            <p className="mt-5 font-body text-base leading-relaxed text-charcoal/80 sm:text-lg">
              {data.problem.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* THE APPROACH — text | diagram */}
      <section aria-labelledby="capstone-approach" className="border-b border-warm-gray/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="lg:order-2">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden bg-beige">
                <Image
                  src={data.approach.diagram}
                  alt={data.approach.diagramAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain p-4 sm:p-6"
                />
              </div>
              <figcaption className="mt-3 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                Design approach diagram
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={90} className="lg:order-1">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Design approach
            </p>
            <h2
              id="capstone-approach"
              className="mt-3 font-heading text-2xl font-semibold text-charcoal sm:text-3xl"
            >
              {data.approach.title}
            </h2>
            <p className="mt-5 font-body text-base leading-relaxed text-charcoal/80 sm:text-lg">
              {data.approach.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* IMAGE 5 — classroom */}
      <section aria-label="Inside classroom view">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden bg-warm-gray sm:aspect-[21/9]">
                <Image
                  src={data.classroom.src}
                  alt={data.classroom.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 font-heading text-xs text-charcoal/55">
                {data.classroom.alt}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* DESIGN STRATEGY + 3 diagrams */}
      <section
        aria-labelledby="capstone-strategy"
        className="border-y border-warm-gray/60 bg-beige"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Design strategy
            </p>
            <h2
              id="capstone-strategy"
              className="mt-3 max-w-3xl font-heading text-2xl font-semibold text-charcoal sm:text-3xl"
            >
              {data.strategy.title}
            </h2>
            <p className="mt-5 max-w-3xl font-body text-base leading-relaxed text-charcoal/80 sm:text-lg">
              {data.strategy.body}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-6">
            {data.strategy.diagrams.map((img, i) => (
              <Reveal key={img.src} delay={i * 70}>
                <figure className="bg-warm-white p-3 sm:p-4">
                  <div className="relative aspect-square">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="mt-3 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                    {i === 2 ? "Axonometric / material key" : `Strategy diagram ${i + 1}`}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE 6 */}
      <section aria-label="Feature view">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden bg-warm-gray sm:aspect-[21/9]">
                <Image
                  src={data.feature.src}
                  alt={data.feature.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 font-heading text-xs text-charcoal/55">
                {data.feature.alt}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* IMAGE 7–8 */}
      <section aria-label="Closing views" className="border-t border-warm-gray/60">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-4 sm:px-8 sm:pb-20 sm:pt-6">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {data.closing.map((img, i) => (
              <Reveal key={img.src} delay={i * 80}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
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
    </div>
  );
}
