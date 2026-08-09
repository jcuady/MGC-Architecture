"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useId, useState, type KeyboardEvent } from "react";
import type { SiteContent } from "@/lib/cms";

type ServiceItem = SiteContent["services"]["items"][number];

/**
 * Services explorer — desktop split-pane; mobile accordion with the
 * image panel nested under the active category (not after the full list).
 */
export default function ServicesExplorer({ items }: { items: ServiceItem[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const current = items[active] ?? items[0];
  if (!current) return null;

  const tabId = (i: number) => `${baseId}-tab-${i}`;
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  function select(i: number) {
    setActive(i);
  }

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
    select(next);
    document.getElementById(tabId(next))?.focus();
  }

  return (
    <div className="border border-warm-gray/70 bg-warm-white">
      {/* Mobile: accordion — panel sits under its category */}
      <div className="flex flex-col lg:hidden">
        {items.map((service, i) => {
          const selected = i === active;
          const headingId = `${baseId}-mobile-h-${i}`;
          const regionId = `${baseId}-mobile-p-${i}`;
          return (
            <Fragment key={service.title}>
              <button
                type="button"
                id={headingId}
                aria-expanded={selected}
                aria-controls={regionId}
                onClick={() => select(i)}
                className={`group flex min-h-14 w-full items-start justify-between gap-4 border-b border-warm-gray/50 px-5 py-5 text-left transition-colors duration-200 sm:px-7 sm:py-6 ${
                  selected
                    ? "bg-charcoal text-warm-white"
                    : "bg-transparent text-charcoal hover:bg-beige"
                }`}
              >
                <CategoryCopy service={service} selected={selected} />
              </button>
              {selected ? (
                <div
                  id={regionId}
                  role="region"
                  aria-labelledby={headingId}
                  className="border-b border-warm-gray/50"
                >
                  <ServicePanel service={service} priority={i === 0} />
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {/* Desktop: split pane */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div
          role="tablist"
          aria-label="Service categories"
          aria-orientation="vertical"
          onKeyDown={onListKeyDown}
          className="flex flex-col border-r border-warm-gray/70"
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
                aria-controls={panelId(active)}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={`group flex min-h-14 items-start justify-between gap-4 border-b border-warm-gray/50 px-7 py-6 text-left transition-colors duration-200 last:border-b-0 ${
                  selected
                    ? "bg-charcoal text-warm-white"
                    : "bg-transparent text-charcoal hover:bg-beige"
                }`}
              >
                <CategoryCopy service={service} selected={selected} />
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={panelId(active)}
          aria-labelledby={tabId(active)}
          className="relative min-h-[28rem]"
        >
          <ServicePanel service={current} priority={active === 0} />
        </div>
      </div>
    </div>
  );
}

function CategoryCopy({
  service,
  selected,
}: {
  service: ServiceItem;
  selected: boolean;
}) {
  return (
    <>
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
          selected ? "text-gold translate-x-0.5 -translate-y-0.5" : "text-charcoal/35 group-hover:text-chestnut"
        }`}
      >
        ↗
      </span>
    </>
  );
}

function ServicePanel({
  service,
  priority,
}: {
  service: ServiceItem;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] min-h-[18rem] overflow-hidden bg-charcoal sm:min-h-[22rem] lg:absolute lg:inset-0 lg:aspect-auto lg:min-h-0">
      <Image
        key={service.image}
        src={service.image}
        alt={service.imageAlt}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover grayscale-[0.15] transition-opacity duration-300"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-charcoal/35" />

      <ul className="absolute inset-x-0 top-0 z-10 flex flex-wrap gap-2 p-4 sm:p-5">
        {service.scope.map((tag) => (
          <li
            key={tag}
            className="bg-warm-white/95 px-2.5 py-1 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-charcoal"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
        <Link
          href={service.href}
          className="pointer-events-auto inline-flex min-h-14 cursor-pointer items-center border border-warm-white/90 bg-charcoal/35 px-8 py-4 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-warm-white backdrop-blur-md transition-colors hover:bg-warm-white hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-white sm:min-h-16 sm:px-12 sm:py-5 sm:text-base"
        >
          {service.ctaLabel}
        </Link>
      </div>

      <p className="absolute bottom-0 left-0 z-10 max-w-[min(100%,18rem)] p-4 font-heading text-lg font-semibold text-warm-white sm:max-w-xs sm:p-6 sm:text-xl">
        {service.title}
      </p>
    </div>
  );
}
