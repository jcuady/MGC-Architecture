"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { textStyle, type SiteContent } from "@/lib/cms";

/** Bare-finish rate shown as the count-up hook (₱/sqm). */
const RATE_DISPLAY = 25_000;

function formatPeso(n: number) {
  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Architect revision: Construction Cost Calculator invite with
 * animated ₱25,000.00+ count-up, then CTA below.
 */
export default function EstimatorHook({ data }: { data: SiteContent["estimator"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const amountRef = useRef<HTMLSpanElement>(null);

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
          const amountEl = amountRef.current;

          if (reduceMotion) {
            gsap.set("[data-estimator-rise]", { autoAlpha: 1, y: 0 });
            gsap.set("[data-estimator-media]", { yPercent: 0 });
            if (amountEl) amountEl.textContent = formatPeso(RATE_DISPLAY);
            return;
          }

          gsap.fromTo(
            "[data-estimator-media]",
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
            "[data-estimator-rise]",
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
                toggleActions: "play none none none",
              },
            },
          );

          if (amountEl) {
            const counter = { value: 0 };
            gsap.to(counter, {
              value: RATE_DISPLAY,
              duration: 1.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 55%",
                toggleActions: "play none none none",
              },
              onUpdate: () => {
                amountEl.textContent = formatPeso(counter.value);
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
      id="calculator"
      ref={sectionRef}
      aria-label="Construction cost calculator"
      className="relative flex min-h-[70svh] items-center overflow-hidden bg-charcoal"
    >
      <div
        data-estimator-media
        className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
      >
        <Image
          src={data.image}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#2f2a28]/70" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl border border-gold/40 px-6 py-12 text-center sm:px-12 sm:py-16">
          <p
            data-estimator-rise
            className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold"
          >
            {data.eyebrow}
          </p>
          <h2
            data-estimator-rise
            className="mt-5 text-balance font-heading text-3xl font-semibold leading-tight text-warm-white sm:text-4xl lg:text-5xl"
            style={textStyle(data.styles?.title)}
          >
            {data.title}
          </h2>
          <p
            data-estimator-rise
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-warm-white/85 sm:text-lg"
            style={textStyle(data.styles?.lede)}
          >
            {data.lede}
          </p>

          {/* Animated rate count-up — architect: ₱ 25,000.00+ then CTA below */}
          <div data-estimator-rise className="mt-10">
            <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-warm-white/55">
              From
            </p>
            <p
              className="mt-2 font-heading text-4xl font-semibold tabular-nums tracking-tight text-warm-white sm:text-5xl lg:text-6xl"
              aria-label={`From ${formatPeso(RATE_DISPLAY)} pesos per square meter and up`}
            >
              <span className="mr-1 text-gold">₱</span>
              <span ref={amountRef}>0.00</span>
              <span className="ml-0.5 text-gold">+</span>
            </p>
            <p className="mt-2 font-heading text-xs tracking-wide text-warm-white/55">
              per sqm · bare finish
            </p>
          </div>

          <div data-estimator-rise className="mt-9">
            <Link
              href="/estimate"
              className="inline-flex min-h-12 items-center bg-warm-white px-9 py-4 font-heading text-sm font-semibold text-chestnut transition-colors hover:bg-beige"
            >
              {data.ctaLabel}
              <span aria-hidden className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
