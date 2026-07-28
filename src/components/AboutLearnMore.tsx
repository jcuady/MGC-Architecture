"use client";

import { useId, useRef } from "react";

type Props = {
  name: string;
  role: string;
  intro: string;
  body: string[];
  label?: string;
};

/**
 * Learn More — opens the full bio in a native dialog (focus trap + Esc built-in).
 */
export default function AboutLearnMore({
  name,
  role,
  intro,
  body,
  label = "Learn More",
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="mt-8 inline-flex min-h-11 items-center border border-warm-white/70 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-chestnut focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {label}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed left-1/2 top-1/2 z-50 m-0 max-h-[min(90vh,40rem)] w-[min(92vw,36rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-warm-white/15 bg-chestnut p-0 text-warm-white shadow-2xl backdrop:bg-charcoal/70 open:flex open:flex-col"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-warm-white/15 bg-chestnut px-6 py-4 sm:px-8">
          <div>
            <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
              Full biography
            </p>
            <h3 id={titleId} className="mt-1 font-heading text-xl font-semibold text-warm-white">
              {name}
            </h3>
            <p className="mt-0.5 font-heading text-sm text-warm-white/70">{role}</p>
          </div>
          <form method="dialog">
            <button
              type="submit"
              className="inline-flex min-h-10 min-w-10 items-center justify-center font-heading text-sm text-warm-white/80 transition-colors hover:text-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Close biography"
            >
              ✕
            </button>
          </form>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
          <p className="text-base leading-relaxed text-warm-white/95">{intro}</p>
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="leading-relaxed text-warm-white/80">
              {paragraph}
            </p>
          ))}
        </div>
      </dialog>
    </>
  );
}
