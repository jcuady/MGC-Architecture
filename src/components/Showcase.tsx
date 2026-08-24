"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { portfolioHdSrc } from "@/lib/portfolio-hd";

type ShowcaseProps = {
  src: string;
  alt: string;
  eyebrow: string;
  lines: string[];
  lineStyle?: CSSProperties;
  cta?: { label: string; href: string };
};

/**
 * Full-screen image interlude with scroll parallax.
 * The image travels slowly against the scroll (transform-only, scrubbed),
 * and the caption rises once when the section enters view.
 */
export default function Showcase({ src, alt, eyebrow, lines, lineStyle, cta }: ShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaSrc = portfolioHdSrc(src, src);

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
            gsap.set("[data-showcase-rise]", { autoAlpha: 1, y: 0 });
            gsap.set("[data-showcase-media]", { yPercent: 0 });
            return;
          }

          gsap.fromTo(
            "[data-showcase-media]",
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            "[data-showcase-rise]",
            { y: 36, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none none",
              },
            },
          );
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-svh min-h-[32rem] overflow-hidden bg-charcoal"
      aria-label={`${eyebrow} — showcase`}
    >
      {/* Oversized media wrapper gives the parallax room to travel without gaps */}
      <div
        data-showcase-media
        className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
      >
        <Image
          src={mediaSrc}
          alt={alt}
          fill
          quality={88}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2f2a28]/85 via-[#2f2a28]/20 to-[#2f2a28]/25" />
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20">
          <p
            data-showcase-rise
            className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-warm-white/80"
          >
            {eyebrow}
          </p>
          <p
            className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-[1.15] text-warm-white sm:text-4xl lg:text-5xl"
            style={lineStyle}
          >
            {lines.map((line) => (
              <span key={line} data-showcase-rise className="block py-[0.06em]">
                {line}
              </span>
            ))}
          </p>
          {cta && (
            <a
              data-showcase-rise
              href={cta.href}
              className="mt-9 inline-block bg-warm-white px-7 py-3.5 font-heading text-sm font-semibold text-chestnut transition-colors hover:bg-beige"
            >
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
