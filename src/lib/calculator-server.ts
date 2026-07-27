import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { defaultFinishRates, type FinishRate } from "@/lib/calculator";

type FinishRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  rate_per_sqm: number | string;
  sort_order: number | string;
  is_active: boolean;
};

function toFinishRate(row: FinishRow): FinishRate {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    rate_per_sqm: Number(row.rate_per_sqm),
    sort_order: Number(row.sort_order),
    is_active: Boolean(row.is_active),
  };
}

const COLUMNS = "id, name, slug, description, rate_per_sqm, sort_order, is_active";

/** Active finish rates for the public estimator (cached per request). */
export const getActiveFinishRates = cache(async (): Promise<FinishRate[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("finish_rates")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return defaultFinishRates;
    return data.map(toFinishRate);
  } catch {
    return defaultFinishRates;
  }
});

/** Full list for admin CRUD (includes inactive). */
export const getAllFinishRates = cache(async (): Promise<FinishRate[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("finish_rates")
    .select(COLUMNS)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(toFinishRate);
});
