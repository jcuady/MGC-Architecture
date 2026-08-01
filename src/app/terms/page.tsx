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
    <SystemPage
      eyebrow="Legal"
      title="Terms of Use"
      lede="Clear rules for this website, forms, and the cost calculator — no fine-print surprises."
    >
      <p className="meta">Last updated · 1 August 2026</p>
      <p>
        By using this website and submitting forms, you agree to these terms and our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <h2>Website content</h2>
      <p>
        Portfolio images, copy, and brand assets are owned by {site.name} or used with permission.
        You may not copy or reuse them for commercial purposes without written consent.
      </p>
      <h2>Inquiries &amp; forms</h2>
      <ul>
        <li>Provide accurate contact details so we can respond.</li>
        <li>
          Submitting a form is a request for information — not a binding contract, engagement, or
          construction quote.
        </li>
        <li>
          Do not upload unlawful, confidential third-party, or infringing materials without rights
          to share them.
        </li>
      </ul>
      <h2>Cost calculator</h2>
      <p>
        The estimator is an educational guide based on typical residential finish rates. Results are
        approximate and not a formal bid, bill of quantities, or offer to contract.
      </p>
      <h2>Availability</h2>
      <p>
        We aim for reliable access but do not guarantee uninterrupted service. Slow or offline
        networks may delay form submission until connectivity returns.
      </p>
      <h2>Limitation</h2>
      <p>
        To the fullest extent permitted by Philippine law, {site.name} is not liable for indirect or
        consequential damages arising from use of this site or reliance on estimate tools.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
      </p>
    </SystemPage>
  );
}
