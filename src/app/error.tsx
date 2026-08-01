"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-warm-white px-5 py-24 text-center">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
        Something went wrong
      </p>
      <h1 className="mt-4 max-w-lg font-heading text-3xl font-semibold text-charcoal">
        We hit a snag loading this page.
      </h1>
      <p className="mt-4 max-w-md font-body text-charcoal/70">
        Your connection may be slow, or a temporary issue occurred. Try again — if it
        keeps happening, email us and we&apos;ll help.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center bg-chestnut px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center border border-warm-gray px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-charcoal"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
