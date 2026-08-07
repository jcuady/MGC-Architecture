"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeader from "../SectionHeader";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Landing teaser for Process — short overview + CTA to /process.
 * Full five-phase detail lives on the dedicated page; finish levels live on /estimate.
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
      id="process"
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden bg-charcoal"
    >
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
          <div aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-warm-white/15 sm:block" />
          <div
            aria-hidden
            data-process-rail
            className="absolute inset-x-0 top-0 hidden h-px origin-left bg-gold sm:block"
          />

          <ol className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5 lg:gap-6">
            {data.steps.map((step, i) => (
              <li key={step.title} data-process-step className="relative sm:pt-10">
                <span
                  aria-hidden
                  className="absolute left-0 top-[-5px] hidden h-[11px] w-[11px] rounded-full border border-gold bg-charcoal sm:block"
                />
                <span
                  aria-hidden
                  className="font-heading text-4xl font-semibold leading-none text-gold/25 sm:text-5xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-warm-white sm:text-xl">
                  {step.title}
                </h3>
                {"time" in step && step.time ? (
                  <p className="mt-2 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-warm-white/55">
                    {step.time}
                  </p>
                ) : null}
                <p className="mt-2 text-sm leading-relaxed text-warm-white/65">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 sm:mt-16">
          <Link
            href={data.ctaHref}
            className="inline-flex min-h-11 cursor-pointer items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {data.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
