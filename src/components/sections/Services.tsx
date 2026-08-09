import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import ServicesExplorer from "./ServicesExplorer";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Inquire section — service explorer that routes into /inquire (or /estimate).
 * Professional notice lives in the inquire wizard, not here.
 */
export default function Services({ data }: { data: SiteContent["services"] }) {
  return (
    <section id="services" className="scroll-mt-20 bg-beige">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
        <SectionHeader
          eyebrow="Inquire"
          title={data.title}
          lede={data.lede}
          titleStyle={textStyle(data.styles?.title)}
          ledeStyle={textStyle(data.styles?.lede)}
        />

        <Reveal className="mt-10">
          <ServicesExplorer items={data.items} />
        </Reveal>
      </div>
    </section>
  );
}
