import Image from "next/image";
import Link from "next/link";
import { textStyle, type SiteContent } from "@/lib/cms";

type AboutData = SiteContent["about"];

/**
 * Homepage About teaser — photo left, bio right, Learn More → /about.
 * Credentials live on the dedicated /about page (not a dialog).
 */
export default function About({ data }: { data: AboutData }) {
  const hoverPhoto = data.photoHover;

  return (
    <section id="about" className="scroll-mt-20 bg-chestnut">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="group relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-charcoal/25 lg:mx-0 lg:max-w-none">
            <Image
              src={data.photo}
              alt={data.photoAlt}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 90vw"
              className={
                hoverPhoto
                  ? "object-cover object-top transition-opacity duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-0"
                  : "object-cover object-top"
              }
              priority
            />
            {hoverPhoto ? (
              <Image
                src={hoverPhoto}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 90vw"
                className="object-cover object-top opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-100"
              />
            ) : null}
          </div>

          <div className="min-w-0">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {data.eyebrow}
            </p>
            <h2
              className="mt-4 font-heading text-3xl font-semibold leading-tight text-warm-white sm:text-4xl"
              style={textStyle(data.styles?.name)}
            >
              {data.name}
            </h2>
            <p className="mt-2 font-heading text-sm font-medium tracking-wide text-warm-white/75">
              {data.role}
            </p>
            <p
              className="mt-6 max-w-xl font-body text-base leading-relaxed text-warm-white/95 sm:text-lg"
              style={textStyle(data.styles?.intro)}
            >
              {data.intro}
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex min-h-11 items-center border border-warm-white/70 px-6 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-warm-white transition-colors hover:bg-warm-white hover:text-chestnut focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {data.learnMoreLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
