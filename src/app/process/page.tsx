import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import ProcessHero from "@/components/process/ProcessHero";
import ProcessPhases from "@/components/process/ProcessPhases";
import FinishLevels from "@/components/process/FinishLevels";
import Reveal from "@/components/Reveal";
import { processPage } from "@/lib/process-page";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Process — How Your Architecture Project Moves Forward",
  description: processPage.lede,
  alternates: { canonical: "/process" },
  openGraph: {
    title: "Process — How Your Project Moves Forward | MGC Architecture",
    description: processPage.lede,
    images: [processPage.heroImage],
    type: "website",
  },
};

export default function ProcessPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: processPage.title,
    description: processPage.lede,
    step: processPage.phases.map((p, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: p.title,
      text: `Estimated time: ${p.time}. ${p.weDo.join("; ")}.`,
    })),
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      email: site.contact.email,
      telephone: site.contact.phone,
    },
  };

  return (
    <>
      <Header theme="dark" />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ProcessHero />

        <div id="phases" className="scroll-mt-20">
          <ProcessPhases phases={[...processPage.phases]} />
        </div>

        <FinishLevels levels={[...processPage.finishes.levels]} />

        <section className="bg-chestnut">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <h2 className="max-w-lg font-heading text-3xl font-semibold text-warm-white sm:text-4xl">
                {processPage.closing.title}
              </h2>
              <p className="mt-4 max-w-md font-body text-base leading-relaxed text-warm-white/75">
                {processPage.closing.lede}
              </p>
            </Reveal>
            <Reveal className="flex flex-wrap gap-3">
              <Link
                href={processPage.closing.primaryHref}
                className="inline-flex min-h-11 cursor-pointer items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-white"
              >
                {processPage.closing.primaryLabel}
              </Link>
              <Link
                href={processPage.closing.secondaryHref}
                className="inline-flex min-h-11 cursor-pointer items-center border border-warm-white/40 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:border-warm-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-white"
              >
                {processPage.closing.secondaryLabel}
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
