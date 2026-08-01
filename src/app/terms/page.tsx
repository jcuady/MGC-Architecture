import type { Metadata } from "next";
import Link from "next/link";
import SystemPage from "@/components/SystemPage";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using the MGC Architecture website, cost calculator, and inquiry forms.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <SystemPage eyebrow="Legal" title="Terms of Use">
      <p className="text-sm text-charcoal/55">Last updated: 1 August 2026</p>
      <div className="mt-8 space-y-6">
        <p>
          By using this website and submitting forms, you agree to these terms and our{" "}
          <Link href="/privacy" className="text-chestnut underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Website content</h2>
        <p>
          Portfolio images, copy, and brand assets are owned by {site.name} or used with
          permission. You may not copy or reuse them for commercial purposes without written
          consent.
        </p>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Inquiries &amp; forms</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide accurate contact details so we can respond.</li>
          <li>
            Submitting a form is a request for information — not a binding contract, engagement,
            or construction quote.
          </li>
          <li>
            Do not upload unlawful, confidential third-party, or infringing materials without
            rights to share them.
          </li>
        </ul>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Cost calculator</h2>
        <p>
          The estimator is an educational guide based on typical residential finish rates. Results
          are approximate and not a formal bid, bill of quantities, or offer to contract.
        </p>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Availability</h2>
        <p>
          We aim for reliable access but do not guarantee uninterrupted service. Slow or offline
          networks may delay form submission until connectivity returns.
        </p>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Limitation</h2>
        <p>
          To the fullest extent permitted by Philippine law, {site.name} is not liable for
          indirect or consequential damages arising from use of this site or reliance on estimate
          tools.
        </p>
        <h2 className="font-heading text-lg font-semibold text-charcoal">Contact</h2>
        <p>
          Questions:{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-chestnut underline-offset-2 hover:underline"
          >
            {site.contact.email}
          </a>
        </p>
      </div>
    </SystemPage>
  );
}
