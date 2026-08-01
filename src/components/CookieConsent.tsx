"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_KEY,
  type CookieConsentValue,
} from "@/lib/form-validation";

/**
 * Lightweight consent bar — essential cookies only today.
 * Preference stored in localStorage (not a tracking cookie).
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
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-warm-gray/80 bg-warm-white/95 p-4 shadow-[0_-8px_30px_rgba(47,42,40,0.12)] backdrop-blur-sm sm:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
            Cookies
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/80">
            We use essential cookies and local storage so forms and the studio stay secure, and to
            remember this choice. See our{" "}
            <Link href="/cookies" className="font-semibold text-chestnut underline-offset-2 hover:underline">
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-chestnut underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => accept("essential")}
            className="inline-flex min-h-11 items-center border border-warm-gray px-4 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => accept("accepted")}
            className="inline-flex min-h-11 items-center bg-chestnut px-5 py-2.5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-warm-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
