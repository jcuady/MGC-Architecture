import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { FinishLevel } from "@/lib/process-page";
import { processPage } from "@/lib/process-page";

export default function FinishLevels({
  levels,
  showCta = true,
}: {
  levels: FinishLevel[];
  showCta?: boolean;
}) {
  const { finishes } = processPage;

  return (
    <section className="bg-warm-white" aria-labelledby="finish-levels-title">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            {finishes.eyebrow}
          </p>
          <h2
            id="finish-levels-title"
            className="mt-4 max-w-2xl font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl"
          >
            {finishes.title}
          </h2>
          <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg">
            {finishes.lede}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:gap-10">
          {levels.map((level, i) => (
            <li key={level.slug}>
              <Reveal delay={i * 60}>
                <article className="group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-beige">
                    <Image
                      src={level.image}
                      alt={level.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-5 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold text-charcoal sm:text-2xl">
                    {level.name}
                  </h3>
                  <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-charcoal/70 sm:text-base">
                    {level.description}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        {showCta ? (
          <Reveal className="mt-14">
            <Link
              href={finishes.ctaHref}
              className="inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut"
            >
              {finishes.ctaLabel}
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
