"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { textStyle, type SiteContent } from "@/lib/cms";
import { portfolioHdSrc } from "@/lib/portfolio-hd";

/**
 * Editorial full-bleed hero.
 * LCP-critical: image + lede stay paint-visible (never autoAlpha:0). Motion is
 * scale / title-mask / CTA only — mobile skips parallax and CTA delay.
 */
export default function Hero({ data }: { data: SiteContent["hero"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroSrc = portfolioHdSrc(
    data.image,
    "/portfolio/the-noir/the-noir-living-view-1.png",
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isMobile:
            "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          isDesktop:
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions as {
            reduceMotion: boolean;
            isMobile: boolean;
          };

          const openMasks = () => {
            sectionRef.current
              ?.querySelectorAll<HTMLElement>("[data-hero-mask]")
              .forEach((el) => {
                el.dataset.maskOpen = "true";
              });
          };

          if (reduceMotion) {
            gsap.set("[data-hero-line], [data-hero-image], [data-hero-cta]", {
              autoAlpha: 1,
              y: 0,
              yPercent: 0,
              scale: 1,
            });
            openMasks();
            return;
          }

          // ponytail: keep LCP candidates visible from first paint (PSI mobile).
          gsap.set("[data-hero-image]", { autoAlpha: 1, scale: isMobile ? 1.03 : 1.06 });
          gsap.set("[data-hero-cta]", {
            autoAlpha: isMobile ? 1 : 0,
            y: isMobile ? 0 : 12,
          });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: openMasks,
          });

          tl.to(
            "[data-hero-image]",
            {
              scale: 1,
              duration: isMobile ? 1 : 1.5,
              ease: "power2.out",
            },
            0,
          ).fromTo(
            "[data-hero-line]",
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: isMobile ? 0.7 : 1.05,
              stagger: isMobile ? 0.08 : 0.12,
            },
            isMobile ? 0.05 : 0.3,
          );

          if (!isMobile) {
            tl.to(
              "[data-hero-cta]",
              { autoAlpha: 1, y: 0, duration: 0.65 },
              0.65,
            );

            gsap.to("[data-hero-image]", {
              yPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }
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
      <div className="absolute inset-0 z-0">
        <div data-hero-image className="relative h-[115%] w-full will-change-transform">
          <Image
            src={heroSrc}
            alt="MGC Architecture — featured project"
            fill
            priority
            // Architecture hero: keep mobile retina crisp (was 68 + soft JPG).
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Lighter mobile scrim so render detail reads HD; desktop keeps depth. */}
        <div className="absolute inset-0 bg-black/10 sm:bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent sm:from-charcoal/95 sm:via-charcoal/40" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent sm:h-40 sm:from-black/60" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-10 px-5 pb-12 pt-[var(--header-offset)] sm:px-8 sm:pb-16 lg:flex-row lg:items-end lg:pb-20">
        <div className="w-full max-w-4xl text-left">
          <p
            className="mb-6 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-warm-white/85 sm:text-xs"
            style={textStyle(data.styles?.eyebrow)}
          >
            {data.eyebrow}
          </p>

          <h1 className="hero-title mt-1 max-w-[18ch] text-balance font-heading font-medium tracking-tight text-warm-white">
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
            <span data-hero-mask className="hero-line-mask mt-1 block sm:mt-2">
              <span
                data-hero-line
                className="block font-heading text-warm-white will-change-transform"
                style={textStyle(data.styles?.line2)}
              >
                {data.line2}
              </span>
            </span>
          </h1>

          <p
            className="hero-lede mt-5 max-w-md text-pretty font-body text-warm-white/85 sm:mt-6"
            style={textStyle(data.styles?.lede)}
          >
            {data.lede}
          </p>
        </div>

        <div data-hero-cta className="flex shrink-0 pb-2">
          <Link
            href="/inquire"
            className="inline-flex h-14 items-center justify-center border border-warm-white/40 px-10 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-warm-white backdrop-blur-sm transition-all hover:bg-warm-white hover:text-charcoal sm:h-16 sm:px-12"
          >
            {data.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
