// All site copy in one place. Sourced from
// "MGC Architecture/03 Document Files/MGCArchitecture Website Content" and BRANDING.md.

export const site = {
  name: "MGC Architecture",
  tagline: ["Design with Purpose.", "Build for Life."],
  heroLede:
    "Welcome to the portfolio of MGC Architecture, where every space is designed with purpose and built for life. Explore each project to discover the ideas, process, and thoughtful decisions behind every design.",
  contact: {
    phone: "09560753154",
    phoneHref: "tel:+639560753154",
    email: "mgcarchitectureph@gmail.com",
    facebook: {
      label: "MGC Architecture",
      handle: "@mgcarchitecture",
      href: "https://www.facebook.com/mgcarchitecture",
    },
    instagram: {
      handle: "@mgcarchitectureph",
      href: "https://www.instagram.com/mgcarchitectureph",
    },
  },
};

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Estimator", href: "/estimate" },
  { label: "About", href: "/#about" },
  { label: "Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export type ProjectImage = {
  src: string;
  alt: string;
  /** renders are photoreal views; diagrams/drawings go to the process section */
  kind: "render" | "diagram" | "drawing";
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  status: string;
  location?: string;
  role: string;
  description: string;
  story: string;
  scope: string[];
  hero: string;
  heroAlt: string;
  images: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: "c-house",
    name: "C House",
    category: "Residential",
    year: "2025",
    status: "Design",
    location: "Meycauayan, Bulacan",
    role: "Designer under RC LLaguno Construction",
    description:
      "A modern two-storey residence transformed from an existing bungalow — planned around family life, future needs, and a warm contemporary palette.",
    story:
      "Handled under RC LLaguno Construction, this project followed the design team from the first client meetings through schematic design, drawing development, and building-permit assistance. The proposal transforms an existing bungalow into a modern two-storey residence shaped around the family's changing lifestyle: space for two vehicles, dedicated bedrooms, a home office, and a ground-floor bedroom for an elderly family member. The client's preferred palette of green, grey, brown, and mustard guides a warm contemporary home that feels open without giving up privacy.",
    scope: ["Architectural Design", "Interior Design", "3D Visualization", "Permit Assistance"],
    hero: "/portfolio/c-house/c-house-01-exterior-view-1.png",
    heroAlt:
      "C House — two-storey residence exterior with gabled roof, timber slats, and perimeter fence",
    images: [
      {
        src: "/portfolio/c-house/c-house-01-exterior-view-1.png",
        alt: "C House — main exterior view with gabled roof and timber slats",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-exterior-view-2.png",
        alt: "C House — exterior view from the street corner",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-exterior-view-3.png",
        alt: "C House — exterior view showing the entry and garden buffer",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-living-area-view-1.png",
        alt: "C House — living area with warm timber accents",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-living-area-view-2.png",
        alt: "C House — living area toward the dining space",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-living-area-view-3.png",
        alt: "C House — living area detail with natural light",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-dining-area-view-1.png",
        alt: "C House — dining area connecting living and kitchen",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-kitchen-area-view-1.png",
        alt: "C House — kitchen area with island counter",
        kind: "render",
      },
      {
        src: "/portfolio/c-house/c-house-02-kitchen-area-view-2.png",
        alt: "C House — kitchen area detail",
        kind: "render",
      },
    ],
  },
  {
    slug: "tile-co",
    name: "Tile Co. Office & Showroom",
    category: "Commercial",
    year: "2025",
    status: "Design",
    location: "San Juan City",
    role: "Designer under RC LLaguno Construction",
    description:
      "A larger office with dedicated tile storage and a minimalist showroom — planned so customers can browse products in a clear, welcoming setting.",
    story:
      "Managed under RC LLaguno Construction, this commercial project followed the design team from the first consultation through design development, plan preparation, and permit documentation. The proposal supports the client's expansion by relocating operations into a larger office with dedicated storage for tile inventory. A minimalist showroom is integrated so customers can comfortably browse selections — the product is staged in real settings rather than racks alone.",
    scope: ["Commercial Design", "Space Planning", "3D Visualization", "Permit Assistance"],
    hero: "/portfolio/tile-co/tile-co-interior-view-1.png",
    heroAlt: "Tile Co. office and showroom interior with tile displays",
    images: [
      {
        src: "/portfolio/tile-co/tile-co-interior-view-1.png",
        alt: "Tile Co. — showroom entry with staged tile settings",
        kind: "render",
      },
      {
        src: "/portfolio/tile-co/tile-co-interior-view-2.png",
        alt: "Tile Co. — display wall with tile collections",
        kind: "render",
      },
      {
        src: "/portfolio/tile-co/tile-co-interior-view-3.png",
        alt: "Tile Co. — office area sharing showroom finishes",
        kind: "render",
      },
      {
        src: "/portfolio/tile-co/tile-co-interior-view-4.png",
        alt: "Tile Co. — consultation area with sample surfaces",
        kind: "render",
      },
      {
        src: "/portfolio/tile-co/tile-co-interior-view-5.png",
        alt: "Tile Co. — showroom perspective toward the work area",
        kind: "render",
      },
    ],
  },
  {
    slug: "the-noir",
    name: "The Noir",
    category: "Residential",
    year: "2024",
    status: "Academic Works",
    role: "Independent Designer",
    description:
      "A conceptual residential interior exploring modern luxury through darker tones, rich textures, and carefully selected materials.",
    story:
      "The Noir is a conceptual residential interior project that explores a refined interpretation of modern luxury through a bedroom and living area. Darker tones, rich textures, and carefully selected materials create a space that feels elegant without being overwhelming. Every design decision balances bold aesthetics with comfort and everyday functionality — timeless interiors that stay sophisticated, simple, and inviting.",
    scope: ["Residential Interior Design", "Furniture Selection", "Lighting Design", "3D Visualization"],
    hero: "/portfolio/the-noir/the-noir-living-view-1.png",
    heroAlt:
      "The Noir — living room with marble feature wall, wood shelving, and warm rust textiles",
    images: [
      {
        src: "/portfolio/the-noir/the-noir-living-view-1.png",
        alt: "The Noir — living room with marble feature wall and rust textiles",
        kind: "render",
      },
      {
        src: "/portfolio/the-noir/the-noir-living-view-2.png",
        alt: "The Noir — living room toward the backlit shelving",
        kind: "render",
      },
      {
        src: "/portfolio/the-noir/the-noir-living-view-3.png",
        alt: "The Noir — reading corner with sculptural chair and artwork",
        kind: "render",
      },
      {
        src: "/portfolio/the-noir/the-noir-living-view-4.png",
        alt: "The Noir — living room detail in stone and walnut",
        kind: "render",
      },
      {
        src: "/portfolio/the-noir/the-noir-living-view-5.png",
        alt: "The Noir — living room perspective under warm evening light",
        kind: "render",
      },
      {
        src: "/portfolio/the-noir/the-noir-bedroom-view-1.png",
        alt: "The Noir — bedroom in dark layered tones",
        kind: "render",
      },
      {
        src: "/portfolio/the-noir/the-noir-bedroom-view-2.png",
        alt: "The Noir — bedroom detail with warm accent lighting",
        kind: "render",
      },
    ],
  },
  {
    slug: "the-hearth",
    name: "The Hearth",
    category: "Residential",
    year: "2024",
    status: "Academic Works",
    role: "Independent Designer",
    description:
      "A conceptual kitchen and dining study — bright, open, and welcoming, with generous storage kept clean and uncluttered.",
    story:
      "The Hearth is a conceptual study focused on a minimalist kitchen and dining space that feels bright, open, and welcoming. The layout prioritizes functionality with generous storage while keeping a clean, uncluttered appearance. Natural light and a simple material palette create an airy atmosphere for everyday family living — practical spaces that still feel spacious and comfortable.",
    scope: ["Residential Interior Design", "Kitchen Design", "Cabinetry Design", "3D Visualization"],
    hero: "/portfolio/the-hearth/the-hearth-kitchen-view-1.png",
    heroAlt:
      "The Hearth — kitchen with timber island, pendant lights, and white brick backsplash",
    images: [
      {
        src: "/portfolio/the-hearth/the-hearth-kitchen-view-1.png",
        alt: "The Hearth — kitchen with timber island and pendant lights",
        kind: "render",
      },
      {
        src: "/portfolio/the-hearth/the-hearth-kitchen-view-2.png",
        alt: "The Hearth — kitchen work surface and open shelving",
        kind: "render",
      },
      {
        src: "/portfolio/the-hearth/the-hearth-kitchen-view-3.png",
        alt: "The Hearth — kitchen detail with white brick backsplash",
        kind: "render",
      },
      {
        src: "/portfolio/the-hearth/the-hearth-dining-view-1.png",
        alt: "The Hearth — dining room with backlit shelving and rattan cabinetry",
        kind: "render",
      },
      {
        src: "/portfolio/the-hearth/the-hearth-dining-view-2.png",
        alt: "The Hearth — dining table under the sculptural pendant",
        kind: "render",
      },
      {
        src: "/portfolio/the-hearth/the-hearth-dining-view-3.png",
        alt: "The Hearth — dining room perspective toward the kitchen",
        kind: "render",
      },
    ],
  },
  {
    slug: "guest-quarter",
    name: "Guest Quarter",
    category: "Residential",
    year: "2026",
    status: "Design",
    location: "Sampaloc, Manila",
    role: "Designer under RC LLaguno Construction",
    description:
      "A mid-century-inspired guest floor — bedroom, workspace, coffee nook, and storage planned as a self-contained stay.",
    story:
      "Undertaken under RC LLaguno Construction, the designer was responsible for the guest floor. Inspired by mid-century interiors, the layout is a self-contained living space with a bedroom, workspace, coffee nook, built-in shelving, and generous wardrobe storage — a warm, functional environment for extended stays with both comfort and privacy.",
    scope: ["Residential Interior Design", "Built-In Cabinetry", "3D Visualization"],
    hero: "/portfolio/guest-quarter/guest-quarter-view-1.png",
    heroAlt: "Guest Quarter — compact guest bedroom interior",
    images: [
      {
        src: "/portfolio/guest-quarter/guest-quarter-view-1.png",
        alt: "Guest Quarter — guest bedroom with integrated storage",
        kind: "render",
      },
      {
        src: "/portfolio/guest-quarter/guest-quarter-view-2.png",
        alt: "Guest Quarter — desk and vanity nook",
        kind: "render",
      },
      {
        src: "/portfolio/guest-quarter/guest-quarter-view-3.png",
        alt: "Guest Quarter — wardrobe cabinetry fitted to the room width",
        kind: "render",
      },
      {
        src: "/portfolio/guest-quarter/guest-quarter-view-4.png",
        alt: "Guest Quarter — bedroom perspective toward the window",
        kind: "render",
      },
    ],
  },
  {
    slug: "capstone",
    name: "Architectural Capstone",
    category: "Institutional",
    year: "2025",
    status: "Academic Works",
    role: "Independent Designer — Collaboration",
    description:
      "Longos Central Elementary School reimagined — comfortable, functional classrooms and shared spaces ready for future generations.",
    story:
      "Longos Central Elementary School was reimagined as a learning environment that better supports students and teachers. The existing campus revealed overcrowded classrooms, poor ventilation, excessive heat, limited daylight, and aging facilities — challenges that became the foundation for a design that puts comfort, well-being, and learning first. Guided by Needs, Design, and Comfort, spaces are flexible, inclusive, and easy to navigate, with stronger connections between buildings, more green space, and vernacular-inspired identity. Thermal comfort was a priority: solar analysis shaped sun-shading density by orientation to cut heat and glare while admitting daylight. Materials balance durability and maintenance — reinforced concrete, fired clay brick, insulated G.I. roofing, acoustic ceilings, vinyl flooring, and fiberglass skylights.",
    scope: ["Institutional Design", "Climate-Responsive Design", "Design Research", "3D Visualization"],
    hero: "/portfolio/capstone/archi-capstone-exterior-view-1.png",
    heroAlt:
      "Architectural Capstone — two-storey institutional building with brick facade and timber canopy",
    images: [
      {
        src: "/portfolio/capstone/archi-capstone-exterior-view-1.png",
        alt: "Architectural Capstone — main exterior with brick facade and timber canopy",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-exterior-view-2.png",
        alt: "Architectural Capstone — approach view along the shaded walkway",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-exterior-view-3.png",
        alt: "Architectural Capstone — courtyard elevation with screened verandas",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-exterior-view-4.png",
        alt: "Architectural Capstone — exterior view showing brick mass and shading",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-exterior-view-5.png",
        alt: "Architectural Capstone — perspective across the landscaped grounds",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-exterior-view-6.png",
        alt: "Architectural Capstone — evening exterior view",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-interior-view-.png",
        alt: "Architectural Capstone — interior learning space with natural ventilation",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-interior-view-1.png",
        alt: "Architectural Capstone — interior common area",
        kind: "render",
      },
      {
        src: "/portfolio/capstone/archi-capstone-design-problem.png",
        alt: "Architectural Capstone — design problem diagram",
        kind: "diagram",
      },
      {
        src: "/portfolio/capstone/archi-capstone-design-approach.png",
        alt: "Architectural Capstone — design approach diagram",
        kind: "diagram",
      },
      {
        src: "/portfolio/capstone/archi-capstone-design-strategy-1.png",
        alt: "Architectural Capstone — design strategy diagram, part one",
        kind: "diagram",
      },
      {
        src: "/portfolio/capstone/archi-capstone-design-strategy-2.png",
        alt: "Architectural Capstone — design strategy diagram, part two",
        kind: "diagram",
      },
      {
        src: "/portfolio/capstone/archi-capstone-floor-plan.png",
        alt: "Architectural Capstone — floor plan",
        kind: "diagram",
      },
      {
        src: "/portfolio/capstone/archi-capstone-axonometric-view-1.png",
        alt: "Architectural Capstone — axonometric view",
        kind: "diagram",
      },
      {
        src: "/portfolio/capstone/archi-capstone-interior-axonometric-view-2.png",
        alt: "Architectural Capstone — interior axonometric view",
        kind: "diagram",
      },
    ],
  },
  {
    slug: "saro",
    name: "Saro",
    category: "Institutional",
    year: "2023",
    status: "Academic Works",
    role: "Independent Designer",
    description:
      "A pavilion inspired by the traditional Tausug salakot — shade, shelter, and Filipino identity in contemporary form.",
    story:
      "Saro is a conceptual pavilion inspired by the traditional Tausug salakot, celebrating both its practical purpose and its cultural significance in Filipino heritage. The design reinterprets the familiar form into a contemporary structure that offers shade, shelter, and a welcoming gathering space — a tribute to Filipino identity that blends traditional inspiration with modern design thinking.",
    scope: ["Concept Design", "Pavilion Design", "3D Visualization"],
    hero: "/portfolio/saro/saro-view-1.png",
    heroAlt: "Saro — pavilion concept perspective view",
    images: [
      {
        src: "/portfolio/saro/saro-view-1.png",
        alt: "Saro — pavilion perspective framing the landscape",
        kind: "render",
      },
      {
        src: "/portfolio/saro/saro-view-2.png",
        alt: "Saro — pavilion view from the gathering space",
        kind: "render",
      },
      {
        src: "/portfolio/saro/saro-view-3.png",
        alt: "Saro — pavilion structure detail",
        kind: "render",
      },
      {
        src: "/portfolio/saro/saro-view-4.png",
        alt: "Saro — pavilion at dusk",
        kind: "render",
      },
      {
        src: "/portfolio/saro/saro-illustration-1.png",
        alt: "Saro — concept illustration",
        kind: "diagram",
      },
      {
        src: "/portfolio/saro/sasro-diagram-1.png",
        alt: "Saro — form development diagram",
        kind: "diagram",
      },
    ],
  },
  {
    slug: "built-in",
    name: "Built-In Furnitures",
    category: "Cabinetry & Furniture",
    year: "2025",
    status: "Complete Fit-Out",
    role: "Designer under RC LLaguno Construction",
    description:
      "Custom closets, kitchen cabinets, display shelves, and storage — designed, detailed, sourced, and coordinated through installation.",
    story:
      "Completed under RC LLaguno Construction, these custom built-in furniture projects followed design development, detailed shop drawings, material sourcing, and fabrication coordination through installation. Closets, kitchen cabinets, display shelves, feature walls, and tailored storage were drawn to each client's needs. Close collaboration with fabricators kept every piece accurate while staying functional and visually cohesive.",
    scope: ["Cabinetry Design", "Technical Drawings", "Fabrication Coordination", "3D Visualization"],
    hero: "/portfolio/built-in/built-in-proj-01-view.png",
    heroAlt: "Built-in furniture project — custom cabinetry render",
    images: [
      {
        src: "/portfolio/built-in/built-in-proj-01-view.png",
        alt: "Built-in project one — cabinetry render",
        kind: "render",
      },
      {
        src: "/portfolio/built-in/built-in-proj-01-drawing.png",
        alt: "Built-in project one — technical drawing with dimensions",
        kind: "drawing",
      },
      {
        src: "/portfolio/built-in/built-in-proj-02-view.png",
        alt: "Built-in project two — cabinetry render",
        kind: "render",
      },
      {
        src: "/portfolio/built-in/built-in-proj-02-drawing.png",
        alt: "Built-in project two — technical drawing with dimensions",
        kind: "drawing",
      },
      {
        src: "/portfolio/built-in/built-in-proj-03-view.png",
        alt: "Built-in project three — cabinetry render",
        kind: "render",
      },
      {
        src: "/portfolio/built-in/built-in-proj-03-plan.png",
        alt: "Built-in project three — plan drawing",
        kind: "drawing",
      },
    ],
  },
];

export type Service = {
  title: string;
  scope: string[];
  blurb: string;
};

export const services: Service[] = [
  {
    title: "Architectural Design",
    blurb: "New builds designed around how you live and work.",
    scope: [
      "Residential Design",
      "Commercial Design",
      "House & Condominium Interior Design",
      "Commercial Interior Design",
    ],
  },
  {
    title: "Renovation & Remodeling",
    blurb: "Reworking existing spaces so they fit your life today.",
    scope: [
      "Home Renovations",
      "Commercial Space Renovations",
      "Kitchen / Bathroom / Room Makeovers",
    ],
  },
  {
    title: "Cabinetry & Built-In Furniture",
    blurb: "Storage and furniture drawn to fit your space exactly.",
    scope: [
      "Kitchen Cabinets",
      "Wardrobe Cabinets",
      "Display Cabinets & Shelves",
      "Storage Solutions",
    ],
  },
  {
    title: "Design Documentation & Permit Assistance",
    blurb: "Complete drawings and support for building permit applications.",
    scope: [
      "Complete drawings & documents for permits",
      "Permit application assistance",
      "Updates to existing drawings",
    ],
  },
  {
    title: "Cost Estimation & Budget Planning",
    blurb: "A realistic picture of cost before you commit to building.",
    scope: [
      "Residential & commercial estimates",
      "Finish-level cost guides",
      "Budget planning before design",
    ],
  },
  {
    title: "3D Visualization",
    blurb: "See your space before construction begins.",
    scope: [
      "Exterior 3D views",
      "Interior 3D views",
      "3D walkthrough videos",
    ],
  },
];

export const professionalNotice =
  "MGC Architecture showcases architectural and interior design work and welcomes project inquiries. For projects requiring a Registered and Licensed Architect's signature and seal, we work in collaboration with a licensed Architect.";

export const about = {
  intro:
    "Hi, I'm Mariane Gayle Caballero, an Architectural Designer passionate about creating thoughtful, functional, and timeless spaces. I believe good architecture goes beyond aesthetics — it begins with understanding people, solving real problems, and designing environments that improve the way we live, work, and connect.",
  body: [
    "I graduated Magna Cum Laude with a Bachelor of Science in Architecture from Pamantasan ng Lungsod ng Maynila in 2025, earning recognition as a College Academic Excellence Awardee and maintaining Dean's List honors throughout college.",
    "My experience spans architectural design, construction documentation, 3D visualization, and site coordination. Working closely with both design and construction teams has given me firsthand insight into how drawings translate into the built environment — designs that are thoughtful, practical, buildable, and clearly communicated.",
    "Outside of architecture, I run a small flower business and work as a freelance graphic designer and digital marketer — experiences that keep shaping how I think about creativity, communication, and thoughtful problem-solving in every project.",
  ],
  education: {
    degree: "Bachelor of Science in Architecture",
    school: "Pamantasan ng Lungsod ng Maynila (2020–2025)",
    honors: "Graduated Magna Cum Laude (2025)",
  },
  awards: [
    "Magna Cum Laude, BS Architecture (2025)",
    "Top 1 — College Academic Excellence Awardee (2024)",
    "Dean's Lister (2020–2025)",
    "Best UAPSA National Architecture Week Award — Creatives Head (2024)",
    "Best World Architecture Day Celebration Award — Event Head (2022)",
  ],
  skills: [
    "Architectural Design & Planning",
    "Construction Documentation",
    "CAD Drafting",
    "3D Modeling & Visualization",
    "Graphic Design",
    "Branding & Visual Communication",
  ],
  software: ["AutoCAD", "SketchUp", "Revit", "Enscape", "Adobe Photoshop", "MS Office"],
};

export const process = {
  title: "From Idea to Reality",
  intro:
    "Every project starts with a conversation. A clear process leads to better decisions, fewer surprises, and spaces that are thoughtfully designed from start to finish.",
  steps: [
    {
      title: "Conversation",
      body: "We take the time to understand your goals, ideas, budget, and vision before developing a design that suits your needs.",
    },
    {
      title: "Design & Documents",
      body: "Once the direction is finalized, the design is refined and the necessary drawings and documents are prepared — with you involved in key decisions throughout.",
    },
    {
      title: "Permits & Construction",
      body: "The project moves toward permits and construction, guided by clear communication and practical solutions at every step.",
    },
  ],
};

export const insights = {
  eyebrow: "Before You Build",
  title: "Read this before you break ground",
  teamMatters: {
    title: "Why the right team matters",
    body: [
      "Building or renovating a space is one of the biggest investments you'll make, so having the right professionals by your side makes all the difference. An Architect plans and designs your space based on your needs, lifestyle, budget, and local building regulations. An Engineer ensures the structure and building systems are safe and reliable. A Contractor brings the plans to life by managing construction on site.",
      "Working with the right team from the very beginning helps prevent costly mistakes, reduces unnecessary delays, and gives you confidence that your project is built on a strong foundation.",
    ],
  },
  mistakes: {
    title: "5 mistakes to avoid before you build",
    items: [
      {
        title: "Starting without a clear plan",
        body: "Jumping into construction too soon often leads to design changes, delays, and unexpected expenses.",
      },
      {
        title: "Underestimating your budget",
        body: "Set a realistic budget early so design decisions and material selections align with what you're comfortable investing.",
      },
      {
        title: "Skipping the planning stage",
        body: "Taking time to plan your spaces, lifestyle needs, and future goals helps create a home that works for years to come.",
      },
      {
        title: "Incomplete property documents",
        body: "Preparing important documents ahead of time helps avoid delays during the design and permit process.",
      },
      {
        title: "Hiring the wrong professionals",
        body: "Choosing qualified professionals from the start ensures your project is properly planned, coordinated, and executed.",
      },
    ],
  },
};

export const faqs = [
  {
    q: "How much does a project cost?",
    a: "Construction costs vary depending on the project's size, location, structural requirements, and level of finishes. As a general guide: Standard finish is approximately ₱30,000–₱35,000/sqm, Premium finish ₱35,000–₱45,000/sqm, and Luxury finish ₱45,000+/sqm.",
  },
  {
    q: "What is the typical project timeline?",
    a: "Every project is unique, but a typical timeline is: design phase around 2–3 months, permit processing around 1–2 months (depending on the LGU and document requirements), and construction around 6–12 months for most residential projects, depending on size, complexity, weather conditions, and site progress.",
  },
  {
    q: "Do I need to own a property before starting?",
    a: "Not necessarily. If you're still looking for a property, we can discuss your ideas, space requirements, and budget to help you plan ahead. If you already own the property, having the necessary documents ready can help make the design process smoother.",
  },
  {
    q: "What documents do I need for a building permit?",
    a: "From the client or property owner: Transfer Certificate of Title (TCT) or Original Certificate of Title (OCT), latest Tax Declaration, latest Real Property Tax Receipt, Lot Plan or Survey Plan, Barangay Clearance, and HOA Clearance or Certificate if applicable. Other documents — plans, specifications, and cost estimates — are prepared by the project professionals. Additional requirements may vary depending on your project and LGU.",
  },
  {
    q: "Do you charge for the initial consultation?",
    a: "The initial meeting or consultation is complimentary. If your project requires an on-site visit or a more detailed preliminary assessment, a consultation fee may apply.",
  },
  {
    q: "What should I prepare before our first meeting?",
    a: "If available, it's helpful to prepare property details, an estimated budget, and design preferences or inspiration. Don't worry if you don't have everything yet — these details can also be discussed during our consultation.",
  },
];
