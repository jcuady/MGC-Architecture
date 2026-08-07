"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, ensureScrollToPlugin, useGSAP } from "@/lib/gsap";
import { phaseIndexFromProgress } from "@/lib/process-chapters";
import {
  type ProcessPhase,
  processPage,
} from "@/lib/process-page";

const HEADER_PX = 76;

/**
 * Process phases — one ScrollTrigger pin locks the scene for exactly N viewports
 * (one per phase). Progress drives active chapter + progress rail.
 * Desktop + motion OK only; mobile / reduced-motion = stacked static list.
 */
export default function ProcessPhases({ phases }: { phases: ProcessPhase[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const n = phases.length;

  const goToPhase = useCallback(
    (i: number) => {
      const st = stRef.current;
      const clamped = Math.min(n - 1, Math.max(0, i));
      if (!st) {
        setActive(clamped);
        return;
      }
      // Land mid-chapter so snap + floor() agree on the intended phase
      const target = st.start + ((clamped + 0.5) / n) * (st.end - st.start);
      void ensureScrollToPlugin().then(() => {
        gsap.to(window, {
          scrollTo: { y: target, autoKill: true },
          duration: 0.75,
          ease: "power2.inOut",
          overwrite: true,
        });
      });
    },
    [n],
  );

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene || n < 1) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // One full viewport of locked scroll per phase — pin does not release early.
          const runway = () => Math.round(window.innerHeight * n);

          const applyRail = (progress: number) => {
            if (!railRef.current) return;
            const base = 1 / n;
            gsap.set(railRef.current, {
              scaleX: base + progress * (1 - base),
              transformOrigin: "left center",
            });
          };

          const applyAmbient = (progress: number) => {
            if (!ambientRef.current) return;
            gsap.set(ambientRef.current, { yPercent: progress * 6 });
          };

          const sync = (progress: number) => {
            setActive(phaseIndexFromProgress(progress, n));
            applyRail(progress);
            applyAmbient(progress);
          };

          const st = ScrollTrigger.create({
            id: "process-phases",
            trigger: scene,
            start: `top ${HEADER_PX}px`,
            end: () => `+=${runway()}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            // Snap to chapter boundaries so the lock finishes each phase cleanly
            snap: {
              snapTo: (value) => Math.round(value * n) / n,
              duration: { min: 0.1, max: 0.28 },
              ease: "power1.inOut",
              delay: 0.04,
            },
            onUpdate: (self) => sync(self.progress),
            onRefresh: (self) => sync(self.progress),
          });
          stRef.current = st;
          sync(st.progress);

          // After layout/fonts, recalc pin spacer so end distance is exact
          const refresh = () => ScrollTrigger.refresh();
          requestAnimationFrame(refresh);
          window.addEventListener("load", refresh, { once: true });

          return () => {
            window.removeEventListener("load", refresh);
            stRef.current = null;
            st.kill();
          };
        },
      );

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        stRef.current = null;
        setActive(0);
        if (railRef.current) gsap.set(railRef.current, { clearProps: "transform" });
        if (ambientRef.current) gsap.set(ambientRef.current, { clearProps: "transform" });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [n], revertOnUpdate: true },
  );

  // Discrete phase enter — only when chapter index changes (not every scroll tick)
  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const indexEl = indexRef.current;
    const titleEl = titleRef.current;
    const panel = panelRef.current;
    if (!indexEl || !titleEl || !panel) return;

    const rows = panel.querySelectorAll<HTMLElement>("[data-phase-row]");
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(indexEl, { y: 14, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.32 }, 0)
      .fromTo(titleEl, { y: 10, opacity: 0.45 }, { y: 0, opacity: 1, duration: 0.3 }, 0.03)
      .fromTo(
        rows,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.26, stagger: 0.024 },
        0.06,
      );

    return () => {
      tl.kill();
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const scene = sceneRef.current;
      if (!scene) return;
      const r = scene.getBoundingClientRect();
      if (r.bottom < HEADER_PX || r.top > window.innerHeight) return;
      e.preventDefault();
      goToPhase(active + (e.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goToPhase]);

  const phase = phases[active] ?? phases[0];

  return (
    <section ref={rootRef} className="bg-beige" data-process-phases>
      <div
        ref={sceneRef}
        data-process-scene
        data-process-active={String(active)}
        className="relative isolate flex min-h-[100svh] flex-col justify-center bg-beige lg:h-[calc(100svh-4.75rem)] lg:min-h-0"
      >
        <div
          ref={ambientRef}
          aria-hidden
          className="pointer-events-none absolute inset-[-8%] will-change-transform bg-[radial-gradient(ellipse_at_12%_0%,rgba(200,155,75,0.14),transparent_52%),radial-gradient(ellipse_at_88%_78%,rgba(117,54,39,0.07),transparent_48%)]"
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 lg:py-8">
          <header className="max-w-md">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              {processPage.eyebrow}
            </p>
            <p
              ref={indexRef}
              className="mt-8 font-heading text-[clamp(3.5rem,10vw,5.5rem)] font-semibold leading-none tabular-nums tracking-tight text-chestnut"
              aria-live="polite"
              data-process-index
            >
              {phase.index}
            </p>
            <h2
              ref={titleRef}
              className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl"
              data-process-title
            >
              {phase.title}
            </h2>
            <p className="mt-6 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
              Estimated time
            </p>
            <p className="mt-1.5 font-body text-base text-charcoal/75 sm:text-lg">
              {phase.time}
            </p>

            <ol
              className="mt-12 hidden items-center gap-3 lg:flex"
              aria-label="Process phases"
            >
              {phases.map((p, i) => (
                <li key={p.index}>
                  <button
                    type="button"
                    onClick={() => goToPhase(i)}
                    aria-current={i === active ? "step" : undefined}
                    aria-label={`Go to phase ${p.index}: ${p.title}`}
                    className={`min-h-11 min-w-11 cursor-pointer px-1 font-heading text-xs font-semibold tabular-nums tracking-wider transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut ${
                      i === active
                        ? "text-chestnut"
                        : "text-charcoal/30 hover:text-charcoal/60"
                    }`}
                  >
                    {p.index}
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-3 hidden h-px w-full max-w-xs overflow-hidden bg-warm-gray lg:block">
              <div
                ref={railRef}
                className="h-full origin-left bg-chestnut will-change-transform"
                style={{ width: "100%", transform: `scaleX(${1 / Math.max(n, 1)})` }}
              />
            </div>
            <p className="mt-4 hidden font-heading text-[0.65rem] uppercase tracking-[0.16em] text-charcoal/35 lg:block">
              Scroll through all five phases · ← →
            </p>
          </header>

          <div ref={panelRef} className="relative hidden min-h-[28rem] lg:block">
            <article
              key={phase.index}
              data-process-panel
              className="absolute inset-0"
              aria-label={`${phase.index} ${phase.title}`}
            >
              <PhaseLists phase={phase} animateRows />
            </article>
          </div>

          <div className="space-y-10 lg:hidden">
            {phases.map((p) => (
              <article
                key={p.index}
                id={`phase-${p.index}`}
                className="border-t border-warm-gray/70 pt-8"
              >
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                  {p.index}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-charcoal">
                  {p.title}
                </h3>
                <p className="mt-2 font-body text-sm text-charcoal/65">{p.time}</p>
                <div className="mt-6">
                  <PhaseLists phase={p} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseLists({
  phase,
  animateRows = false,
}: {
  phase: ProcessPhase;
  animateRows?: boolean;
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-3 sm:gap-7">
      <ListBlock title="What We’ll Do" items={phase.weDo} animateRows={animateRows} />
      <ListBlock title="What You’ll Do" items={phase.youDo} animateRows={animateRows} />
      <ListBlock title="You’ll Receive" items={phase.receive} animateRows={animateRows} />
    </div>
  );
}

function ListBlock({
  title,
  items,
  animateRows,
}: {
  title: string;
  items: string[];
  animateRows?: boolean;
}) {
  return (
    <div>
      <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta sm:text-sm">
        {title}
      </h3>
      <ul className="mt-4 space-y-0">
        {items.map((item) => (
          <li
            key={item}
            data-phase-row={animateRows ? "" : undefined}
            className="border-t border-warm-gray/60 py-3 font-body text-base leading-relaxed text-charcoal/80 sm:text-[1.0625rem]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
