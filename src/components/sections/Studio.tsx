import Reveal from "../Reveal";
import { textStyle, type SiteContent } from "@/lib/cms";

export default function Studio({ data }: { data: SiteContent["studio"] }) {
  return (
    <section id="studio" className="border-b border-warm-gray/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p
            className="max-w-4xl font-heading text-2xl font-medium leading-snug text-charcoal sm:text-3xl lg:text-[2.125rem]"
            style={textStyle(data.styles?.statement)}
          >
            {data.statement}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 border-t border-warm-gray/60 pt-10 sm:grid-cols-3">
          {data.points.map((p, i) => (
            <Reveal key={p.label} delay={i * 90}>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                {p.label}
              </p>
              <p className="mt-3 leading-relaxed text-charcoal/80">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
