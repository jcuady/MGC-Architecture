import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import ServicesExplorer from "./ServicesExplorer";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Services — professional notice first, then interactive split-pane
 * explorer (architect preferred layout).
 */
export default function Services({ data }: { data: SiteContent["services"] }) {
  return (
    <section id="services" className="scroll-mt-20 bg-beige">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          lede={data.lede}
          titleStyle={textStyle(data.styles?.title)}
          ledeStyle={textStyle(data.styles?.lede)}
        />

        {/* Architect: notice on top, before service lists / inquiry */}
        <Reveal className="mt-10">
          <aside
            aria-label="Professional notice"
            className="border-l-2 border-gold bg-warm-white px-6 py-5 sm:px-8"
          >
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Professional Notice
            </p>
            <p className="mt-3 max-w-3xl leading-relaxed text-charcoal/80">
              {data.notice}
            </p>
          </aside>
        </Reveal>

        <Reveal className="mt-10">
          <ServicesExplorer items={data.items} />
        </Reveal>
      </div>
    </section>
  );
}
