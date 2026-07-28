"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-warm-gray bg-white px-4 py-3 font-heading text-sm text-charcoal placeholder:text-charcoal/40 focus:border-chestnut focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Simplified callback form — contact info + preferred date (calendar) + message.
 * Architect: drop Project Details fields; free discussion call framing.
 */
export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [contactMethod, setContactMethod] = useState("Email");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("submitting");

    const supabase = createClient();

    const method = String(fields.get("contact_method") ?? "");
    const contactDetails = String(fields.get("contact_details") ?? "").trim();
    const baseMessage = String(fields.get("message") ?? "").trim();

    const compiledMessage = [
      `[Contact Method: ${method}]`,
      contactDetails ? `[Details: ${contactDetails}]` : null,
      "",
      baseMessage,
    ]
      .filter((line) => line !== null)
      .join("\n")
      .trim();

    const { error } = await supabase.from("inquiries").insert({
      name: String(fields.get("name") ?? "").trim(),
      email: String(fields.get("email") ?? "").trim(),
      phone: String(fields.get("phone") ?? "").trim() || null,
      service: null,
      location: null,
      budget: null,
      preferred_date: String(fields.get("preferred_date") ?? "") || null,
      message: compiledMessage,
    });

    if (error) {
      setStatus("error");
      return;
    }
    form.reset();
    setContactMethod("Email");
    setStatus("success");
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
    >
      <h3 className="font-heading text-lg font-semibold text-charcoal">
        Discussion call for free
      </h3>
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
          <input id="inq-name" name="name" required autoComplete="name" className={inputClass} />
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
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="inq-phone"
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70"
          >
            Phone / Mobile Number
          </label>
          <input id="inq-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
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
              Messenger / Viber details
            </label>
            <input
              id="inq-contact-details"
              name="contact_details"
              required
              className={inputClass}
              placeholder="Link or number"
            />
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
            required
            rows={4}
            placeholder="Building, renovating, or something else — share whatever details you have."
            className={inputClass}
          />
        </div>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 border-l-2 border-terracotta bg-white px-4 py-3 text-sm text-charcoal"
        >
          Your inquiry didn&apos;t go through. Check your connection and try again, or
          email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full bg-chestnut px-7 py-3.5 font-heading text-sm font-semibold text-warm-white transition-colors hover:bg-chestnut/90 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
