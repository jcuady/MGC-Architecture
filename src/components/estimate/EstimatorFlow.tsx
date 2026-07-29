"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { estimateCost, formatPhp, type FinishRate } from "@/lib/calculator";

const steps = ["Your project", "Finish level", "Your estimate"] as const;

const inputClass =
  "w-full border border-warm-gray bg-white px-4 py-3.5 font-heading text-base text-charcoal focus:border-chestnut focus:outline-none";

/**
 * Formal three-step estimate: describe the project, choose a finish by feel
 * (no prices yet), then the figure is revealed with its full breakdown.
 */
export default function EstimatorFlow({ finishes }: { finishes: FinishRate[] }) {
  const [step, setStep] = useState(0);
  const [lotArea, setLotArea] = useState("");
  const [floors, setFloors] = useState("1");
  const [finishId, setFinishId] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const lot = Number(lotArea);
  const floorCount = Number(floors);
  const finish = finishes.find((f) => f.id === finishId) ?? null;
  const detailsValid =
    Number.isFinite(lot) && lot > 0 && Number.isInteger(floorCount) && floorCount >= 1 && floorCount <= 20;
  const cost = finish && detailsValid ? estimateCost(lot, floorCount, finish.rate_per_sqm) : 0;

  // Keep screen-reader + keyboard users oriented when the step changes.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  function next() {
    setFieldError(null);
    if (step === 0 && !detailsValid) {
      setFieldError("Enter a lot area above 0 sqm and floors between 1 and 20.");
      return;
    }
    if (step === 1 && !finish) {
      setFieldError("Choose the finish level closest to what you have in mind.");
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step indicator */}
      <ol className="flex items-center gap-2 sm:gap-3" aria-label="Estimate steps">
        {steps.map((label, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={label} className="flex flex-1 flex-col gap-2">
              <span
                aria-hidden
                className={`h-0.5 w-full transition-colors duration-300 ${
                  state === "todo" ? "bg-warm-gray" : "bg-chestnut"
                }`}
              />
              <span
                aria-current={state === "current" ? "step" : undefined}
                className={`font-heading text-[0.65rem] font-semibold uppercase tracking-[0.12em] sm:text-xs ${
                  state === "todo" ? "text-charcoal/40" : "text-chestnut"
                }`}
              >
                {i + 1}. {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 border border-warm-gray/80 bg-white p-6 sm:p-10">
        {step === 0 && (
          <div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-2xl font-semibold text-charcoal outline-none sm:text-3xl"
            >
              Tell us about your project
            </h2>
            <p className="mt-2 leading-relaxed text-charcoal/70">
              This estimate covers residential builds — a home for you and your
              family.
            </p>

            <div className="mt-8 space-y-6">
              <label className="block">
                <span className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                  Project type
                </span>
                <input
                  value="Residential — building a home"
                  readOnly
                  className="w-full border border-warm-gray bg-beige/50 px-4 py-3.5 font-heading text-base text-charcoal/80"
                />
              </label>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                    Lot area (sqm)
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={1}
                    step="any"
                    placeholder="e.g. 150"
                    value={lotArea}
                    onChange={(e) => setLotArea(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">
                    Number of floors
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={20}
                    step={1}
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="w-full">
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-heading text-2xl font-semibold text-charcoal outline-none sm:text-3xl"
              >
                Which finish feels right?
              </h2>
              <p className="mt-2 leading-relaxed text-charcoal/70">
                Choose by how you want to live in the space — the numbers come in
                the next step.
              </p>
            </legend>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {finishes.map((f) => {
                const selected = finishId === f.id;
                return (
                  <label
                    key={f.id}
                    className={`flex cursor-pointer flex-col gap-2 border p-5 transition-colors duration-200 ${
                      selected
                        ? "border-chestnut bg-beige/60"
                        : "border-warm-gray bg-white hover:border-chestnut/50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-heading text-base font-semibold text-charcoal">
                        {f.name}
                      </span>
                      <input
                        type="radio"
                        name="finish"
                        value={f.id}
                        checked={selected}
                        onChange={() => setFinishId(f.id)}
                        className="h-4 w-4 accent-[#753627]"
                      />
                    </span>
                    <span className="text-sm leading-relaxed text-charcoal/70">
                      {f.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 2 && finish && (
          <div aria-live="polite">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-2xl font-semibold text-charcoal outline-none sm:text-3xl"
            >
              Your starting estimate
            </h2>
            <CountUpAmount amount={cost} />
            <dl className="mt-8 divide-y divide-warm-gray/60 border-y border-warm-gray/60">
              <BreakdownRow label="Finish level" value={finish.name} />
              <BreakdownRow
                label="Rate applied"
                value={`${formatPhp(finish.rate_per_sqm)} per sqm`}
              />
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-charcoal/65">
              A rough guide, not a quote — actual cost depends on scope,
              materials, site conditions, and market rates. Next, inquire and
              we&apos;ll refine this around your lot and lifestyle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/inquire?category=${encodeURIComponent("Cost Estimation & Budget Planning")}`}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center bg-chestnut px-8 py-3.5 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta"
              >
                Inquire
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                }}
                className="inline-flex min-h-12 items-center justify-center border border-chestnut px-8 py-3.5 font-heading text-sm font-semibold text-chestnut transition-colors hover:bg-chestnut hover:text-warm-white"
              >
                Adjust my details
              </button>
            </div>
          </div>
        )}

        {fieldError && (
          <p role="alert" className="mt-6 font-heading text-sm text-terracotta">
            {fieldError}
          </p>
        )}

        {step < 2 && (
          <div className="mt-10 flex items-center justify-between border-t border-warm-gray/60 pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setFieldError(null);
                  setStep((s) => s - 1);
                }}
                className="min-h-11 font-heading text-sm font-semibold text-charcoal/60 transition-colors hover:text-charcoal"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={next}
              className="inline-flex min-h-12 items-center bg-chestnut px-8 py-3.5 font-heading text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta"
            >
              {step === 1 ? "Reveal my estimate" : "Continue"}
              <span aria-hidden className="ml-2">
                →
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** The reveal moment: the figure counts up once, respecting reduced motion. */
function CountUpAmount({ amount }: { amount: number }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      node.textContent = formatPhp(amount);
      return;
    }
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: amount,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: () => {
        node.textContent = formatPhp(counter.value);
      },
    });
    return () => {
      tween.kill();
    };
  }, [amount]);

  return (
    <p
      ref={ref}
      className="mt-4 font-heading text-[clamp(2.25rem,7vw,3.5rem)] font-semibold leading-none tracking-tight text-chestnut tabular-nums"
    >
      {formatPhp(amount)}
    </p>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
      <dt className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/55">
        {label}
      </dt>
      <dd className="font-heading text-sm text-charcoal">{value}</dd>
    </div>
  );
}
