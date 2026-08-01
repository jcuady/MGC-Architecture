import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";

/** Shared shell for branded system / legal pages. */
export default function SystemPage({
  eyebrow,
  title,
  children,
  theme = "light",
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  theme?: "light" | "dark";
}) {
  const light = theme === "light";
  return (
    <>
      <Header theme={light ? "light" : "dark"} />
      <main id="main" className={light ? "bg-warm-white" : "bg-charcoal"}>
        <section
          className={
            light
              ? "border-b border-warm-gray/60 bg-beige"
              : "border-b border-warm-white/10 bg-charcoal"
          }
        >
          <div className="mx-auto max-w-3xl px-5 pb-12 pt-28 sm:px-8 sm:pb-14 sm:pt-32">
            <p
              className={
                light
                  ? "font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta"
                  : "font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold"
              }
            >
              {eyebrow}
            </p>
            <h1
              className={
                light
                  ? "mt-4 font-heading text-3xl font-semibold text-charcoal sm:text-4xl"
                  : "mt-4 font-heading text-3xl font-semibold text-warm-white sm:text-4xl"
              }
            >
              {title}
            </h1>
          </div>
        </section>
        <div
          className={
            light
              ? "mx-auto max-w-3xl px-5 py-12 font-body text-base leading-relaxed text-charcoal/80 sm:px-8 sm:py-16"
              : "mx-auto max-w-3xl px-5 py-12 font-body text-base leading-relaxed text-warm-white/80 sm:px-8 sm:py-16"
          }
        >
          {children}
          <p className="mt-12">
            <Link
              href="/"
              className={
                light
                  ? "font-heading text-sm font-semibold text-chestnut underline-offset-4 hover:underline"
                  : "font-heading text-sm font-semibold text-gold underline-offset-4 hover:underline"
              }
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
