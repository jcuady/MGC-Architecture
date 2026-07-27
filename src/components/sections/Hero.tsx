"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Editorial Full-Bleed Hero
 * Matches the "PRIVATE INTERIOR DESIGN" reference:
 * - Full-bleed background image with a dark gradient overlay.
 * - Bottom-aligned content.
 * - Left: Massive, high-contrast typography.
 * - Right: Clean outline CTA.
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
            gsap.set("[data-hero-fade], [data-hero-line], [data-hero-image]", {
              autoAlpha: 1,
              y: 0,
              yPercent: 0,
              scale: 1,
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
              "[data-hero-image]",
              { scale: 1.05, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 1.8, ease: "power2.out" },
              0
            )
            .fromTo(
              "[data-hero-line]",
              { yPercent: 115 },
              { yPercent: 0, duration: 1.1, stagger: 0.14 },
              0.4
            )
            .fromTo(
              "[data-hero-fade]",
              { y: 16, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 },
              0.8
            );

          // Subtle parallax on the background image
          gsap.to("[data-hero-image]", {
            yPercent: 15,
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
      aria-label="Introduction"
      className="hero-stage relative flex flex-col justify-end overflow-hidden bg-charcoal"
    >
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <div data-hero-image className="relative h-[115%] w-full will-change-transform">
          <Image
            src={data.image || "/portfolio/the-noir/the-noir-living-view-1.png"}
            alt="MGC Architecture — featured project"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-10 px-5 pb-12 pt-[var(--header-offset)] sm:px-8 sm:pb-16 lg:flex-row lg:items-end lg:pb-20">
        
        {/* Left: Typography */}
        <div className="w-full max-w-4xl text-left">
          <p
            data-hero-fade
            className="mb-6 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-warm-white/80 sm:text-xs"
            style={textStyle(data.styles?.eyebrow)}
          >
            {data.eyebrow}
          </p>

          <h1 className="hero-title max-w-[15ch] text-balance font-heading font-medium tracking-tight text-warm-white">
            <span data-hero-mask className="hero-line-mask block">
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
            <span data-hero-mask className="hero-line-mask block">
              <span
                data-hero-line
                className="block font-body italic text-warm-white/90 will-change-transform"
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
            className="mt-6 max-w-xl text-pretty font-body text-base leading-relaxed text-warm-white/80 sm:mt-8 sm:text-lg"
            style={textStyle(data.styles?.lede)}
          >
            {data.lede}
          </p>
        </div>

        {/* Right: CTA */}
        <div data-hero-fade className="flex shrink-0 pb-2">
          <Link
            href="/#contact"
            className="inline-flex h-14 items-center justify-center border border-warm-white/40 px-10 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-warm-white backdrop-blur-sm transition-all hover:bg-warm-white hover:text-charcoal sm:h-16 sm:px-12"
          >
            {data.secondaryCta}
          </Link>
        </div>

      </div>
    </section>
  );
}
