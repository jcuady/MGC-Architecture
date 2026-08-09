import Image from "next/image";
import Link from "next/link";
import type { BlogPostCard } from "@/lib/blog";

export type LatestArticlesData = {
  eyebrow: string;
  title: string;
  seeAllLabel: string;
  seeAllHref: string;
  items: Array<{
    title: string;
    excerpt?: string;
    readMins: number;
    image: string;
    imageAlt: string;
    href: string;
  }>;
};

export function buildLatestArticlesData(posts: BlogPostCard[]): LatestArticlesData {
  return {
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
}

/**
 * Latest Articles — responsive CSS grid (1 / 2 / 4 cols).
 * Normal document flow: heading above cards; uniform image aspect-ratio.
 */
export default function LatestArticles({ data }: { data: LatestArticlesData }) {
  return (
    <section
      id="blog"
      aria-label="Latest articles"
      className="scroll-mt-20 bg-charcoal text-warm-white"
      data-articles-grid
    >
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(196,149,106,0.1),transparent_50%)]"
        />

        <header className="relative z-10">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {data.eyebrow}
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 sm:mt-4">
            <h2 className="max-w-2xl text-balance font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] tracking-tight">
              {data.title}
            </h2>
            <Link
              href={data.seeAllHref}
              className="hidden min-h-11 shrink-0 cursor-pointer items-center font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 transition-colors duration-200 hover:text-warm-white hover:underline sm:inline-flex"
            >
              {data.seeAllLabel}
            </Link>
          </div>
        </header>

        <ul className="relative z-0 mt-10 grid grid-cols-1 items-start gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:mt-14 lg:grid-cols-4 lg:gap-x-7">
          {data.items.map((item, i) => (
            <li key={item.href + item.title} data-article-card className="min-w-0">
              <Link
                href={item.href}
                className="group flex h-full cursor-pointer flex-col outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal/80">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 92vw"
                    className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.035]"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-warm-white/75">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-warm-white transition-colors duration-200 group-hover:text-gold sm:text-lg">
                  {item.title}
                </h3>
                {item.excerpt ? (
                  <p className="mt-2 line-clamp-2 font-body text-sm leading-relaxed text-warm-white/55">
                    {item.excerpt}
                  </p>
                ) : null}
                <p className="mt-1.5 font-heading text-xs tracking-wide text-warm-white/45">
                  Read · {item.readMins} min
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-10 sm:hidden">
          <Link
            href={data.seeAllHref}
            className="inline-flex min-h-11 cursor-pointer items-center font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
          >
            {data.seeAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
