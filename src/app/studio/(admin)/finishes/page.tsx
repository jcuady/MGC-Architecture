import FinishesCrud from "@/components/studio/FinishesCrud";
import { getAllFinishRates } from "@/lib/calculator-server";

export const dynamic = "force-dynamic";

export default async function FinishesPage() {
  const finishes = await getAllFinishRates();

  return (
    <div>
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
        Pricing
      </p>
      <h1 className="mt-2 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
        Finish rates
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/70">
        Rates and descriptions power the Cost Estimator at /estimate. Create,
        edit, hide, or delete finishes anytime — the estimator updates after
        each save. Formula: (Lot area × 0.60) × Floors × Rate / sqm.
      </p>
      <FinishesCrud initial={finishes} />
    </div>
  );
}
