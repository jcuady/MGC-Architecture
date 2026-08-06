import type { Metadata } from "next";
import Link from "next/link";
import SystemPage from "@/components/SystemPage";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How MGC Architecture collects, uses, and protects personal data from inquiries and this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SystemPage
      eyebrow="Legal"
      title="Privacy Policy"
      lede="What we collect from this site and your inquiries — and how we protect it."
    >
      <p className="meta">Last updated · 1 August 2026</p>
      <p>
        MGC Architecture (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what
        we collect when you use {site.name} (www.mgcarchitecture.com) and how we use it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Inquiry &amp; contact forms:</strong> name, email, phone, preferred contact
          method, project details, location/budget notes, and optional file uploads you attach.
        </li>
        <li>
          <strong>Technical data:</strong> basic server logs (IP, browser type, timestamps) for
          security and reliability.
        </li>
        <li>
          <strong>Cookies:</strong> essential cookies for security and preference storage (see{" "}
          <Link href="/cookies">Cookie Policy</Link>).
        </li>
      </ul>
      <h2>How we use data</h2>
      <ul>
        <li>Respond to project inquiries and schedule discussions.</li>
        <li>Prepare estimates and design proposals you request.</li>
        <li>Improve site reliability and prevent abuse.</li>
      </ul>
      <p>We do not sell your personal information.</p>
      <h2>Sharing</h2>
      <p>
        We use trusted processors (hosting and database providers such as Vercel and Supabase)
        solely to operate this site and store inquiry submissions. They process data under our
        instructions. New inquiries are also emailed to our studio inbox (
        {site.contact.email}) so we can respond promptly.
      </p>
      <h2>Retention</h2>
      <p>
        Inquiry records are kept as long as needed to manage your project relationship and our
        legitimate business records, then deleted or anonymized when no longer required.
      </p>
      <h2>Your choices</h2>
      <p>
        Email us at <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> to access,
        correct, or request deletion of inquiry data we hold about you.
      </p>
      <h2>Contact</h2>
      <p>
        MGC Architecture · Manila, Philippines ·{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
      </p>
    </SystemPage>
  );
}
