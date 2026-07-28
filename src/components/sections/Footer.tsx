import Image from "next/image";
import { nav } from "@/lib/content";
import { getSiteContent } from "@/lib/cms-server";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+63${digits.startsWith("0") ? digits.slice(1) : digits}`;
}

/**
 * Compact footer — no tagline, tighter padding, Explore in two columns,
 * monogram watermark on the right (architect markup).
 */
export default async function Footer() {
  const content = await getSiteContent();
  const { contact } = content;
  const exploreLeft = nav.slice(0, 3);
  const exploreRight = nav.slice(3);

  return (
    <footer className="relative overflow-hidden bg-chestnut text-warm-white">
      <Image
        src="/brand/monogram-white.png"
        alt=""
        aria-hidden
        width={800}
        height={800}
        className="pointer-events-none absolute -bottom-20 -right-16 w-72 opacity-[0.06] sm:w-96 sm:-bottom-24 sm:-right-20"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr_1fr] md:items-start md:gap-10">
          <div>
            <Image
              src="/brand/logo-stacked-white.png"
              alt="MGC Architecture"
              width={160}
              height={160}
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
            />
          </div>

          <nav aria-label="Footer">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Explore
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-0">
              <ul className="space-y-2">
                {exploreLeft.map((item) => (
                  <li key={item.href + item.label}>
                    <a
                      href={item.href}
                      className="link-draw font-heading text-sm text-warm-white/85"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {exploreRight.map((item) => (
                  <li key={item.href + item.label}>
                    <a
                      href={item.href}
                      className="link-draw font-heading text-sm text-warm-white/85"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 font-heading text-sm text-warm-white/85">
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

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-warm-white/15 pt-4">
          <p className="font-heading text-xs text-warm-white/60">
            © {new Date().getFullYear()} MGC Architecture. All rights reserved.
          </p>
          <p className="font-heading text-xs text-warm-white/60">Manila, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
