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
    <SystemPage eyebrow="Legal" title="Cookie Policy">
      <p className="text-sm text-charcoal/55">Last updated: 1 August 2026</p>
      <div className="mt-8 space-y-6">
        <p>
          We use a small number of cookies and local storage keys so the site works securely and
          remembers your preferences.
        </p>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Essential</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Session / auth (studio only):</strong> secure cookies so authorized editors can
            sign in to the content studio.
          </li>
          <li>
            <strong>Cookie preference:</strong> stores whether you accepted this notice
            (local storage).
          </li>
        </ul>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Forms</h2>
        <p>
          Inquiry answers may be kept temporarily in your browser (local storage) so a slow or
          interrupted connection doesn&apos;t wipe a long form before you send it. That draft stays
          on your device until you submit or clear site data.
        </p>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Analytics</h2>
        <p>
          We do not currently load third-party advertising cookies. If we add analytics later, we
          will update this page and the consent banner.
        </p>
        <p>
          See also our{" "}
          <Link href="/privacy" className="text-chestnut underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-chestnut underline-offset-2 hover:underline">
            Terms of Use
          </Link>
          .
        </p>
      </div>
    </SystemPage>
  );
}
