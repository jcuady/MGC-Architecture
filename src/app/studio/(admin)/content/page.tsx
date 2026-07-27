import Link from "next/link";
import { sectionMeta, type SectionKey } from "@/lib/cms";
import { createClient } from "@/lib/supabase/server";

export default async function ContentPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("key, updated_at");
  const customized = new Map((data ?? []).map((row) => [row.key, row.updated_at]));

  return (
    <>
      <h1 className="font-heading text-2xl font-semibold text-charcoal">Site Content</h1>
      <p className="mt-1 max-w-2xl text-sm text-charcoal/70">
        Every section of the landing page is editable — text, images, and
        typography (brand fonts and sizes) — with a live preview before you
        publish. Sections you haven&apos;t touched keep the original design.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(sectionMeta) as SectionKey[]).map((key) => {
          const meta = sectionMeta[key];
          const updatedAt = customized.get(key);
          return (
            <li key={key}>
              <Link
                href={`/studio/content/${key}`}
                className="flex h-full flex-col justify-between border border-warm-gray/70 bg-white p-6 transition-colors hover:border-chestnut"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-heading text-base font-semibold text-charcoal">
                      {meta.label}
                    </h2>
                    {updatedAt ? (
                      <span className="shrink-0 border border-chestnut/30 bg-chestnut/10 px-2 py-0.5 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-chestnut">
                        Customized
                      </span>
                    ) : (
                      <span className="shrink-0 border border-warm-gray bg-warm-gray/30 px-2 py-0.5 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-charcoal/50">
                        Original
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                    {meta.description}
                  </p>
                </div>
                <p className="mt-4 font-heading text-xs text-charcoal/45">
                  {updatedAt
                    ? `Last edited ${new Date(updatedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}`
                    : "Never edited"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
