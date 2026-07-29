"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import type { SiteContent } from "@/lib/cms";

type ServiceItem = SiteContent["services"]["items"][number];

/**
 * Split-pane services explorer — left list drives right panel
 * (sub-categories, image, inquire CTA). Architect: active row
 * flips background; unique image per category.
 */
export default function ServicesExplorer({ items }: { items: ServiceItem[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const current = items[active] ?? items[0];
  if (!current) return null;

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;

  function onListKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
      return;
    }
    e.preventDefault();
    const last = items.length - 1;
    let next = active;
    if (e.key === "ArrowDown") next = active >= last ? 0 : active + 1;
    if (e.key === "ArrowUp") next = active <= 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    setActive(next);
    document.getElementById(tabId(next))?.focus();
  }

  return (
    <div className="grid gap-0 border border-warm-gray/70 bg-warm-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Left: service categories */}
      <div
        role="tablist"
        aria-label="Service categories"
        aria-orientation="vertical"
        onKeyDown={onListKeyDown}
        className="flex flex-col border-b border-warm-gray/70 lg:border-b-0 lg:border-r"
      >
        {items.map((service, i) => {
          const selected = i === active;
          return (
            <button
              key={service.title}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group flex min-h-14 items-start justify-between gap-4 border-b border-warm-gray/50 px-5 py-5 text-left transition-colors duration-200 last:border-b-0 sm:px-7 sm:py-6 ${
                selected
                  ? "bg-charcoal text-warm-white"
                  : "bg-transparent text-charcoal hover:bg-beige"
              }`}
            >
              <span className="min-w-0">
                <span className="block font-heading text-sm font-semibold uppercase tracking-[0.12em] sm:text-[0.95rem]">
                  {service.title}
                </span>
                <span
                  className={`mt-1.5 block text-sm leading-snug ${
                    selected ? "text-warm-white/70" : "text-charcoal/60"
                  }`}
                >
                  {service.blurb}
                </span>
              </span>
              <span
                aria-hidden
                className={`mt-0.5 shrink-0 font-heading text-lg leading-none transition-transform duration-200 ${
                  selected ? "text-gold" : "text-charcoal/35 group-hover:text-chestnut"
                } ${selected ? "translate-x-0.5 -translate-y-0.5" : ""}`}
              >
                ↗
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: sub-categories + image + CTA */}
      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(active)}
        className="relative flex min-h-[22rem] flex-col sm:min-h-[28rem]"
      >
        <div className="relative flex-1 overflow-hidden bg-charcoal">
          <Image
            key={current.image}
            src={current.image}
            alt={current.imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover grayscale-[0.15] transition-opacity duration-300"
            priority={active === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-charcoal/35" />

          {/* Sub-categories */}
          <ul className="absolute inset-x-0 top-0 z-10 flex flex-wrap gap-2 p-4 sm:p-5">
            {current.scope.map((tag) => (
              <li
                key={tag}
                className="bg-warm-white/95 px-2.5 py-1 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-charcoal"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-6">
            <p className="max-w-xs font-heading text-lg font-semibold text-warm-white sm:text-xl">
              {current.title}
            </p>
            <Link
              href={current.href}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center border border-warm-white/90 bg-warm-white/10 px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-warm-white backdrop-blur-sm transition-colors hover:bg-warm-white hover:text-charcoal"
            >
              {current.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
