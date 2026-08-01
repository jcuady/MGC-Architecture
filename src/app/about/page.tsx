import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import About from "@/components/sections/About";
import { getSiteContent } from "@/lib/cms-server";

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

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <Header theme="dark" />
      <main id="main">
        <div className="bg-chestnut pt-[4.75rem]">
          <div className="mx-auto max-w-7xl px-5 pb-4 pt-10 sm:px-8 sm:pt-12">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              About
            </p>
            <h1 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-tight text-warm-white sm:text-4xl">
              Design with purpose. Build for life.
            </h1>
            <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-warm-white/70">
              Get to know the designer behind MGC Architecture — education,
              experience, and the approach behind every project.
            </p>
            <Link
              href="/inquire"
              className="mt-8 inline-flex min-h-11 cursor-pointer items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Start a project
            </Link>
          </div>
        </div>
        <About data={content.about} />
      </main>
      <Footer />
    </>
  );
}
