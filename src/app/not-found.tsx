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
    <SystemPage eyebrow="404" title="This page isn’t here." theme="light">
      <p>
        The link may be outdated, or the page was moved. Try one of these instead:
      </p>
      <ul className="mt-6 space-y-2 font-heading text-sm font-semibold text-chestnut">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/work" className="hover:underline">
            Works
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/inquire" className="hover:underline">
            Inquire
          </Link>
        </li>
      </ul>
    </SystemPage>
  );
}
