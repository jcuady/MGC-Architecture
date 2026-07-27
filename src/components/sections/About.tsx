import Image from "next/image";
import Reveal from "../Reveal";
import { textStyle, type SiteContent } from "@/lib/cms";

export default function About({ data }: { data: SiteContent["about"] }) {
  return (
    <section id="about" className="relative scroll-mt-20 overflow-hidden bg-chestnut">
      {/* Signature: oversized monogram watermark, as on the brand guideline covers */}
      <Image
        src="/brand/monogram-white.png"
        alt=""
        aria-hidden
        width={900}
        height={900}
        className="pointer-events-none absolute -bottom-40 -right-32 w-[34rem] opacity-[0.06] sm:w-[46rem]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {data.eyebrow}
              </p>
              <h2
                className="mt-4 font-heading text-3xl font-semibold leading-tight text-warm-white sm:text-4xl"
                style={textStyle(data.styles?.name)}
              >
                {data.name}
              </h2>
              <p className="mt-2 font-heading text-sm font-medium tracking-wide text-warm-gray">
                {data.role}
              </p>
            </Reveal>

            <Reveal delay={90}>
              <p
                className="mt-8 text-lg leading-relaxed text-warm-white/95"
                style={textStyle(data.styles?.intro)}
              >
                {data.intro}
              </p>
              {data.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mt-5 leading-relaxed text-warm-white/80"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>

          <div className="space-y-10">
            <Reveal delay={120}>
              <h3 className="border-b border-warm-white/20 pb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Education
              </h3>
              <p className="mt-4 font-heading font-medium text-warm-white">
                {data.education.degree}
              </p>
              <p className="mt-1 text-warm-white/75">{data.education.school}</p>
              <p className="text-warm-white/75">{data.education.honors}</p>
            </Reveal>

            <Reveal delay={180}>
              <h3 className="border-b border-warm-white/20 pb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Awards &amp; Distinctions
              </h3>
              <ul className="mt-4 space-y-2.5">
                {data.awards.map((award) => (
                  <li key={award} className="flex gap-3 leading-snug text-warm-white/80">
                    <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-gold" />
                    {award}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={240}>
              <h3 className="border-b border-warm-white/20 pb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Skills &amp; Software
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {[...data.skills, ...data.software].map((item) => (
                  <li
                    key={item}
                    className="border border-warm-white/25 px-3 py-1.5 font-heading text-xs font-medium text-warm-white/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
