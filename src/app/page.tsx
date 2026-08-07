import Header from "@/components/Header";
import Showcase from "@/components/Showcase";
import Hero from "@/components/sections/Hero";
import Studio from "@/components/sections/Studio";
import Work from "@/components/sections/Work";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Insights from "@/components/sections/Insights";
import Faq from "@/components/sections/Faq";
import EstimatorHook from "@/components/sections/EstimatorHook";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

import { getPublishedPostCards } from "@/lib/blog-server";
import { getSiteContent } from "@/lib/cms-server";
import { textStyle } from "@/lib/cms";

export const revalidate = 60;

/**
 * Section order follows the architect header sequence:
 * Works -> Process -> Inquire (services + contact CTA) -> Cost Calculator ->
 * FAQ -> About -> Blog -> Contact.
 */
export default async function Home() {
  const [content, posts] = await Promise.all([getSiteContent(), getPublishedPostCards()]);
  const articles = {
    eyebrow: "Latest Articles",
    title: "Stay up to date with our latest news.",
    seeAllLabel: "See all articles",
    seeAllHref: "/blog",
    items: posts.slice(0, 6).map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      readMins: p.read_mins,
      image: p.cover_image,
      imageAlt: p.cover_alt,
      href: `/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <Header />
      <main id="main">
        <Hero data={content.hero} />
        <Studio data={content.studio} />
        <Work data={content.work} />
        <Showcase
          src={content.showcaseNoir.image}
          alt="The Noir — bedroom with dark wood headboard, warm accent lighting, and marble floors"
          eyebrow={content.showcaseNoir.eyebrow}
          lines={[content.showcaseNoir.line1, content.showcaseNoir.line2]}
          lineStyle={textStyle(content.showcaseNoir.styles?.lines)}
        />
        <Process data={content.process} />
        <Services data={content.services} />
        <EstimatorHook data={content.estimator} />
        <Faq data={content.faq} />
        <About data={content.about} />
        <Insights data={content.insights} articles={articles} />
        <Showcase
          src={content.showcaseHearth.image}
          alt="The Hearth - warm dining room with backlit shelving and rattan cabinetry"
          eyebrow={content.showcaseHearth.eyebrow}
          lines={[content.showcaseHearth.line1, content.showcaseHearth.line2]}
          lineStyle={textStyle(content.showcaseHearth.styles?.lines)}
          cta={{ label: content.showcaseHearth.ctaLabel, href: "/inquire" }}
        />
        <Contact data={content.contact} />
      </main>
      <Footer />
    </>
  );
}


