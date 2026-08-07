import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/Reveal";
import EstimatorFlow from "@/components/estimate/EstimatorFlow";
import FinishLevels from "@/components/process/FinishLevels";
import { getActiveFinishRates } from "@/lib/calculator-server";
import { site } from "@/lib/content";
import { processPage } from "@/lib/process-page";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Construction Cost Estimator for Homes in the Philippines",
  description:
    "Estimate the cost of building your home in the Philippines. Answer three quick questions — lot size, floors, and finish level — and get a realistic starting figure, free.",
  keywords: [
    "construction cost estimator",
    "house construction cost Philippines",
    "cost per sqm Philippines",
    "residential construction estimate",
    "architecture cost guide",
  ],
  alternates: { canonical: "/estimate" },
  openGraph: {
    title: "Construction Cost Estimator | MGC Architecture",
    description:
      "A free residential construction cost estimate in under a minute, from the studio's own rate guide.",
    images: ["/portfolio/capstone/archi-capstone-exterior-view-1.png"],
    type: "website",
  },
};

const assurances = [
  {
    title: "Residential builds only",
    body: "The guide covers homes — for commercial or fit-out projects, talk to us directly for a tailored estimate.",
  },
  {
    title: "The studio's own rates",
    body: "Figures come from the same finish-level rate guide we use when planning client budgets.",
  },
  {
    title: "Refined in consultation",
    body: "Your first consultation is free — we adjust the estimate around your lot, lifestyle, and material choices.",
  },
];

export default async function EstimatePage() {
  const finishes = await getActiveFinishRates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Construction Cost Estimator",
    description:
      "Free residential construction cost estimator for the Philippines by MGC Architecture.",
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      email: site.contact.email,
      telephone: site.contact.phone,
      areaServed: "Philippines",
    },
  };

  return (
    <>
      <Header />
      <main id="main">
        {/* Formal intro — dark band keeps the fixed header legible */}
        <section className="relative overflow-hidden bg-charcoal">
          <div aria-hidden className="absolute inset-0">
            <Image
              src="/portfolio/capstone/archi-capstone-exterior-view-2.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal" />
          </div>
          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-[calc(var(--header-offset)+2.5rem)] sm:px-8 sm:pb-20 sm:pt-[calc(var(--header-offset)+3.5rem)]">
            <nav aria-label="Breadcrumb" className="font-heading text-xs text-warm-white/60">
              <Link href="/" className="link-draw">
                Home
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span className="text-warm-white/85">Cost estimator</span>
            </nav>
            <p className="mt-8 flex items-center gap-4 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold">
              <span aria-hidden className="h-px w-10 bg-gold/90" />
              Cost Guide
            </p>
            <h1 className="mt-6 max-w-3xl text-balance font-heading text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-warm-white">
              Construction Cost Estimator
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-warm-white/85">
              Three questions, one realistic starting figure. Built on the
              studio&apos;s own finish-level rates for residential projects in the
              Philippines.
            </p>
          </div>
        </section>

        {/* The guided flow */}
        <section className="bg-warm-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <EstimatorFlow finishes={finishes} />
          </div>
        </section>

        <FinishLevels levels={[...processPage.finishes.levels]} showCta={false} />

        {/* Trust strip */}
        <section className="border-t border-warm-gray/60 bg-beige">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="grid gap-8 sm:grid-cols-3">
              {assurances.map((item, i) => (
                <Reveal key={item.title} delay={i * 90}>
                  <div className="border-t-2 border-gold pt-5">
                    <h2 className="font-heading text-base font-semibold text-charcoal">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
