"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { SiteContent } from "@/lib/cms";

type Articles = SiteContent["insights"]["articles"];

/**
 * Latest Articles — vertical-image card row with stagger reveal.
 * ponytail: placeholder choreography until architect sends sample animation;
 * swap the useGSAP block when the reference lands.
 */
export default function LatestArticles({ data }: { data: Articles }) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          motionOk: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as { reduceMotion: boolean };
          if (reduceMotion) {
            gsap.set("[data-article-card]", { autoAlpha: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            "[data-article-card]",
            { y: 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      id="blog"
      ref={rootRef}
      aria-label="Latest articles"
      className="scroll-mt-20 border-t border-warm-gray/60 bg-beige"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            {data.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
            {data.title}
          </h2>
        </div>

        <ul className="mt-12 flex gap-5 overflow-x-auto pb-2 sm:gap-6 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {data.items.map((item) => (
            <li
              key={item.title}
              data-article-card
              className="w-[min(72vw,16.5rem)] shrink-0 lg:w-auto"
            >
              <Link href={item.href} className="group block outline-offset-4">
                <div className="relative aspect-[3/4] overflow-hidden bg-warm-gray">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 72vw"
                    className="object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-charcoal group-hover:text-chestnut">
                  {item.title}
                </h3>
                <p className="mt-2 font-heading text-xs text-charcoal/50">
                  Read · {item.readMins} min
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link
            href={data.seeAllHref}
            className="inline-flex min-h-11 items-center font-heading text-xs font-semibold uppercase tracking-[0.2em] text-chestnut underline-offset-4 hover:underline"
          >
            {data.seeAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
