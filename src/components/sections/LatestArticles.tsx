"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { BlogPostCard } from "@/lib/blog";

export type LatestArticlesData = {
  eyebrow: string;
  title: string;
  seeAllLabel: string;
  seeAllHref: string;
  items: Array<{
    title: string;
    readMins: number;
    image: string;
    imageAlt: string;
    href: string;
  }>;
};

const HEADER_PX = 76;

export function buildLatestArticlesData(posts: BlogPostCard[]): LatestArticlesData {
  return {
    eyebrow: "Latest Articles",
    title: "Stay up to date with our latest news.",
    seeAllLabel: "See all articles",
    seeAllHref: "/blog",
    items: posts.slice(0, 6).map((p) => ({
      title: p.title,
      readMins: p.read_mins,
      image: p.cover_image,
      imageAlt: p.cover_alt,
      href: `/blog/${p.slug}`,
    })),
  };
}

/**
 * Latest Articles — pinned fake-horizontal scroll (vertical ? x).
 * Pin the section; animate the track child only; clip inside the viewport, not the pin root.
 */
export default function LatestArticles({ data }: { data: LatestArticlesData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!section || !track || !viewport) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`,
          reduce: `(max-width: 1023px), (prefers-reduced-motion: reduce)`,
        },
        (context) => {
          const { desktop } = context.conditions ?? {};

          if (!desktop) {
            gsap.set(track, { clearProps: "transform" });
            return;
          }

          const getTravel = () => {
            const maxX = track.scrollWidth - viewport.clientWidth;
            return Math.max(0, maxX);
          };

          gsap.set(track, { x: 0, force3D: true });

          const tween = gsap.to(track, {
            x: () => -getTravel(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: `top top+=${HEADER_PX}px`,
              end: () => `+=${Math.max(getTravel() * 1.1, window.innerHeight * 1.25)}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              refreshPriority: -6,
              id: "articles-horizontal",
            },
          });

          const imgs = track.querySelectorAll("img");
          const onLoad = () => ScrollTrigger.refresh();
          imgs.forEach((img) => {
            if (!img.complete) img.addEventListener("load", onLoad, { once: true });
          });
          window.addEventListener("load", onLoad);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => ScrollTrigger.refresh());
          });

          return () => {
            window.removeEventListener("load", onLoad);
            imgs.forEach((img) => img.removeEventListener("load", onLoad));
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <section
      id="blog"
      ref={sectionRef}
      aria-label="Latest articles"
      className="scroll-mt-20 bg-charcoal text-warm-white"
      data-articles-scroll
    >
      <div className="relative flex h-auto min-h-[100svh] flex-col justify-center py-16 lg:h-[calc(100svh-4.75rem)] lg:min-h-0 lg:justify-between lg:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(196,149,106,0.1),transparent_50%)]"
        />

        <div className="relative mx-auto w-full max-w-7xl shrink-0 px-5 sm:px-8">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {data.eyebrow}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4 sm:mt-4">
            <h2 className="max-w-xl font-heading text-3xl font-semibold leading-tight sm:text-4xl">
              {data.title}
            </h2>
            <Link
              href={data.seeAllHref}
              className="hidden min-h-11 cursor-pointer items-center font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 transition-colors duration-200 hover:text-warm-white hover:underline lg:inline-flex"
            >
              {data.seeAllLabel}
            </Link>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="relative mt-10 min-h-0 w-full flex-1 overflow-x-clip overflow-y-visible lg:mt-0 lg:flex lg:items-center"
          data-articles-viewport
        >
          <ul
            ref={trackRef}
            className="flex w-max gap-5 px-5 will-change-transform sm:gap-6 sm:px-8 lg:gap-7 lg:px-10"
          >
            {data.items.map((item, i) => (
              <li
                key={item.href + item.title}
                data-article-card
                className="w-[min(72vw,17.5rem)] shrink-0 sm:w-[18.5rem] lg:w-[clamp(16rem,22vw,20.5rem)]"
              >
                <Link
                  href={item.href}
                  className="group block cursor-pointer outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                >
                  <div className="relative aspect-[3/4] max-h-[min(52svh,26rem)] overflow-hidden bg-charcoal/80 lg:max-h-[min(56svh,28rem)]">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 22vw, 72vw"
                      className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.035]"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-warm-white/75">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-warm-white transition-colors duration-200 group-hover:text-gold sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 font-heading text-xs tracking-wide text-warm-white/45">
                    Read · {item.readMins} min
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-7xl shrink-0 px-5 sm:px-8 lg:hidden">
          <Link
            href={data.seeAllHref}
            className="inline-flex min-h-11 cursor-pointer items-center font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
          >
            {data.seeAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}


