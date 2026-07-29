import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import Faq from "@/components/sections/Faq";
import { getSiteContent } from "@/lib/cms-server";
import { textStyle } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "FAQ — Common Questions | MGC Architecture",
  description:
    "Quick answers about costs, timeline, permits, property documents, and what to prepare before your first meeting.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — MGC Architecture",
    description:
      "Costs, timeline, permits, and what to bring to your first consultation.",
    type: "website",
  },
};

export default async function FaqPage() {
  const content = await getSiteContent();
  const { faq } = content;

  return (
    <>
      <Header theme="light" />
      <main id="main">
        <section className="border-b border-warm-gray/60 bg-warm-white">
          <div className="mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              {faq.eyebrow}
            </p>
            <h1
              className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-charcoal sm:text-5xl"
              style={textStyle(faq.styles?.title)}
            >
              {faq.title}
            </h1>
            <p
              className="mt-5 max-w-xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg"
              style={textStyle(faq.styles?.lede)}
            >
              {faq.lede}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/inquire"
                className="inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut"
              >
                Ask us directly
              </Link>
              <Link
                href="/estimate"
                className="inline-flex min-h-11 cursor-pointer items-center border border-warm-gray px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-chestnut hover:text-chestnut focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut"
              >
                Cost calculator
              </Link>
            </div>
          </div>
        </section>

        <Faq data={faq} heading="none" />
      </main>
      <Footer />
    </>
  );
}
