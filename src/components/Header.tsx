"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";

export default function Header({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid header once scrolled past the hero top, or when the menu is open.
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-warm-white/95 text-charcoal shadow-[0_1px_0_0_var(--color-warm-gray)] backdrop-blur"
          : theme === "light"
            ? "bg-transparent text-charcoal"
            : "bg-transparent text-warm-white"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-chestnut focus:px-4 focus:py-2 focus:font-heading focus:text-sm focus:text-warm-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="MGC Architecture — back to top"
          onClick={() => setOpen(false)}
        >
          <Image
            src={
              solid || theme === "light"
                ? "/brand/monogram-chestnut.png"
                : "/brand/monogram-white.png"
            }
            alt=""
            width={44}
            height={44}
            className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            priority
          />
          <span className="font-heading text-sm font-semibold leading-tight tracking-wide sm:text-base">
            mgc
            <br />
            architecture
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 xl:gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-draw font-heading text-xs font-medium tracking-wide xl:text-sm"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#contact"
            className={`shrink-0 font-heading text-xs font-semibold transition-colors xl:text-sm ${
              solid
                ? "bg-chestnut px-4 py-2.5 text-warm-white hover:bg-terracotta xl:px-5"
                : theme === "light"
                  ? "text-chestnut hover:text-terracotta"
                  : "bg-warm-white px-4 py-2.5 text-chestnut hover:bg-beige xl:px-5"
            }`}
          >
            Start a project
          </a>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-6 bg-current ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-6 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-warm-gray bg-warm-white px-5 pb-8 pt-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block border-b border-beige py-4 font-heading text-lg font-medium text-charcoal"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#contact"
            className="mt-6 block bg-chestnut px-5 py-3.5 text-center font-heading text-sm font-semibold text-warm-white"
            onClick={() => setOpen(false)}
          >
            Start a project
          </a>
        </nav>
      )}
    </header>
  );
}
