import { site } from "@/lib/content";

/** Primary production origin (www). Apex redirects here in Vercel. */
export const SITE_URL = "https://www.mgcarchitecture.com";

export const SITE_NAME = site.name;

/** Homepage title — Brand | keyword phrase (SERP pattern). ~60 chars. */
export const DEFAULT_TITLE =
  "MGC Architecture | Architectural & Interior Design in Manila";

/** Homepage / fallback description — ~155 chars, authority + services + locale. */
export const DEFAULT_DESCRIPTION =
  "MGC Architecture delivers thoughtful architectural and interior design in Manila — residential, renovation, and 3D visualization by Mariane Gayle Caballero. Design with purpose. Build for life.";

export const DEFAULT_OG_IMAGE = "/portfolio/c-house/c-house-01-exterior-view-1.png";

export const SEO_KEYWORDS = [
  "MGC Architecture",
  "architectural designer Manila",
  "interior design Philippines",
  "residential architecture Manila",
  "home renovation design",
  "architectural visualization",
  "Mariane Gayle Caballero",
  "cost calculator architecture",
] as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

/** Organization + WebSite JSON-LD for the root layout (sitelinks / knowledge signals). */
export function organizationJsonLd() {
  const logo = absoluteUrl("/brand/monogram-chestnut.png");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: logo,
        },
        image: logo,
        description: DEFAULT_DESCRIPTION,
        email: site.contact.email,
        telephone: `+63${site.contact.phone.replace(/\D/g, "").replace(/^0/, "")}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Manila",
          addressCountry: "PH",
        },
        areaServed: {
          "@type": "Country",
          name: "Philippines",
        },
        sameAs: [site.contact.facebook.href, site.contact.instagram.href],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: site.contact.email,
          telephone: `+63${site.contact.phone.replace(/\D/g, "").replace(/^0/, "")}`,
          areaServed: "PH",
          availableLanguage: ["English", "Filipino"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-PH",
      },
    ],
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
