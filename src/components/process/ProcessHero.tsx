"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { processPage } from "@/lib/process-page";
import { site } from "@/lib/content";

/** Hero entrance — short GSAP timeline (opacity/transform only). */
export default function ProcessHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const items = root.querySelectorAll("[data-hero-in]");
      gsap.fromTo(
        items,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-charcoal">
      <div aria-hidden className="absolute inset-0">
        <Image
          src={processPage.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/85 to-charcoal" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32 lg:pb-32">
        <p
          data-hero-in
          className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold"
        >
          {processPage.eyebrow}
        </p>
        <h1
          data-hero-in
          className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-warm-white sm:text-5xl lg:text-[3.25rem]"
        >
          {processPage.title}
        </h1>
        <p
          data-hero-in
          className="mt-6 max-w-xl font-body text-base leading-relaxed text-warm-white/70 sm:text-lg"
        >
          {processPage.lede}
        </p>
        <div data-hero-in className="mt-10 flex flex-wrap gap-4">
          <a
            href="#phases"
            className="inline-flex min-h-11 cursor-pointer items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            View the five phases
          </a>
          <Link
            href="/estimate"
            className="inline-flex min-h-11 cursor-pointer items-center border border-warm-white/35 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Cost calculator
          </Link>
        </div>
        <p data-hero-in className="sr-only">
          {site.name}
        </p>
      </div>
    </section>
  );
}
