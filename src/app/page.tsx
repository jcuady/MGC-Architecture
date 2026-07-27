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
import { getSiteContent } from "@/lib/cms-server";
import { textStyle } from "@/lib/cms";

// ISR: CMS edits appear within a minute; saving in the admin also revalidates.
export const revalidate = 60;

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <Header theme="light" />
      <main id="main">
        <Hero data={content.hero} />
        <Studio data={content.studio} />
        <Work data={content.work} />
        <Showcase
          src={content.showcaseNoir.image}
          alt="The Noir — living room with marble feature wall, timber shelving, and sculptural seating"
          eyebrow={content.showcaseNoir.eyebrow}
          lines={[content.showcaseNoir.line1, content.showcaseNoir.line2]}
          lineStyle={textStyle(content.showcaseNoir.styles?.lines)}
        />
        <Services data={content.services} />
        <EstimatorHook data={content.estimator} />
        <About data={content.about} />
        <Process data={content.process} />
        <Insights data={content.insights} />
        <Faq data={content.faq} />
        <Showcase
          src={content.showcaseHearth.image}
          alt="The Hearth — warm dining room with backlit shelving and rattan cabinetry"
          eyebrow={content.showcaseHearth.eyebrow}
          lines={[content.showcaseHearth.line1, content.showcaseHearth.line2]}
          lineStyle={textStyle(content.showcaseHearth.styles?.lines)}
          cta={{ label: content.showcaseHearth.ctaLabel, href: "#contact" }}
        />
        <Contact data={content.contact} />
      </main>
      <Footer />
    </>
  );
}
