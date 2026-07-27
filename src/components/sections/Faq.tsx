import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { textStyle, type SiteContent } from "@/lib/cms";

/** ponytail: native <details> accordion — keyboard/screen-reader accessible with zero JS. */
export default function Faq({ data }: { data: SiteContent["faq"] }) {
  return (
    <section id="faq" className="scroll-mt-20 bg-beige">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <SectionHeader
            eyebrow={data.eyebrow}
            title={data.title}
            lede={data.lede}
            titleStyle={textStyle(data.styles?.title)}
            ledeStyle={textStyle(data.styles?.lede)}
          />

          <Reveal delay={100}>
            <div className="divide-y divide-warm-gray/70 border-y border-warm-gray/70">
              {data.items.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      aria-hidden
                      className="relative h-4 w-4 shrink-0 text-terracotta"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="pb-6 leading-relaxed text-charcoal/75">{faq.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
