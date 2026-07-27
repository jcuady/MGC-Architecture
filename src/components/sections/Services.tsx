import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";
import SectionHeader from "../SectionHeader";
import { textStyle, type SiteContent } from "@/lib/cms";

/**
 * Services as clickable editorial cards: the first two lead at double width,
 * the rest complete the grid. Every card is a real portfolio render with a
 * destination — cost planning routes to the estimator.
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-7">
          {data.items.map((service, i) => {
            const featured = i < 2;
            return (
              <Reveal
                key={service.title}
                delay={(i % 3) * 90}
                className={featured ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <Link
                  href={service.href}
                  className="group flex h-full flex-col bg-warm-white outline-offset-4 transition-shadow duration-300 hover:shadow-[0_20px_50px_-24px_rgba(47,42,40,0.45)]"
                  aria-label={`${service.title} — ${service.ctaLabel}`}
                >
                  <div
                    className={`relative overflow-hidden bg-warm-gray ${
                      featured ? "aspect-[16/9]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes={
                        featured
                          ? "(min-width: 1024px) 50vw, 100vw"
                          : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                    <p className="absolute bottom-0 left-0 p-5 font-heading text-lg font-semibold text-warm-white sm:text-xl">
                      {service.title}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="leading-relaxed text-charcoal/75">{service.blurb}</p>
                    <ul
                      className={`mt-4 gap-x-6 gap-y-2 border-t border-warm-gray/60 pt-4 ${
                        featured ? "grid sm:grid-cols-2" : "space-y-2"
                      }`}
                    >
                      {service.scope.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 font-heading text-sm text-charcoal/70"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.55em] h-px w-4 shrink-0 bg-gold"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto flex items-center gap-2 pt-5 font-heading text-sm font-semibold text-chestnut">
                      {service.ctaLabel}
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Professional notice — required, visible within Services */}
        <Reveal className="mt-12">
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
      </div>
    </section>
  );
}
