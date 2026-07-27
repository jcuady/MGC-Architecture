import Link from "next/link";
import { notFound } from "next/navigation";
import SectionEditor from "@/components/studio/SectionEditor";
import { defaultContent, mergeSection, sectionMeta, type SectionKey } from "@/lib/cms";
import { createClient } from "@/lib/supabase/server";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(section in defaultContent)) notFound();
  const key = section as SectionKey;

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", key)
    .maybeSingle();

  const merged = mergeSection(defaultContent[key], row?.data ?? null);

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/50">
          <li>
            <Link href="/studio/content" className="link-draw">
              Site Content
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-charcoal">{sectionMeta[key].label}</li>
        </ol>
      </nav>

      <h1 className="mt-4 font-heading text-2xl font-semibold text-charcoal">
        {sectionMeta[key].label}
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-charcoal/70">
        {sectionMeta[key].description}. Edit on the left, watch the exact live
        section update on the right — nothing publishes until you save.
      </p>

      <div className="mt-8">
        <SectionEditor
          sectionKey={key}
          label={sectionMeta[key].label}
          initial={merged as never}
          isCustomized={Boolean(row)}
        />
      </div>
    </>
  );
}
