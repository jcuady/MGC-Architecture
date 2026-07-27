"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Minimalist Editorial Hero
 *
 * Grounded in the "Vision — Precision" reference:
 * - Light, airy background (`bg-warm-white`).
 * - Massive, high-contrast typography centered in generous whitespace.
 * - Architectural photography presented as a framed, inset element rather than
 *   a full-bleed background, giving it gallery-like intentionality.
 * - Extremely clean, premium CTAs (sharp corners, tracked-out uppercase).
 */
export default function Hero({ data }: { data: SiteContent["hero"] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          motionOk: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set("[data-hero-fade], [data-hero-line]", {
              autoAlpha: 1,
              y: 0,
              yPercent: 0,
            });
            sectionRef.current
              ?.querySelectorAll<HTMLElement>("[data-hero-mask]")
              .forEach((el) => {
                el.dataset.maskOpen = "true";
              });
            return;
          }

          const openMasks = () => {
            sectionRef.current
              ?.querySelectorAll<HTMLElement>("[data-hero-mask]")
              .forEach((el) => {
                el.dataset.maskOpen = "true";
              });
          };

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              onComplete: openMasks,
            })
            .fromTo(
              "[data-hero-line]",
              { yPercent: 115 },
              { yPercent: 0, duration: 1.2, stagger: 0.15 },
              0.1,
            )
            .fromTo(
              "[data-hero-fade]",
              { y: 20, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
              0.6,
            )
            .fromTo(
              "[data-hero-media]",
              { scale: 1.05, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 1.5, ease: "power2.out" },
              0.8,
            );

          // Subtle parallax on the inset image
          gsap.to("[data-hero-media-inner]", {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col bg-warm-white pt-[var(--header-offset)]"
    >
      {/* Top Half: Generous whitespace and massive typography */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-center sm:px-8 lg:py-20">
        <p
          data-hero-fade
          className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-chestnut sm:text-xs"
          style={textStyle(data.styles?.eyebrow)}
        >
          {data.eyebrow}
        </p>

        <h1 className="mt-6 max-w-5xl text-balance font-heading text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[1.05] tracking-tight text-charcoal sm:mt-8">
          <span data-hero-mask className="hero-line-mask">
            <span
              data-hero-line
              className="block will-change-transform"
              style={textStyle({
                font: data.styles?.line1?.font,
                italic: data.styles?.line1?.italic,
              })}
            >
              {data.line1}
            </span>
          </span>
          <span data-hero-mask className="hero-line-mask">
            <span
              data-hero-line
              className="block font-body italic text-chestnut will-change-transform"
              style={textStyle({
                font: data.styles?.line2?.font,
                italic: data.styles?.line2?.italic,
              })}
            >
              {data.line2}
            </span>
          </span>
        </h1>

        <p
          data-hero-fade
          className="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70 sm:mt-8 sm:text-xl"
          style={textStyle(data.styles?.lede)}
        >
          {data.lede}
        </p>

        {/* Minimalist, high-end CTA group */}
        <div
          data-hero-fade
          className="mt-10 flex flex-col items-center gap-6 sm:mt-12 sm:flex-row sm:gap-8"
        >
          <Link
            href="/#contact"
            className="inline-flex h-14 items-center justify-center bg-charcoal px-10 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-warm-white transition-colors hover:bg-chestnut"
          >
            {data.primaryCta}
          </Link>
          <a
            href="#work"
            className="link-draw font-heading text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal"
          >
            {data.secondaryCta}
          </a>
        </div>
      </div>

      {/* Bottom Half: Framed architectural render */}
      <div
        data-hero-media
        className="mx-auto w-full max-w-[96%] pb-6 lg:max-w-7xl lg:pb-12"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-warm-gray sm:aspect-[21/9]">
          <div
            data-hero-media-inner
            className="absolute -inset-y-[10%] inset-x-0 h-[120%] will-change-transform"
          >
            <Image
              src={data.image}
              alt="MGC Architecture — featured project"
              fill
              priority
              sizes="(min-width: 1280px) 80vw, 96vw"
              className="object-cover object-[center_60%]"
            />
          </div>
          {/* Subtle inner shadow to frame the image nicely against the white background */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(47,42,40,0.1)]" />
        </div>
      </div>
    </section>
  );
}
