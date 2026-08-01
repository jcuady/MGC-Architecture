import type { Metadata } from "next";
import Link from "next/link";
import SystemPage from "@/components/SystemPage";

export const metadata: Metadata = {
  title: "Access denied",
  description: "You don’t have permission to view this page.",
  robots: { index: false, follow: false },
};

/** Next.js forbidden() surface — also used by /403. */
export default function Forbidden() {
  return (
    <SystemPage
      variant="brand"
      eyebrow="403"
      title="You don’t have access."
      lede="This area is for the studio only. Public pages — contact, inquire, and the portfolio — stay open to everyone."
      actions={
        <>
          <Link
            href="/studio/login"
            className="inline-flex min-h-11 items-center bg-warm-white px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Studio login
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center border border-warm-white/40 px-6 py-3 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-warm-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Contact us
          </Link>
        </>
      }
    >
      <p>
        If you landed here by mistake, head home or send an inquiry — no account needed for
        project conversations.
      </p>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/inquire">Inquire</Link>
        </li>
        <li>
          <Link href="/work">Works</Link>
        </li>
      </ul>
    </SystemPage>
  );
}
