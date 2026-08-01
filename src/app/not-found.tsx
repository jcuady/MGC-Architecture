import type { Metadata } from "next";
import Link from "next/link";
import SystemPage from "@/components/SystemPage";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you’re looking for doesn’t exist or has moved.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SystemPage
      variant="brand"
      eyebrow="404"
      title="This page isn’t here."
      lede="The link may be outdated, or the page was moved. You’re still in the right place for MGC Architecture."
      actions={
        <>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center border border-warm-white/40 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-warm-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Contact
          </Link>
        </>
      }
    >
      <p>Useful places to continue:</p>
      <ul>
        <li>
          <Link href="/work">Works — selected projects</Link>
        </li>
        <li>
          <Link href="/process">Process — how a project moves forward</Link>
        </li>
        <li>
          <Link href="/inquire">Inquire — tell us about your project</Link>
        </li>
        <li>
          <Link href="/estimate">Cost calculator</Link>
        </li>
      </ul>
    </SystemPage>
  );
}
