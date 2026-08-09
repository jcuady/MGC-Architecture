import Link from "next/link";
import type { SiteContent } from "@/lib/cms";

type AboutData = SiteContent["about"];

/**
 * Credentials band on /about — education, experience, awards, skills.
 * Matches the studio credentials mock (two columns on chestnut).
 */
export default function AboutCredentials({ data }: { data: AboutData }) {
  const tags = [...data.skills, ...data.software];

  return (
    <section
      id="credentials"
      aria-labelledby="credentials-title"
      data-about-credentials
      className="relative overflow-hidden border-t border-warm-white/15 bg-chestnut"
    >
      <p
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[clamp(8rem,28vw,18rem)] font-semibold leading-none tracking-tight text-warm-white/[0.04]"
      >
        MGC
      </p>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <h2 id="credentials-title" className="sr-only">
          Credentials
        </h2>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="min-w-0 space-y-10">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Education
              </p>
              <h3 className="mt-4 font-heading text-xl font-semibold leading-snug text-warm-white sm:text-2xl">
                {data.education.degree}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-warm-white/75 sm:text-base">
                {data.education.school}
              </p>
              <p className="mt-1 font-body text-sm leading-relaxed text-warm-white/75 sm:text-base">
                {data.education.honors}
              </p>
            </div>

            <div className="border-t border-warm-white/20 pt-10">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Professional Experience
              </p>
              <ul className="mt-6 space-y-8">
                {data.experience.map((job) => (
                  <li key={job.role}>
                    <h3 className="font-heading text-xl font-semibold leading-snug text-warm-white sm:text-2xl">
                      {job.role}
                    </h3>
                    <p className="mt-2 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-warm-white/70">
                      {job.org}
                      <span aria-hidden className="mx-2 text-warm-white/40">
                        ·
                      </span>
                      {job.period}
                    </p>
                    <p className="mt-3 text-justify font-body text-sm leading-relaxed text-warm-white/85 sm:text-base">
                      {job.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0 space-y-10">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Awards &amp; Distinctions
              </p>
              <ul className="mt-6 space-y-3">
                {data.awards.map((award) => (
                  <li
                    key={award}
                    className="flex gap-3 font-body text-sm leading-relaxed text-warm-white/90 sm:text-base"
                  >
                    <span aria-hidden className="shrink-0 text-warm-white/45">
                      —
                    </span>
                    <span>{award}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-warm-white/20 pt-10">
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Skills &amp; Software
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex border border-warm-white/35 px-3 py-1.5 font-heading text-xs font-medium tracking-wide text-warm-white/90 sm:text-[0.8125rem]">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="inline-flex min-h-11 items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            See Works
          </Link>
          <Link
            href="/#about"
            className="inline-flex min-h-11 items-center border border-warm-white/50 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-warm-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Back
          </Link>
        </div>
      </div>
    </section>
  );
}
