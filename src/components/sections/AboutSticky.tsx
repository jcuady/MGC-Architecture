"use client";

import Image from "next/image";
import { useRef } from "react";
import AboutLearnMore from "../AboutLearnMore";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { textStyle, type SiteContent } from "@/lib/cms";

type AboutData = SiteContent["about"];

/**
 * About sticky layout — photo + short bio pin while credentials scroll.
 * GSAP ScrollTrigger pin (desktop); CSS sticky as no-JS / reduced-motion fallback.
 * ponytail: no Framer — GSAP already installed; pinSpacing:false = sidebar sticky.
 */
export default function AboutSticky({ data }: { data: AboutData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const hoverPhoto = data.photoHover;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pinEl = pinRef.current;
      if (!section || !pinEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Matches Header h-[4.75rem] so the pin sits cleanly under the nav
          const st = ScrollTrigger.create({
            trigger: pinEl,
            start: "top top+=4.75rem",
            endTrigger: section,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            id: "about-sticky-intro",
          });

          const imgs = pinEl.querySelectorAll("img");
          const onLoad = () => ScrollTrigger.refresh();
          imgs.forEach((img) => {
            if (!img.complete) img.addEventListener("load", onLoad, { once: true });
          });
          requestAnimationFrame(() => ScrollTrigger.refresh());

          return () => {
            imgs.forEach((img) => img.removeEventListener("load", onLoad));
            st.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative scroll-mt-20 bg-chestnut"
    >
      <Image
        src="/brand/monogram-white.png"
        alt=""
        aria-hidden
        width={900}
        height={900}
        className="pointer-events-none absolute -bottom-40 -right-32 w-[34rem] opacity-[0.06] sm:w-[46rem]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)] lg:items-start lg:gap-14 xl:gap-16">
          {/* Intro — sticky / pinned */}
          <div
            ref={pinRef}
            data-about-sticky
            className="grid gap-8 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8 lg:sticky lg:top-[4.75rem] lg:self-start"
          >
            <div className="group relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden bg-charcoal/30 sm:mx-0 sm:max-w-none">
              <Image
                src={data.photo}
                alt={data.photoAlt}
                fill
                sizes="(min-width: 1024px) 224px, 320px"
                className={
                  hoverPhoto
                    ? "object-cover object-top transition-opacity duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-0"
                    : "object-cover object-top"
                }
                priority
              />
              {hoverPhoto ? (
                <Image
                  src={hoverPhoto}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(min-width: 1024px) 224px, 320px"
                  className="object-cover object-top opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-100"
                />
              ) : null}
            </div>

            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {data.eyebrow}
              </p>
              <h2
                className="mt-4 font-heading text-3xl font-semibold leading-tight text-warm-white sm:text-4xl"
                style={textStyle(data.styles?.name)}
              >
                {data.name}
              </h2>
              <p className="mt-2 font-heading text-sm font-medium tracking-wide text-warm-gray">
                {data.role}
              </p>
              <p
                className="mt-6 text-base leading-relaxed text-warm-white/95 sm:text-lg"
                style={textStyle(data.styles?.intro)}
              >
                {data.intro}
              </p>
              <AboutLearnMore
                name={data.name}
                role={data.role}
                intro={data.intro}
                body={data.body}
                label={data.learnMoreLabel}
              />
            </div>
          </div>

          {/* Credentials — scrolls past pinned intro */}
          <div data-about-credentials className="space-y-10 lg:pt-1">
            <div>
              <h3 className="border-b border-warm-white/20 pb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Education
              </h3>
              <p className="mt-4 font-heading font-medium text-warm-white">
                {data.education.degree}
              </p>
              <p className="mt-1 text-warm-white/75">{data.education.school}</p>
              <p className="text-warm-white/75">{data.education.honors}</p>
            </div>

            <div>
              <h3 className="border-b border-warm-white/20 pb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Professional Experience
              </h3>
              <ul className="mt-4 space-y-5">
                {data.experience.map((item) => (
                  <li key={`${item.role}-${item.org}`}>
                    <p className="font-heading font-medium text-warm-white">{item.role}</p>
                    <p className="mt-0.5 font-heading text-xs uppercase tracking-[0.14em] text-gold/90">
                      {item.org}
                      {item.period ? ` · ${item.period}` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-warm-white/75">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="border-b border-warm-white/20 pb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Awards &amp; Distinctions
              </h3>
              <ul className="mt-4 space-y-2.5">
                {data.awards.map((award) => (
                  <li key={award} className="flex gap-3 leading-snug text-warm-white/80">
                    <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-gold" />
                    {award}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="border-b border-warm-white/20 pb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Skills &amp; Software
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {[...data.skills, ...data.software].map((item) => (
                  <li
                    key={item}
                    className="border border-warm-white/25 px-3 py-1.5 font-heading text-xs font-medium text-warm-white/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
