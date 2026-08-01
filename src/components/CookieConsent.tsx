"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_KEY,
  type CookieConsentValue,
} from "@/lib/form-validation";

/**
 * Brand-aligned consent bar — chestnut surface like the site footer.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept(value: CookieConsentValue) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* private mode — still hide for this session */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-warm-white/15 bg-chestnut p-4 text-warm-white shadow-[0_-12px_40px_rgba(47,42,40,0.28)] sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Cookies
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-warm-white/80">
            We use essential cookies and local storage so forms and the studio stay secure, and to
            remember this choice. See our{" "}
            <Link
              href="/cookies"
              className="font-semibold text-warm-white underline decoration-gold/60 underline-offset-2 hover:decoration-gold"
            >
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-warm-white underline decoration-gold/60 underline-offset-2 hover:decoration-gold"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => accept("essential")}
            className="inline-flex min-h-11 items-center border border-warm-white/35 px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white transition-colors hover:bg-warm-white/10"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => accept("accepted")}
            className="inline-flex min-h-11 items-center bg-warm-white px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-chestnut transition-colors hover:bg-beige"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
