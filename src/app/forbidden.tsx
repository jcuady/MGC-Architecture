import type { Metadata } from "next";
import Link from "next/link";
import SystemPage from "@/components/SystemPage";

export const metadata: Metadata = {
  title: "Access denied",
  description: "You don’t have permission to view this page.",
  robots: { index: false, follow: false },
};

/** Next.js forbidden() surface — also linked as /403 via rewrite-free branded page. */
export default function Forbidden() {
  return (
    <SystemPage eyebrow="403" title="You don’t have access." theme="dark">
      <p>
        This area is restricted. If you were trying to open the studio, sign in with an
        authorized account. For project help, use the public contact or inquire forms —
        those work without signing in.
      </p>
      <ul className="mt-6 space-y-2 font-heading text-sm font-semibold text-gold">
        <li>
          <Link href="/studio/login" className="hover:underline">
            Studio login
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
      </ul>
    </SystemPage>
  );
}
