"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { label: "Dashboard", href: "/studio" },
  { label: "Inquiries & Bookings", href: "/studio/inquiries" },
  { label: "Projects", href: "/studio/projects" },
  { label: "Site Content", href: "/studio/content" },
  { label: "Finish rates", href: "/studio/finishes" },
  { label: "Blog", href: "/studio/blog" },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/studio/login");
    router.refresh();
  }

  const nav = (
    <>
      <div className="flex items-center gap-3 border-b border-warm-white/10 px-5 py-4 lg:px-6 lg:py-5">
        <Image
          src="/brand/monogram-white.png"
          alt=""
          width={40}
          height={40}
          className="h-9 w-9 object-contain"
        />
        <div>
          <p className="font-heading text-sm font-semibold leading-tight">mgc architecture</p>
          <p className="font-heading text-[0.65rem] font-medium uppercase tracking-[0.25em] text-gold">
            Studio
          </p>
        </div>
        <button
          type="button"
          className="ml-auto flex h-11 w-11 items-center justify-center lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <span aria-hidden className="text-xl leading-none text-warm-white/80">
            ×
          </span>
        </button>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const active = link.href === "/studio" ? pathname === "/studio" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block min-h-11 border-l-2 px-4 py-3 font-heading text-sm font-medium transition-colors ${
                    active
                      ? "border-gold bg-warm-white/10 text-warm-white"
                      : "border-transparent text-warm-white/70 hover:bg-warm-white/5 hover:text-warm-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-warm-white/10 px-5 py-5 lg:px-6">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw font-heading text-xs font-medium text-warm-white/70"
        >
          View live site ↗
        </a>
        <p className="mt-4 truncate font-heading text-xs text-warm-white/50" title={email}>
          {email}
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-3 min-h-11 w-full border border-warm-white/25 px-4 py-2 font-heading text-xs font-semibold text-warm-white/85 transition-colors hover:bg-warm-white hover:text-charcoal"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-warm-gray/70 bg-charcoal px-4 py-3 text-warm-white lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <Image src="/brand/monogram-white.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold">MGC Studio</p>
            <p className="font-heading text-[0.6rem] uppercase tracking-[0.2em] text-gold">Admin</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
          aria-expanded={open}
          aria-controls="studio-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-0.5 w-5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-current ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="studio-nav"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col bg-charcoal text-warm-white transition-transform duration-200 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {nav}
      </aside>
    </>
  );
}

