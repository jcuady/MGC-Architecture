import Image from "next/image";
import { nav } from "@/lib/content";
import { textStyle } from "@/lib/cms";
import { getSiteContent } from "@/lib/cms-server";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+63${digits.startsWith("0") ? digits.slice(1) : digits}`;
}

export default async function Footer() {
  const content = await getSiteContent();
  const { contact, footer } = content;

  return (
    <footer className="relative overflow-hidden bg-chestnut text-warm-white">
      <Image
        src="/brand/monogram-white.png"
        alt=""
        aria-hidden
        width={800}
        height={800}
        className="pointer-events-none absolute -left-24 -top-24 w-96 opacity-[0.05]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[6fr_3fr_3fr]">
          <div>
            <Image
              src="/brand/logo-stacked-white.png"
              alt="MGC Architecture"
              width={160}
              height={160}
              className="h-28 w-28 object-contain"
            />
            <p
              className="mt-6 max-w-sm font-heading text-lg font-medium leading-snug"
              style={textStyle(footer.styles?.tagline)}
            >
              {footer.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-draw font-heading text-sm text-warm-white/85"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 font-heading text-sm text-warm-white/85">
              <li>
                <a href={`mailto:${contact.email}`} className="link-draw break-all">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={telHref(contact.phone)} className="link-draw">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw"
                >
                  Facebook · {contact.facebookLabel}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw"
                >
                  Instagram · {contact.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-warm-white/15 pt-6">
          <p className="font-heading text-xs text-warm-white/60">
            © {new Date().getFullYear()} MGC Architecture. All rights reserved.
          </p>
          <p className="font-heading text-xs text-warm-white/60">Manila, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
