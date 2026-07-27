import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { textStyle, type SiteContent } from "@/lib/cms";

export default function Insights({ data }: { data: SiteContent["insights"] }) {
  return (
    <section id="insights" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          lede={data.lede}
          titleStyle={textStyle(data.styles?.title)}
          ledeStyle={textStyle(data.styles?.lede)}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <article className="h-full border border-warm-gray/70 p-7 sm:p-9">
              <h3 className="font-heading text-xl font-semibold text-charcoal">
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

          <Reveal delay={120}>
            <article className="h-full border border-warm-gray/70 p-7 sm:p-9">
              <h3 className="font-heading text-xl font-semibold text-charcoal">
                {data.mistakes.title}
              </h3>
              <ol className="mt-5 space-y-4">
                {data.mistakes.items.map((mistake, i) => (
                  <li key={mistake.title} className="flex gap-4">
                    <span className="font-heading text-sm font-semibold text-terracotta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-charcoal">
                        {mistake.title}
                      </p>
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-charcoal/70">
                        {mistake.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
