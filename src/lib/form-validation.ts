/**
 * Shared customer-form validation + network helpers.
 * One seam for InquiryForm + InquireWizard (deletion test: removing this
 * forces duplicated ad-hoc checks back into both UIs).
 */

export const FORM_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  message: 5000,
  contactDetails: 300,
  location: 200,
  notes: 5000,
  uploadMaxBytes: 5 * 1024 * 1024,
  uploadMaxFiles: 6,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function isBrowserOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

export function validateName(name: string): string | null {
  const v = name.trim();
  if (!v) return "Name is required.";
  if (v.length < 2) return "Enter your full name.";
  if (v.length > FORM_LIMITS.name) return `Name must be under ${FORM_LIMITS.name} characters.`;
  return null;
}

export function validateEmail(email: string): string | null {
  const v = email.trim();
  if (!v) return "Email is required.";
  if (v.length > FORM_LIMITS.email) return "Email is too long.";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address.";
  return null;
}

export function validatePhone(
  phone: string,
  opts: { required?: boolean } = {},
): string | null {
  const v = phone.trim();
  if (!v) return opts.required ? "Phone number is required for Call/Text." : null;
  const digits = v.replace(/\D/g, "");
  if (digits.length < 10) return "Enter a valid phone number (at least 10 digits).";
  if (v.length > FORM_LIMITS.phone) return "Phone number is too long.";
  return null;
}

export function validateMessage(message: string): string | null {
  const v = message.trim();
  if (!v) return "Please tell us about your project.";
  if (v.length < 10) return "Add a bit more detail (at least 10 characters).";
  if (v.length > FORM_LIMITS.message) {
    return `Message must be under ${FORM_LIMITS.message} characters.`;
  }
  return null;
}

export function validateConsent(agreed: boolean): string | null {
  if (!agreed) {
    return "Please agree to the Privacy Policy and Terms before submitting.";
  }
  return null;
}

export function validateUploadFile(file: File): string | null {
  if (file.size > FORM_LIMITS.uploadMaxBytes) {
    return `${file.name} is too large (max 5 MB).`;
  }
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    return `${file.name}: use an image or PDF.`;
  }
  return null;
}

export function submitErrorMessage(err?: { message?: string } | null): string {
  if (!isBrowserOnline()) {
    return "You're offline. Reconnect to Wi‑Fi or mobile data, then try again. Your answers stay on this device until you submit.";
  }
  const msg = err?.message?.toLowerCase() ?? "";
  if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed to fetch")) {
    return "Network issue — the connection was too slow or interrupted. Check your signal and try again.";
  }
  return "We couldn't send your details just now. Check your connection and try again, or email us directly.";
}

export const COOKIE_CONSENT_KEY = "mgc-cookie-consent-v1";

export type CookieConsentValue = "accepted" | "essential";
