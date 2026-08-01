"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header theme="dark" />
      <main id="main" className="min-h-[70vh] bg-warm-white">
        <section className="bg-chestnut pt-[4.75rem]">
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-14 sm:pt-12">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Something went wrong
            </p>
            <h1 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-tight text-warm-white sm:text-4xl">
              We hit a snag loading this page.
            </h1>
            <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-warm-white/70">
              Your connection may be slow, or a temporary issue occurred. Try again — if it keeps
              happening, email us and we&apos;ll help.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center border border-warm-white/40 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-warm-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
