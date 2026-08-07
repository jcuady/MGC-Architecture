import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import { getSiteContent } from "@/lib/cms-server";
import { textStyle } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About — Mariane Gayle Caballero, Architectural Designer",
  description:
    "Meet Mariane Gayle Caballero — architectural designer in Manila creating thoughtful, functional, and timeless spaces from concept to construction.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Mariane Gayle Caballero | MGC Architecture",
    description:
      "Meet Mariane Gayle Caballero: Magna Cum Laude Architecture graduate designing spaces with purpose.",
    type: "website",
  },
};

/**
 * Full About page — Learn More destination from homepage teaser.
 * Composition: headline + bio left, portrait right (matches brand mock).
 */
export default async function AboutPage() {
  const content = await getSiteContent();
  const data = content.about;
  const hoverPhoto = data.photoHover;

  return (
    <>
      <Header theme="dark" />
      <main id="main" className="bg-chestnut">
        <section className="pt-[4.75rem]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 xl:gap-16">
              <div className="min-w-0 order-2 lg:order-1">
                <h1
                  className="font-heading text-3xl font-semibold leading-[1.15] text-warm-white sm:text-4xl lg:text-[2.75rem]"
                  style={textStyle(data.styles?.name)}
                >
                  {data.pageHeadline ||
                    "Hi, I'm Mariane - designer behind MGC Architecture"}
                </h1>
                <div className="mt-8 space-y-5">
                  {data.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="max-w-xl font-body text-base leading-relaxed text-warm-white/90 sm:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/inquire"
                    className="inline-flex min-h-11 items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    Start a project
                  </Link>
                  <Link
                    href="/#about"
                    className="inline-flex min-h-11 items-center border border-warm-white/50 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-warm-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    Back
                  </Link>
                </div>
              </div>

              <div className="group relative order-1 mx-auto aspect-square w-full max-w-md overflow-hidden bg-charcoal/25 lg:order-2 lg:mx-0 lg:max-w-none lg:sticky lg:top-[5.5rem]">
                <Image
                  src={data.photo}
                  alt={data.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 28rem, 90vw"
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
                    sizes="(min-width: 1024px) 38vw, (min-width: 640px) 28rem, 90vw"
                    className="object-cover object-top opacity-0 transition-opacity duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:opacity-100"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
