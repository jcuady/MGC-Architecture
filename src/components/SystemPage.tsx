import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";

type SystemPageProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  /** document = FAQ-style light; brand = chestnut hero band (About/errors) */
  variant?: "document" | "brand";
  actions?: React.ReactNode;
};

/**
 * Shared shell for legal + system pages — mirrors FAQ/About composition:
 * header offset, eyebrow, display title, optional lede/CTAs, calm body column.
 */
export default function SystemPage({
  eyebrow,
  title,
  lede,
  children,
  variant = "document",
  actions,
}: SystemPageProps) {
  const brand = variant === "brand";

  return (
    <>
      <Header theme={brand ? "dark" : "light"} />
      <main id="main" className="bg-warm-white">
        {brand ? (
          <section className="bg-chestnut pt-[4.75rem]">
            <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-14 sm:pt-12">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {eyebrow}
              </p>
              <h1 className="mt-3 max-w-3xl font-heading text-3xl font-semibold leading-tight text-warm-white sm:text-4xl">
                {title}
              </h1>
              {lede ? (
                <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-warm-white/70 sm:text-lg">
                  {lede}
                </p>
              ) : null}
              {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </section>
        ) : (
          <section className="border-b border-warm-gray/60 bg-warm-white">
            <div className="mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-charcoal sm:text-5xl">
                {title}
              </h1>
              {lede ? (
                <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg">
                  {lede}
                </p>
              ) : null}
              {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </section>
        )}

        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="system-prose font-body text-base leading-relaxed text-charcoal/80">
            {children}
          </div>
          <p className="mt-14 border-t border-warm-gray/70 pt-8">
            <Link
              href="/"
              className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:text-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chestnut"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
