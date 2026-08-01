import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/JsonLd";
import { blogParagraphs, defaultBlogPosts } from "@/lib/blog";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog-server";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const slugs = new Set(posts.map((p) => p.slug));
  for (const p of defaultBlogPosts) slugs.add(p.slug);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : undefined,
      type: "article",
      publishedTime: post.published_at,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = blogParagraphs(post.body);
  const all = await getPublishedPosts();
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    image: post.cover_image ? [absoluteUrl(post.cover_image)] : undefined,
    datePublished: post.published_at,
    author: {
      "@type": "Person",
      name: "Mariane Gayle Caballero",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/monogram-chestnut.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <>
      <Header theme="light" />
      <main id="main">
        <JsonLd data={articleLd} />
        <article>
          <header className="bg-beige">
            <div className="mx-auto max-w-3xl px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
              <nav aria-label="Breadcrumb" className="font-heading text-xs text-charcoal/50">
                <Link href="/blog" className="link-draw hover:text-chestnut">
                  Blog
                </Link>
                <span aria-hidden className="mx-2">
                  /
                </span>
                <span className="text-charcoal/70">{post.title}</span>
              </nav>
              <p className="mt-8 font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
                {post.read_mins} min read
              </p>
              <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-[2.75rem]">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/70">
                  {post.excerpt}
                </p>
              ) : null}
            </div>
            {post.cover_image ? (
              <div className="relative mx-auto aspect-[21/9] max-w-7xl overflow-hidden bg-charcoal/10 sm:aspect-[2.4/1]">
                <Image
                  src={post.cover_image}
                  alt={post.cover_alt || ""}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </header>

          <div className="bg-warm-white">
            <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
              <div className="space-y-6">
                {paragraphs.map((block) => {
                  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
                  const looksLikeLead =
                    lines.length >= 2 &&
                    lines[0].length < 90 &&
                    !lines[0].endsWith(".") &&
                    !lines[0].endsWith("?");
                  if (looksLikeLead) {
                    const [lead, ...rest] = lines;
                    return (
                      <div key={block.slice(0, 48)}>
                        <h2 className="font-heading text-lg font-semibold text-charcoal sm:text-xl">
                          {lead}
                        </h2>
                        <p className="mt-2 font-body text-base leading-relaxed text-charcoal/80 sm:text-lg">
                          {rest.join(" ")}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p
                      key={block.slice(0, 48)}
                      className="font-body text-base leading-relaxed text-charcoal/80 sm:text-lg"
                    >
                      {lines.join(" ")}
                    </p>
                  );
                })}
              </div>

              <div className="mt-14 flex flex-wrap gap-3 border-t border-warm-gray/70 pt-10">
                <Link
                  href="/blog"
                  className="inline-flex min-h-11 cursor-pointer items-center border border-warm-gray px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-chestnut hover:text-chestnut"
                >
                  All articles
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 cursor-pointer items-center bg-chestnut px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-terracotta"
                >
                  Start a project
                </Link>
              </div>
            </div>
          </div>
        </article>

        {others.length > 0 ? (
          <section className="border-t border-warm-gray/60 bg-beige">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
              <h2 className="font-heading text-2xl font-semibold text-charcoal">
                More to read
              </h2>
              <ul className="mt-8 grid gap-8 sm:grid-cols-3">
                {others.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block cursor-pointer"
                    >
                      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
                        {p.read_mins} min
                      </p>
                      <h3 className="mt-2 font-heading text-lg font-semibold text-charcoal group-hover:text-chestnut">
                        {p.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
