"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeader from "../SectionHeader";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Immersive process: a dark drafting-room scene. The studio's own design
 * diagram sits behind the content like a pinned drawing, and a gold rail
 * draws itself across the three steps as you scroll — the sequence is the
 * real project order, so the line *is* the information.
 */
export default function Process({ data }: { data: SiteContent["process"] }) {
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
          const { reduceMotion } = context.conditions as { reduceMotion: boolean };

          if (reduceMotion) {
            gsap.set("[data-process-rail]", { scaleX: 1 });
            gsap.set("[data-process-step]", { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            "[data-process-rail]",
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "bottom 80%",
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            "[data-process-step]",
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.18,
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
      id="process"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-charcoal"
    >
      {/* The studio's real design-strategy diagram as a drafting-table backdrop */}
      <div aria-hidden className="absolute inset-0 opacity-[0.07]">
        <Image
          src={data.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/40 to-charcoal"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          lede={data.intro}
          tone="dark"
          titleStyle={textStyle(data.styles?.title)}
          ledeStyle={textStyle(data.styles?.intro)}
        />

        <div className="relative mt-16 sm:mt-20">
          {/* Drawn rail — progress line scrubbed to scroll */}
          <div aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-warm-white/15 sm:block" />
          <div
            aria-hidden
            data-process-rail
            className="absolute inset-x-0 top-0 hidden h-px origin-left bg-gold sm:block"
          />

          <ol className="grid gap-12 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            {data.steps.map((step, i) => (
              <li key={step.title} data-process-step className="relative sm:pt-10">
                {/* Node on the rail */}
                <span
                  aria-hidden
                  className="absolute left-0 top-[-5px] hidden h-[11px] w-[11px] rounded-full border border-gold bg-charcoal sm:block"
                />
                <span
                  aria-hidden
                  className="font-heading text-5xl font-semibold leading-none text-gold/25 sm:text-6xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-warm-white sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-warm-white/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
