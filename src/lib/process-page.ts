/**
 * Full Process page content — sourced strictly from process.md.
 * Landing teaser stays short; this module is the dedicated page.
 */

export type ProcessPhase = {
  index: string;
  title: string;
  weDo: string[];
  youDo: string[];
  receive: string[];
  time: string;
};

export type FinishLevel = {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const processPage = {
  eyebrow: "Process",
  title: "How Your Project Moves Forward",
  lede: "A simple overview of what to expect from the first planning meeting to project completion.",
  heroImage: "/portfolio/capstone/archi-capstone-design-strategy-1.png",
  phases: [
    {
      index: "01",
      title: "Pre-Design",
      weDo: [
        "Understand your project goals",
        "Visit and assess the site",
        "Discuss your needs, budget, and priorities",
        "Explore initial ideas and space planning",
      ],
      youDo: [
        "Share your vision and requirements",
        "Provide available lot documents",
        "Share inspiration or reference images",
      ],
      receive: ["Project brief", "Space requirements", "Initial design direction"],
      time: "1–2 weeks",
    },
    {
      index: "02",
      title: "Design Development",
      weDo: [
        "Develop the architectural design",
        "Refine layouts and floor plans",
        "Prepare 3D perspectives",
        "Coordinate with engineering consultants",
        "Revise the design based on your feedback",
      ],
      youDo: [
        "Review the proposed design",
        "Approve revisions",
        "Confirm materials and finishes",
      ],
      receive: [
        "Finalized design",
        "Floor plans and 3D perspectives",
        "Preliminary cost estimate",
      ],
      time: "2–6 weeks",
    },
    {
      index: "03",
      title: "Construction Drawings",
      weDo: [
        "Prepare complete construction drawings",
        "Coordinate all engineering plans",
        "Finalize technical details",
        "Prepare construction-ready documents",
      ],
      youDo: [
        "Review the final drawings",
        "Approve the plans before submission",
      ],
      receive: [
        "Complete construction drawings",
        "Engineering plans",
        "Construction-ready documents",
      ],
      time: "3–6 weeks",
    },
    {
      index: "04",
      title: "Permits & Contracts",
      weDo: [
        "Prepare permit documents",
        "Assist with permit processing",
        "Prepare the construction contract",
        "Coordinate with the required offices",
      ],
      youDo: [
        "Submit required property documents",
        "Sign necessary forms and agreements",
        "Settle applicable government fees",
      ],
      receive: [
        "Permit-ready documents",
        "Signed construction agreement",
        "Approved permits (once released)",
      ],
      time: "1–2 months",
    },
    {
      index: "05",
      title: "Construction Phase",
      weDo: [
        "Begin construction",
        "Monitor project progress",
        "Coordinate with the construction team",
        "Address site concerns",
        "Keep you updated throughout the project",
      ],
      youDo: [
        "Approve major decisions when needed",
        "Join scheduled site visits (optional)",
        "Release scheduled payments",
      ],
      receive: ["Regular progress updates", "Site reports", "Completed project"],
      time: "6–12 months (depending on the project size and complexity)",
    },
  ] satisfies ProcessPhase[],
  finishes: {
    eyebrow: "Finish Level",
    title: "Cost Estimate Calculator",
    lede: "Four finish levels shape the starting construction figure. Photos from the studio finish guide.",
    ctaLabel: "Open cost calculator",
    ctaHref: "/estimate",
    levels: [
      {
        slug: "bare",
        name: "Bare Finish",
        description:
          "A basic bare home with concrete flooring, unpainted concrete walls, minimal windows, and an exposed ceiling.",
        image: "/finishes/type-of-finish-bare.png",
        imageAlt:
          "Bare finish home — concrete flooring, unpainted walls, exposed ceiling",
      },
      {
        slug: "standard",
        name: "Standard Finish",
        description:
          "A clean and practical home with tiled flooring, painted walls, standard aluminum-framed windows, and a simple flat ceiling.",
        image: "/finishes/type-of-finish-standard.png",
        imageAlt:
          "Standard finish home — tiled floors, painted walls, aluminum windows",
      },
      {
        slug: "premium",
        name: "Premium Finish",
        description:
          "A refined home with large-format tiles or engineered wood flooring, decorative wall cladding, full-height glass windows, and detailed ceilings.",
        image: "/finishes/type-of-finish-premium.png",
        imageAlt:
          "Premium finish home — large-format flooring, wall cladding, glass windows",
      },
      {
        slug: "luxury",
        name: "Luxury Finish",
        description:
          "A premium customized home with natural stone or solid wood flooring, imported wall finishes, double-glazed windows, and custom wood or acoustic ceilings.",
        image: "/finishes/type-of-finish-luxury.png",
        imageAlt:
          "Luxury finish home — stone or wood floors, imported finishes, custom ceiling",
      },
    ] satisfies FinishLevel[],
  },
  closing: {
    title: "Ready to begin?",
    lede: "Start with a conversation — or check a starting cost figure for your lot and finish level.",
    primaryLabel: "Start a project",
    primaryHref: "/contact",
    secondaryLabel: "Cost calculator",
    secondaryHref: "/estimate",
  },
} as const;
