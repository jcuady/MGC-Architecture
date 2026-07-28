"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { textStyle, type SiteContent } from "@/lib/cms";

/** Split at em/en dash so CMS keeps one statement field. */
function splitStatement(statement: string): [string, string] {
  const parts = statement.split(/\s*[—–]\s*/);
  if (parts.length < 2) return [statement, ""];
  return [parts[0].trim(), parts.slice(1).join(" — ").trim()];
}

/**
 * Architect revision: drop Approach/Process/Promise columns.
 * Statement splits across top-left + bottom-right with L→R sequence.
 */
export default function Studio({ data }: { data: SiteContent["studio"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [lead, trail] = splitStatement(data.statement);

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
            gsap.set("[data-studio-seq]", { autoAlpha: 1, x: 0 });
            return;
          }

          gsap.set("[data-studio-seq]", { autoAlpha: 0, x: -48 });

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
              },
            })
            // SEQ 1: L → R
            .to('[data-studio-seq="1"]', {
              autoAlpha: 1,
              x: 0,
              duration: 0.9,
            })
            // SEQ 2: L → R (after lead settles)
            .to(
              '[data-studio-seq="2"]',
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.9,
              },
              "-=0.35",
            );
        },
      );
    },
    { scope: sectionRef, dependencies: [data.statement] },
  );

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="border-b border-warm-gray/60"
      aria-label="Studio statement"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-24">
        {/* SEQ 1 — top / left */}
        <p
          data-studio-seq="1"
          className="max-w-3xl font-heading text-2xl font-medium leading-snug text-charcoal sm:text-3xl lg:col-span-10 lg:text-[2.125rem]"
          style={textStyle(data.styles?.statement)}
        >
          {lead}
        </p>

        {/* SEQ 2 — bottom / right (replaces Approach · Process · Promise) */}
        {trail ? (
          <p
            data-studio-seq="2"
            className="max-w-xl justify-self-start font-heading text-xl font-medium leading-snug text-charcoal/85 sm:text-2xl lg:col-span-7 lg:col-start-6 lg:justify-self-end lg:text-right lg:text-[1.625rem]"
            style={textStyle(data.styles?.statement)}
          >
            <span className="text-terracotta" aria-hidden>
              —{" "}
            </span>
            {trail}
          </p>
        ) : null}
      </div>
    </section>
  );
}
