import Reveal from "../Reveal";
import InquiryForm from "../InquiryForm";
import { textStyle, type SiteContent } from "@/lib/cms";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+63${digits.startsWith("0") ? digits.slice(1) : digits}`;
}

export default function Contact({ data }: { data: SiteContent["contact"] }) {
  const channels = [
    { label: "Email", value: data.email, href: `mailto:${data.email}` },
    { label: "Mobile", value: data.phone, href: telHref(data.phone) },
    { label: "Facebook", value: data.facebookLabel, href: data.facebookHref },
    { label: "Instagram", value: data.instagramHandle, href: data.instagramHref },
  ];

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
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

            <ul className="mt-10 divide-y divide-warm-gray/70 border-y border-warm-gray/70">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      channel.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="group flex items-baseline justify-between gap-6 py-5"
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

            <p className="mt-8 border-l-2 border-gold pl-5 text-[0.95rem] leading-relaxed text-charcoal/70">
              {data.note}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <InquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
