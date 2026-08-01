import type { Metadata } from "next";
import Link from "next/link";
import SystemPage from "@/components/SystemPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How MGC Architecture uses cookies and similar technologies on this site.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <SystemPage
      eyebrow="Legal"
      title="Cookie Policy"
      lede="A short list of what we store in your browser — essential security, preferences, and form drafts."
    >
      <p className="meta">Last updated · 1 August 2026</p>
      <p>
        We use a small number of cookies and local storage keys so the site works securely and
        remembers your preferences.
      </p>
      <h2>Essential</h2>
      <ul>
        <li>
          <strong>Session / auth (studio only):</strong> secure cookies so authorized editors can
          sign in to the content studio.
        </li>
        <li>
          <strong>Cookie preference:</strong> stores whether you accepted this notice (local
          storage).
        </li>
      </ul>
      <h2>Forms</h2>
      <p>
        Inquiry answers may be kept temporarily in your browser (local storage) so a slow or
        interrupted connection doesn&apos;t wipe a long form before you send it. That draft stays on
        your device until you submit or clear site data.
      </p>
      <h2>Analytics</h2>
      <p>
        We do not currently load third-party advertising cookies. If we add analytics later, we will
        update this page and the consent banner.
      </p>
      <p>
        See also our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms">Terms of Use</Link>.
      </p>
    </SystemPage>
  );
}
