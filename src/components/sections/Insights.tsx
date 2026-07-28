import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import LatestArticles from "./LatestArticles";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Before You Build — modular 4-slot grid (2 live + 2 reserved for
 * architect content to follow), then Latest Articles card row.
 */
export default function Insights({ data }: { data: SiteContent["insights"] }) {
  return (
    <>
      <section id="insights" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <SectionHeader
            eyebrow={data.eyebrow}
            title={data.title}
            lede={data.lede}
            titleStyle={textStyle(data.styles?.title)}
            ledeStyle={textStyle(data.styles?.lede)}
          />

          {/* 2×2 modular grid — room for two more topics */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:gap-6">
            <Reveal className="sm:row-span-2">
              <article className="flex h-full flex-col border border-warm-gray/70 bg-warm-white p-7 sm:p-9">
                <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                  01
                </p>
                <h3 className="mt-3 font-heading text-xl font-semibold text-charcoal sm:text-2xl">
                  {data.teamMatters.title}
                </h3>
                {data.teamMatters.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="mt-4 leading-relaxed text-charcoal/75"
                  >
                    {paragraph}
                  </p>
                ))}
              </article>
            </Reveal>

            <Reveal delay={80}>
              <article className="flex h-full flex-col border border-warm-gray/70 bg-warm-white p-7 sm:p-8">
                <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                  02
                </p>
                <h3 className="mt-3 font-heading text-lg font-semibold text-charcoal sm:text-xl">
                  {data.mistakes.title}
                </h3>
                <ol className="mt-5 space-y-3.5">
                  {data.mistakes.items.map((mistake, i) => (
                    <li key={mistake.title} className="flex gap-3">
                      <span className="font-heading text-xs font-semibold text-terracotta">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-heading text-sm font-semibold text-charcoal">
                          {mistake.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-charcoal/70">
                          {mistake.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>

            {data.upcoming.map((item, i) => (
              <Reveal key={item.title} delay={120 + i * 60}>
                <article
                  aria-label={`${item.title} — coming soon`}
                  className="relative flex h-full min-h-[14rem] flex-col justify-between border border-dashed border-warm-gray bg-beige/60 p-7 sm:p-8"
                >
                  <div>
                    <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-terracotta/80">
                      {String(i + 3).padStart(2, "0")} · Coming soon
                    </p>
                    <h3 className="mt-3 font-heading text-lg font-semibold text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                      {item.teaser}
                    </p>
                  </div>
                  <p className="mt-6 font-heading text-xs uppercase tracking-[0.16em] text-charcoal/40">
                    Content to follow
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <LatestArticles data={data.articles} />
    </>
  );
}
