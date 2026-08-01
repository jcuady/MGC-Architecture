"use client";

import { useEffect, useState, type FormEvent } from "react";
import FormConsentLabel from "@/components/FormConsentLabel";
import { createClient } from "@/lib/supabase/client";
import {
  FORM_LIMITS,
  isBrowserOnline,
  submitErrorMessage,
  validateConsent,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
} from "@/lib/form-validation";

const inputClass =
  "w-full border border-warm-gray bg-white px-4 py-3 font-heading text-sm text-charcoal placeholder:text-charcoal/40 focus:border-chestnut focus:outline-none";

const inputErrorClass = `${inputClass} border-terracotta`;

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "message" | "contact_details" | "consent", string>
>;

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Simplified callback form — contact info + preferred date + message + legal consent.
 */
export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [contactMethod, setContactMethod] = useState("Email");
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(isBrowserOnline());
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);

    const name = String(fields.get("name") ?? "");
    const email = String(fields.get("email") ?? "");
    const phone = String(fields.get("phone") ?? "");
    const method = String(fields.get("contact_method") ?? "");
    const contactDetails = String(fields.get("contact_details") ?? "").trim();
    const baseMessage = String(fields.get("message") ?? "");

    const errors: FieldErrors = {};
    const nameErr = validateName(name);
    if (nameErr) errors.name = nameErr;
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;
    const phoneRequired = method === "Call/Text";
    const phoneErr = validatePhone(phone, { required: phoneRequired });
    if (phoneErr) errors.phone = phoneErr;
    if ((method === "Messenger" || method === "Viber") && !contactDetails) {
      errors.contact_details =
        method === "Messenger"
          ? "Messenger profile link is required."
          : "Viber number is required.";
    } else if (contactDetails.length > FORM_LIMITS.contactDetails) {
      errors.contact_details = "Details are too long.";
    }
    const messageErr = validateMessage(baseMessage);
    if (messageErr) errors.message = messageErr;
    const consentErr = validateConsent(consent);
    if (consentErr) errors.consent = consentErr;

    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    if (!isBrowserOnline()) {
      setStatus("error");
      setFormError(submitErrorMessage());
      return;
    }

    setStatus("submitting");
    setFormError(null);

    const compiledMessage = [
      `[Contact Method: ${method}]`,
      contactDetails ? `[Details: ${contactDetails}]` : null,
      "[Consent: Privacy Policy & Terms accepted]",
      "",
      baseMessage.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n")
      .trim();

    try {
      const supabase = createClient();
      const { error } = await supabase.from("inquiries").insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        service: null,
        location: null,
        budget: null,
        preferred_date: String(fields.get("preferred_date") ?? "") || null,
        message: compiledMessage,
      });

      if (error) {
        setStatus("error");
        setFormError(submitErrorMessage(error));
        return;
      }
      form.reset();
      setContactMethod("Email");
      setConsent(false);
      setFieldErrors({});
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setFormError(submitErrorMessage(e as { message?: string }));
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex h-full flex-col justify-center border-l-2 border-gold bg-beige p-8 sm:p-10"
      >
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
          Inquiry sent
        </p>
        <h3 className="mt-4 font-heading text-2xl font-semibold text-charcoal">
          Thank you — we received your inquiry.
        </h3>
        <p className="mt-4 leading-relaxed text-charcoal/75">
          Expect a call or reply within a day or two. If it&apos;s urgent, reach us
          directly through any of the channels listed here.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 self-start border border-chestnut px-6 py-3 font-heading text-sm font-semibold text-chestnut transition-colors hover:bg-chestnut hover:text-warm-white"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const needsAppDetails = contactMethod === "Messenger" || contactMethod === "Viber";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-beige p-6 sm:p-8"
      aria-label="Discussion call inquiry form"
      noValidate
    >
      <h3 className="font-heading text-lg font-semibold text-charcoal">
        Discussion call for free
      </h3>
      {!online ? (
        <p
          role="status"
          className="mt-4 border-l-2 border-terracotta bg-white px-4 py-3 text-sm text-charcoal"
        >
          You&apos;re offline. You can fill the form now — submit once you&apos;re back online.
        </p>
      ) : null}
      <p className="mt-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">
        Contact info
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="inq-name"
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
          >
            Name *
          </label>
          <input
            id="inq-name"
            name="name"
            autoComplete="name"
            maxLength={FORM_LIMITS.name}
            aria-invalid={Boolean(fieldErrors.name)}
            className={fieldErrors.name ? inputErrorClass : inputClass}
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.name}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="inq-email"
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
          >
            Email *
          </label>
          <input
            id="inq-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={FORM_LIMITS.email}
            aria-invalid={Boolean(fieldErrors.email)}
            className={fieldErrors.email ? inputErrorClass : inputClass}
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.email}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="inq-phone"
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
          >
            Phone / Mobile Number
            {contactMethod === "Call/Text" ? " *" : ""}
          </label>
          <input
            id="inq-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={FORM_LIMITS.phone}
            aria-invalid={Boolean(fieldErrors.phone)}
            className={fieldErrors.phone ? inputErrorClass : inputClass}
          />
          {fieldErrors.phone ? (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.phone}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="inq-contact-method"
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
          >
            Preferred Contact Method
          </label>
          <div className="relative">
            <select
              id="inq-contact-method"
              name="contact_method"
              className={`${inputClass} appearance-none pr-10`}
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
            >
              <option value="Email">Email</option>
              <option value="Call/Text">Call/Text</option>
              <option value="Messenger">Messenger</option>
              <option value="Viber">Viber</option>
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-charcoal"
            />
          </div>
        </div>

        {needsAppDetails ? (
          <div className="sm:col-span-2">
            <label
              htmlFor="inq-contact-details"
              className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
            >
              Messenger / Viber details *
            </label>
            <input
              id="inq-contact-details"
              name="contact_details"
              maxLength={FORM_LIMITS.contactDetails}
              aria-invalid={Boolean(fieldErrors.contact_details)}
              className={fieldErrors.contact_details ? inputErrorClass : inputClass}
              placeholder="Link or number"
            />
            {fieldErrors.contact_details ? (
              <p className="mt-1 text-xs text-terracotta">{fieldErrors.contact_details}</p>
            ) : null}
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <label
            htmlFor="inq-date"
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
          >
            Preferred discussion date
          </label>
          <input
            id="inq-date"
            name="preferred_date"
            type="date"
            min={todayISO()}
            className={`${inputClass} min-h-12`}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="inq-message"
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
          >
            Tell us about your project *
          </label>
          <textarea
            id="inq-message"
            name="message"
            rows={4}
            maxLength={FORM_LIMITS.message}
            aria-invalid={Boolean(fieldErrors.message)}
            placeholder="Building, renovating, or something else — share whatever details you have."
            className={fieldErrors.message ? inputErrorClass : inputClass}
          />
          {fieldErrors.message ? (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.message}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <FormConsentLabel
            id="inq-consent"
            checked={consent}
            onChange={setConsent}
            error={fieldErrors.consent}
          />
        </div>
      </div>

      {(status === "error" || formError) && (
        <p
          role="alert"
          className="mt-4 border-l-2 border-terracotta bg-white px-4 py-3 text-sm text-charcoal"
        >
          {formError ?? submitErrorMessage()}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || !online}
        className="mt-6 w-full bg-chestnut px-7 py-3.5 font-heading text-sm font-semibold text-warm-white transition-colors hover:bg-chestnut/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : !online ? "Offline — reconnect to send" : "Send inquiry"}
      </button>
    </form>
  );
}
