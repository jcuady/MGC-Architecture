import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { defaultContent, mergeSection, type SiteContent, type SectionKey } from "./cms";

/**
 * Load the landing-page content: Supabase overrides merged over code defaults.
 * Public read (RLS allows select for everyone) — no cookies needed, so the
 * page stays statically renderable with ISR.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const merged: SiteContent = structuredClone(defaultContent);

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await supabase.from("site_content").select("key, data");
    for (const row of data ?? []) {
      const key = row.key as SectionKey;
      if (key in merged) {
        merged[key] = mergeSection(merged[key], row.data) as never;
      }
    }
  } catch {
    // Supabase unreachable — fall back to the defaults baked into the code.
  }

  return merged;
});
