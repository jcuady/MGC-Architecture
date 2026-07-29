/** Blog posts — public /blog + studio CRUD. Seed copy from blog.md. */

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string;
  cover_alt: string;
  read_mins: number;
  sort_order: number;
  is_published: boolean;
  published_at: string;
};

export type BlogPostCard = Pick<
  BlogPost,
  "id" | "title" | "slug" | "excerpt" | "cover_image" | "cover_alt" | "read_mins" | "published_at"
>;

export function slugifyBlog(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** Split body into paragraphs (blank-line separated). */
export function blogParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Offline / empty-DB fallback so public pages never render blank. */
export const defaultBlogPosts: BlogPost[] = [
  {
    id: "default-before-you-build",
    title: "Before You Build, Read This",
    slug: "before-you-build-read-this",
    excerpt:
      "Building or renovating is one of the biggest investments you'll make — the right Architect, Engineer, and Contractor make all the difference.",
    body: `Building or renovating a space is one of the biggest investments you'll make, so having the right professionals by your side can make all the difference. An Architect, Engineer, and Contractor each play an important role in turning your ideas into a safe, functional, and well-built space.

An Architect plans and designs your space based on your needs, lifestyle, budget, and local building regulations. An Engineer ensures the structure and building systems are safe and reliable. A Contractor brings the plans to life by managing the construction and coordinating the work on site.

Working with the right team from the very beginning helps prevent costly mistakes, reduces unnecessary delays, and gives you confidence that your project is built on a strong foundation.`,
    cover_image: "/portfolio/guest-quarter/guest-quarter-view-2.png",
    cover_alt: "Guest quarter interior — coordinated design and documentation",
    read_mins: 3,
    sort_order: 10,
    is_published: true,
    published_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "default-mistakes",
    title: "Mistakes to Avoid Before You Build",
    slug: "mistakes-to-avoid-before-you-build",
    excerpt:
      "A successful project starts long before construction begins. Avoiding these common mistakes can save you time, money, and unnecessary stress.",
    body: `A successful project starts long before construction begins. Avoiding these common mistakes can save you time, money, and unnecessary stress.

Mistake #1: Starting without a clear plan
Jumping into construction too soon often leads to design changes, delays, and unexpected expenses.

Mistake #2: Underestimating your budget
Set a realistic budget early so design decisions and material selections align with what you're comfortable investing.

Mistake #3: Skipping the planning stage
Taking time to plan your spaces, lifestyle needs, and future goals helps create a home or building that works for years to come.

Mistake #4: Incomplete property documents
Preparing important documents ahead of time can help avoid delays during the design and permit process.

Mistake #5: Hiring the wrong professionals
Choosing qualified professionals from the start helps ensure your project is properly planned, coordinated, and executed.

Good planning is one of the best investments you can make before building. The more prepared you are before construction starts, the smoother your project is likely to be.`,
    cover_image: "/portfolio/c-house/c-house-02-living-area-view-2.png",
    cover_alt: "Residential living space — planning before construction",
    read_mins: 4,
    sort_order: 20,
    is_published: true,
    published_at: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "default-idea-to-reality",
    title: "From Idea to Reality",
    slug: "from-idea-to-reality",
    excerpt:
      "Every project starts with a conversation. A clear process leads to better decisions, fewer surprises, and thoughtfully designed spaces.",
    body: `Every project starts with a conversation. We take the time to understand your goals, ideas, budget, and vision before developing a design that suits your needs.

Once the direction is finalized, the design is refined, the necessary drawings and documents are prepared, and the project moves toward permits and construction. Throughout the process, you'll be involved in key decisions to ensure the final design reflects what matters most to you.

A clear process leads to better decisions, fewer surprises, and spaces that are thoughtfully designed from start to finish.`,
    cover_image: "/portfolio/saro/saro-view-2.png",
    cover_alt: "Conceptual architecture study — early project conversation",
    read_mins: 3,
    sort_order: 30,
    is_published: true,
    published_at: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "default-budget-tips",
    title: "Budget-Saving Tips Before You Build",
    slug: "budget-saving-tips-before-you-build",
    excerpt:
      "Thoughtful planning can help you avoid unnecessary expenses — good planning means spending wisely, not always spending less.",
    body: `Building a home or commercial space is a significant investment, and thoughtful planning can help you avoid unnecessary expenses. While every project is different, these simple practices can help keep your project on track and make the most of your budget.

Finalize your design first.
Making changes after construction has started often results in additional labor, material costs, and project delays. A well-developed design helps minimize costly revisions.

Set a realistic budget.
Knowing your budget early allows design decisions and material selections to align with what you're comfortable investing, reducing the need for major adjustments later.

Plan for the future.
Consider how your needs may change over time. Designing with flexibility in mind can help reduce the need for future renovations or extensions.

Choose quality over shortcuts.
Investing in durable materials and proper workmanship can lead to lower maintenance costs and better long-term value.

Work with the right team.
Clear communication and proper coordination between everyone involved can help prevent misunderstandings, delays, and unnecessary expenses throughout the project.

Good planning doesn't always mean spending less—it means spending wisely. Making informed decisions early can help your project run more smoothly and make every peso count.`,
    cover_image: "/portfolio/the-hearth/the-hearth-dining-view-2.png",
    cover_alt: "Warm dining interior — finish level and budget",
    read_mins: 4,
    sort_order: 40,
    is_published: true,
    published_at: "2026-01-04T00:00:00.000Z",
  },
];

export function toBlogCard(post: BlogPost): BlogPostCard {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover_image: post.cover_image,
    cover_alt: post.cover_alt,
    read_mins: post.read_mins,
    published_at: post.published_at,
  };
}
