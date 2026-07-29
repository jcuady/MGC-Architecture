import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import Work from "@/components/sections/Work";
import { getSiteContent } from "@/lib/cms-server";
import { textStyle } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Works — Selected Projects | MGC Architecture",
  description:
    "Architectural and interior design works — each one shaped by the ideas, process, and thoughtful decisions behind it.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Works — MGC Architecture",
    description:
      "Explore residential, commercial, and institutional projects from concept to construction.",
    type: "website",
  },
};

export default async function WorksPage() {
  const content = await getSiteContent();
  const { work } = content;

  return (
    <>
      <Header theme="light" />
      <main id="main">
        <section className="border-b border-warm-gray/60 bg-beige">
          <div className="mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              {work.eyebrow}
            </p>
            <h1
              className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-charcoal sm:text-5xl"
              style={textStyle(work.styles?.title)}
            >
              {work.title}
            </h1>
            <p
              className="mt-5 max-w-xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg"
              style={textStyle(work.styles?.lede)}
            >
              {work.lede}
            </p>
            <Link
              href="/inquire"
              className="mt-8 inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut"
            >
              Start a project
            </Link>
          </div>
        </section>

        <Work data={work} heading="none" />
      </main>
      <Footer />
    </>
  );
}
