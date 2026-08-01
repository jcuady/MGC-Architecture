import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/Reveal";
import { getPublishedPosts } from "@/lib/blog-server";
import { site } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Before You Build Insights",
  description:
    "Short education articles on planning, budgeting, and building with the right team — from MGC Architecture in Manila.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Before You Build Insights | MGC Architecture",
    description:
      "Read before you build: team, mistakes to avoid, process, and budget tips.",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header theme="light" />
      <main id="main">
        <section className="border-b border-warm-gray/60 bg-beige">
          <div className="mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
              Blog
            </p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] text-charcoal sm:text-5xl">
              Before you build, read this
            </h1>
            <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-charcoal/70 sm:text-lg">
              Short guides on planning, budgeting, and working with the right
              professionals — so your project starts on solid ground.
            </p>
          </div>
        </section>

        <section className="bg-warm-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
            <ul className="grid gap-12 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
              {posts.map((post, i) => (
                <li key={post.id}>
                  <Reveal delay={i * 50}>
                    <article>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block cursor-pointer outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-chestnut"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-beige">
                          {post.cover_image ? (
                            <Image
                              src={post.cover_image}
                              alt={post.cover_alt || ""}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                              priority={i < 2}
                            />
                          ) : null}
                        </div>
                        <p className="mt-5 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                          {String(i + 1).padStart(2, "0")} · {post.read_mins} min
                          read
                        </p>
                        <h2 className="mt-2 font-heading text-2xl font-semibold leading-tight text-charcoal transition-colors group-hover:text-chestnut">
                          {post.title}
                        </h2>
                        <p className="mt-3 font-body text-base leading-relaxed text-charcoal/70">
                          {post.excerpt}
                        </p>
                        <span className="mt-4 inline-flex font-heading text-xs font-semibold uppercase tracking-[0.16em] text-chestnut underline-offset-4 group-hover:underline">
                          Read article
                        </span>
                      </Link>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-chestnut">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-warm-white sm:text-3xl">
                Ready to talk through your project?
              </h2>
              <p className="mt-2 max-w-md font-body text-warm-white/75">
                {site.name} — Design with Purpose. Build for Life.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-11 w-fit cursor-pointer items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-white"
            >
              Start a project
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
