"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  chapterIndexFromProgress,
  chapterLabel,
} from "@/lib/insights-chapters";
import { textStyle, type SiteContent } from "@/lib/cms";

type Insights = SiteContent["insights"];

// Fixed site header height in px (4.75rem). ScrollTrigger start/end
// positions only understand px/% — rem silently parses as px.
const HEADER_PX = 76;

type Panel =
  | { key: string; index: number; kind: "prose"; title: string; body: string[] }
  | {
      key: string;
      index: number;
      kind: "list";
      title: string;
      items: { title: string; body: string }[];
    };

/**
 * Before You Build — classic ScrollTrigger pin (spacer auto-managed).
 * No manual tall runway: without JS the section is one normal viewport,
 * so a failed pin can never leave a blank scroll desert.
 * GSAP owns the progress bar; React state owns which chapter is visible,
 * so the counter and card can never desync.
 */
export default function InsightsImmersive({ data }: { data: Insights }) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const panels: Panel[] = useMemo(
    () => [
      {
        key: "team",
        index: 1,
        kind: "prose",
        title: data.teamMatters.title,
        body: data.teamMatters.body,
      },
      {
        key: "mistakes",
        index: 2,
        kind: "list",
        title: data.mistakes.title,
        items: data.mistakes.items,
      },
      ...data.upcoming.map((item, i) => ({
        key: `chapter-${3 + i}`,
        index: 3 + i,
        kind: "list" as const,
        title: item.title,
        items: item.items,
      })),
    ],
    [data],
  );

  const n = panels.length;

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const bar = progressRef.current;
      if (!scene) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // One viewport-height per chapter of locked scroll
          const runway = () => Math.round(window.innerHeight * n * 0.85);

          const st = ScrollTrigger.create({
            id: "insights-chapters",
            trigger: scene,
            start: `top ${HEADER_PX}px`,
            end: () => `+=${runway()}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            refreshPriority: -8,
            onUpdate: (self) => setActive(chapterIndexFromProgress(self.progress, n)),
            onRefresh: (self) => setActive(chapterIndexFromProgress(self.progress, n)),
          });

          let barTween: gsap.core.Tween | undefined;
          if (bar) {
            gsap.set(bar, {
              scaleX: 1 / Math.max(n, 1),
              transformOrigin: "left center",
            });
            barTween = gsap.to(bar, {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                id: "insights-progress",
                trigger: scene,
                start: `top ${HEADER_PX}px`,
                end: () => `+=${runway()}`,
                scrub: 0.5,
                invalidateOnRefresh: true,
                refreshPriority: -7,
              },
            });
          }

          requestAnimationFrame(() => ScrollTrigger.refresh());

          return () => {
            barTween?.scrollTrigger?.kill();
            barTween?.kill();
            st.kill();
          };
        },
      );

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        setActive(0);
        if (bar) gsap.set(bar, { clearProps: "transform" });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [n], revertOnUpdate: true },
  );

  return (
    <section
      id="insights"
      ref={rootRef}
      className="scroll-mt-20 bg-beige"
      data-insights-scroll
    >
      {/* Pin target — ScrollTrigger adds its own spacer below while locked */}
      <div
        ref={sceneRef}
        data-insights-scene
        className="relative isolate flex min-h-[100svh] flex-col justify-center bg-beige lg:h-[calc(100svh-4.75rem)] lg:min-h-0"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(196,149,106,0.14),transparent_52%),radial-gradient(ellipse_at_92%_85%,rgba(74,44,32,0.05),transparent_48%)]"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:items-center lg:gap-12 lg:py-8 xl:gap-16">
          <header className="max-w-xl">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              {data.eyebrow}
            </p>
            <h2
              className="mt-4 text-balance font-heading text-3xl font-semibold leading-[1.12] text-charcoal sm:text-4xl lg:text-[2.65rem]"
              style={textStyle(data.styles?.title)}
            >
              {data.title}
            </h2>
            <p
              className="mt-5 text-base leading-relaxed text-charcoal/70 sm:text-lg"
              style={textStyle(data.styles?.lede)}
            >
              {data.lede}
            </p>

            <div
              className="mt-10 hidden items-baseline gap-3 lg:flex"
              aria-live="polite"
              data-insights-index
            >
              <span className="font-heading text-4xl font-semibold tabular-nums text-chestnut">
                {chapterLabel(active)}
              </span>
              <span className="font-heading text-sm text-charcoal/35">
                / {String(n).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-6 hidden h-px w-full max-w-xs overflow-hidden bg-warm-gray/80 lg:block">
              <div
                ref={progressRef}
                className="h-full origin-left bg-chestnut"
                style={{ width: "100%", transform: `scaleX(${1 / Math.max(n, 1)})` }}
              />
            </div>
          </header>

          <div className="relative min-w-0">
            <div
              data-insight-stage
              className="relative hidden w-full overflow-hidden lg:block lg:h-[min(32rem,58svh)]"
            >
              {panels.map((panel, i) => (
                <article
                  key={panel.key}
                  data-insight-panel
                  data-active={i === active ? "true" : "false"}
                  className={`absolute inset-0 flex flex-col justify-center bg-warm-white px-8 py-9 transition-[opacity,transform] duration-300 ease-out will-change-[opacity,transform] motion-reduce:transition-none sm:px-10 lg:px-12 ${
                    i === active
                      ? "z-10 translate-y-0 opacity-100"
                      : "pointer-events-none z-0 translate-y-3 opacity-0"
                  }`}
                  aria-hidden={i !== active}
                >
                  <PanelBody panel={panel} />
                </article>
              ))}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 border border-warm-gray/40"
              />
            </div>

            <div className="space-y-6 lg:hidden">
              {panels.map((panel) => (
                <article
                  key={panel.key}
                  className="border border-warm-gray/40 bg-warm-white px-6 py-8 sm:px-8"
                >
                  <PanelBody panel={panel} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelBody({ panel }: { panel: Panel }) {
  return (
    <>
      <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-terracotta">
        {String(panel.index).padStart(2, "0")}
      </p>
      <h3 className="mt-4 max-w-xl font-heading text-2xl font-semibold leading-tight text-charcoal sm:text-3xl">
        {panel.title}
      </h3>

      {panel.kind === "prose" ? (
        <div className="mt-5 max-w-xl space-y-3.5">
          {panel.body.map((p) => (
            <p
              key={p.slice(0, 28)}
              className="font-body text-[0.95rem] leading-relaxed text-charcoal/75 sm:text-base"
            >
              {p}
            </p>
          ))}
        </div>
      ) : null}

      {panel.kind === "list" ? (
        <ol className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-4">
          {panel.items.map((item, i) => (
            <li key={item.title} className="flex gap-2.5 border-t border-warm-gray/50 pt-2.5">
              <span className="font-heading text-xs font-semibold text-terracotta">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-heading text-sm font-semibold text-charcoal">{item.title}</p>
                <p className="mt-1 font-body text-sm leading-relaxed text-charcoal/65">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}
