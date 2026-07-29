import Reveal from "../Reveal";
import InquiryForm from "../InquiryForm";
import { textStyle, type SiteContent } from "@/lib/cms";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+63${digits.startsWith("0") ? digits.slice(1) : digits}`;
}

/**
 * Contact — punchier copy, compressed details, simplified discussion-call form.
 * heading="none" when the page already has an h1 hero (e.g. /contact).
 */
export default function Contact({
  data,
  heading = "section",
}: {
  data: SiteContent["contact"];
  heading?: "section" | "none";
}) {
  const primary = [
    { label: "Email", value: data.email, href: `mailto:${data.email}` },
    { label: "Mobile", value: data.phone, href: telHref(data.phone) },
  ];
  const social = [
    { label: "Facebook", value: data.facebookLabel, href: data.facebookHref },
    { label: "Instagram", value: data.instagramHandle, href: data.instagramHref },
  ];

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            {heading === "section" ? (
              <>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                  {data.eyebrow}
                </p>
                <h2
                  className="mt-4 font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-[2.75rem]"
                  style={textStyle(data.styles?.title)}
                >
                  {data.title}
                </h2>
                <p
                  className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75"
                  style={textStyle(data.styles?.lede)}
                >
                  {data.lede}
                </p>
              </>
            ) : (
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                Reach us
              </p>
            )}

            {/* Primary contact — email & mobile */}
            <ul
              className={`${heading === "section" ? "mt-10" : "mt-6"} divide-y divide-warm-gray/70 border-y border-warm-gray/70`}
            >
              {primary.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    className="group flex min-h-11 items-baseline justify-between gap-6 py-4"
                  >
                    <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">
                      {channel.label}
                    </span>
                    <span className="link-draw font-heading font-medium text-charcoal group-hover:text-chestnut">
                      {channel.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Social — compressed below primary details */}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {social.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-sm text-charcoal/60 transition-colors hover:text-chestnut"
                >
                  <span className="text-xs uppercase tracking-[0.14em] text-charcoal/40">
                    {channel.label}
                  </span>
                  <span className="ml-2">{channel.value}</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <InquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
