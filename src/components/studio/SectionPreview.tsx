"use client";

// True WYSIWYG preview: renders the *actual* landing-page components with the
// editor's draft data inside a scaled, inert frame — what you see here is
// exactly what publishes.

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Hero from "@/components/sections/Hero";
import Studio from "@/components/sections/Studio";
import { WorkView } from "@/components/sections/Work";
import { defaultProjects } from "@/lib/projects";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Insights from "@/components/sections/Insights";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import EstimatorHook from "@/components/sections/EstimatorHook";
import Showcase from "@/components/Showcase";
import { textStyle, type SiteContent, type SectionKey } from "@/lib/cms";

export type Device = "desktop" | "tablet" | "mobile";
export const deviceWidths: Record<Device, number> = {
  desktop: 1366,
  tablet: 768,
  mobile: 390,
};

/* Footer's real component fetches on the server, so the preview mirrors the
   compact logo band (tagline removed per architect). */
function FooterPreview({ data: _data }: { data: SiteContent["footer"] }) {
  return (
    <div className="relative overflow-hidden bg-chestnut px-8 py-8 text-warm-white">
      <Image
        src="/brand/monogram-white.png"
        alt=""
        aria-hidden
        width={400}
        height={400}
        className="pointer-events-none absolute -bottom-12 -right-10 w-56 opacity-[0.06]"
      />
      <Image
        src="/brand/logo-stacked-white.png"
        alt="MGC Architecture"
        width={160}
        height={160}
        className="relative h-20 w-20 object-contain"
      />
    </div>
  );
}

function renderSection(sectionKey: SectionKey, data: never): ReactNode {
  switch (sectionKey) {
    case "hero":
      return <Hero data={data} />;
    case "studio":
      return <Studio data={data} />;
    case "work":
      // Preview uses code defaults; live cards are edited under Studio → Projects.
      return <WorkView data={data} projects={defaultProjects} />;
    case "services":
      return <Services data={data} />;
    case "estimator":
      return <EstimatorHook data={data} />;
    case "about":
      return <About data={data} />;
    case "process":
      return <Process data={data} />;
    case "insights":
      return <Insights data={data} />;
    case "inquire": {
      const d = data as SiteContent["inquire"];
      return (
        <div className="bg-beige px-8 py-16">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            {d.eyebrow}
          </p>
          <h2
            className="mt-4 max-w-xl font-heading text-3xl font-semibold text-charcoal"
            style={textStyle(d.styles?.title)}
          >
            {d.title}
          </h2>
          <p
            className="mt-4 max-w-lg font-body text-base leading-relaxed text-charcoal/70"
            style={textStyle(d.styles?.lede)}
          >
            {d.lede}
          </p>
          <ol className="mt-8 space-y-2">
            {Object.values(d.steps).map((label, i) => (
              <li key={label} className="font-heading text-sm text-charcoal/80">
                {String(i + 1).padStart(2, "0")} — {label}
              </li>
            ))}
          </ol>
          <p className="mt-8 inline-flex bg-chestnut px-5 py-3 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white">
            {d.submitLabel}
          </p>
        </div>
      );
    }
    case "faq":
      return <Faq data={data} />;
    case "contact":
      return <Contact data={data} />;
    case "footer":
      return <FooterPreview data={data} />;
    case "showcaseNoir":
    case "showcaseHearth": {
      const d = data as SiteContent["showcaseNoir"] & { ctaLabel?: string };
      return (
        <Showcase
          src={d.image}
          alt="Showcase preview"
          eyebrow={d.eyebrow}
          lines={[d.line1, d.line2]}
          lineStyle={textStyle(d.styles?.lines)}
          cta={d.ctaLabel ? { label: d.ctaLabel, href: "/inquire" } : undefined}
        />
      );
    }
  }
}

export default function SectionPreview({
  sectionKey,
  data,
  device,
}: {
  sectionKey: SectionKey;
  data: unknown;
  device: Device;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(400);
  const width = deviceWidths[device];

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const nextScale = Math.min(1, outer.clientWidth / width);
      setScale(nextScale);
      setHeight(inner.offsetHeight * nextScale);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [width, data]);

  return (
    <div
      ref={outerRef}
      className="overflow-hidden border border-warm-gray/70 bg-white"
      style={{ height }}
    >
      {/* inert: the preview is display-only — links, forms, and accordions
          inside it can't be activated, exactly like Elementor's canvas. */}
      <div
        ref={innerRef}
        inert
        aria-label="Live section preview"
        className="origin-top-left bg-warm-white"
        style={{ width, transform: `scale(${scale})` }}
      >
        {renderSection(sectionKey, data as never)}
      </div>
    </div>
  );
}
