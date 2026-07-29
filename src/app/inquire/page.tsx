import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import InquireWizard from "@/components/inquire/InquireWizard";
import { getSiteContent } from "@/lib/cms-server";
import { textStyle } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Inquire — Tell Us About Your Project | MGC Architecture",
  description:
    "Share a few details about your project so we can better understand what you're planning. Takes about 2–3 minutes.",
  alternates: { canonical: "/inquire" },
  openGraph: {
    title: "Tell Us About Your Project — MGC Architecture",
    description:
      "Step-by-step project inquiry for architectural and interior design work.",
    type: "website",
  },
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function InquirePage({ searchParams }: Props) {
  const params = await searchParams;
  const content = await getSiteContent();
  const inquire = content.inquire;
  const services = content.services.items.map((s) => ({
    title: s.title,
    scope: s.scope,
  }));
  const initialCategory =
    typeof params.category === "string" &&
    services.some((s) => s.title === params.category)
      ? params.category
      : "";

  return (
    <>
      <Header theme="light" />
      <main id="main">
        <section className="relative overflow-hidden border-b border-warm-gray/60 bg-beige">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(166,84,54,0.08),transparent_55%),linear-gradient(180deg,var(--color-beige),color-mix(in_oklab,var(--color-warm-white)_40%,var(--color-beige)))]"
          />
          <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              {inquire.eyebrow}
            </p>
            <h1
              className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-[2.75rem]"
              style={textStyle(inquire.styles?.title)}
            >
              {inquire.title}
            </h1>
            <p
              className="mt-5 max-w-xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg"
              style={textStyle(inquire.styles?.lede)}
            >
              {inquire.lede}
            </p>
          </div>
        </section>

        <section className="bg-warm-white">
          <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
            <InquireWizard
              content={inquire}
              services={services}
              initialCategory={initialCategory}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
