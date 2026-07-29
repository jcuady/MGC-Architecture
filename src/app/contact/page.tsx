import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import Contact from "@/components/sections/Contact";
import { getSiteContent } from "@/lib/cms-server";
import { textStyle } from "@/lib/cms";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact — Planning a Project? | MGC Architecture",
  description:
    "Tell us whether you're building, renovating, or need help with permits and costing. Free initial discussion call.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — MGC Architecture",
    description:
      "Email, call, or book a free discussion about your architectural or interior project.",
    type: "website",
  },
};

export default async function ContactPage() {
  const content = await getSiteContent();
  const { contact } = content;

  return (
    <>
      <Header theme="light" />
      <main id="main">
        <section className="border-b border-warm-gray/60 bg-beige">
          <div className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              {contact.eyebrow}
            </p>
            <h1
              className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-charcoal sm:text-5xl"
              style={textStyle(contact.styles?.title)}
            >
              {contact.title}
            </h1>
            <p
              className="mt-5 max-w-xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg"
              style={textStyle(contact.styles?.lede)}
            >
              {contact.lede}
            </p>
          </div>
        </section>

        <Contact data={contact} heading="none" />
      </main>
      <Footer />
    </>
  );
}
