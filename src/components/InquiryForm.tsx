"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const services = [
  "Architectural Design",
  "Renovation & Remodeling",
  "Cabinetry & Built-In Furniture",
  "Design Documentation & Permit Assistance",
  "Cost Estimation & Budget Planning",
  "3D Visualization",
  "Something else",
];

const budgets = [
  "Under ₱500k",
  "₱500k – ₱1M",
  "₱1M – ₱3M",
  "₱3M – ₱5M",
  "Over ₱5M",
  "Not sure yet",
  "I'd like a cost estimate first",
];

const inputClass =
  "w-full border border-warm-gray bg-white px-4 py-3 font-heading text-sm text-charcoal placeholder:text-charcoal/40 focus:border-chestnut focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("submitting");

    const supabase = createClient();

    const contactMethod = String(fields.get("contact_method") ?? "");
    const contactDetails = String(fields.get("contact_details") ?? "");
    const propertyStatus = String(fields.get("property_status") ?? "");
    const baseMessage = String(fields.get("message") ?? "").trim();
    
    // Compile extra fields into the message for the admin to read easily
    const compiledMessage = `
[Contact Method: ${contactMethod}]
${contactDetails ? `[Details: ${contactDetails}]\n` : ""}
[Property: ${propertyStatus}]

${baseMessage}
    `.trim();

    const { error } = await supabase.from("inquiries").insert({
      name: String(fields.get("name") ?? "").trim(),
      email: String(fields.get("email") ?? "").trim(),
      phone: String(fields.get("phone") ?? "").trim() || null,
      service: String(fields.get("service") ?? "") || null,
      location: String(fields.get("location") ?? "").trim() || null,
      budget: String(fields.get("budget") ?? "") || null,
      preferred_date: String(fields.get("preferred_date") ?? "") || null,
      message: compiledMessage,
    });

    if (error) {
      setStatus("error");
      return;
    }
    form.reset();
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
          Expect a reply within a day or two. If it&apos;s urgent, call or message us
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

  return (
    <form onSubmit={onSubmit} className="bg-beige p-6 sm:p-8" aria-label="Project inquiry form">
      <h3 className="font-heading text-lg font-semibold text-charcoal">
        Book a consultation
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
        The initial consultation is complimentary.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-name" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Name *
          </label>
          <input id="inq-name" name="name" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="inq-email" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Email *
          </label>
          <input id="inq-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="inq-phone" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Phone / Mobile Number
          </label>
          <input id="inq-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="inq-contact-method" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Preferred Contact Method
          </label>
          <div className="relative">
            <select id="inq-contact-method" name="contact_method" className={`${inputClass} appearance-none pr-10`} defaultValue="Email">
              <option value="Email">Email</option>
              <option value="Call/Text">Call/Text</option>
              <option value="Messenger">Messenger</option>
              <option value="Viber">Viber</option>
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-charcoal" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="inq-contact-details" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Messenger / Viber details (if selected)
          </label>
          <input id="inq-contact-details" name="contact_details" className={inputClass} placeholder="Link or number" />
        </div>

        <div className="sm:col-span-2 border-t border-warm-gray/60 my-2 pt-6">
          <h4 className="font-heading text-sm font-semibold text-charcoal uppercase tracking-[0.12em] mb-4">Project Details</h4>
        </div>

        <div>
          <label htmlFor="inq-location" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Project location
          </label>
          <input id="inq-location" name="location" placeholder="City / municipality" className={inputClass} />
        </div>
        <div>
          <label htmlFor="inq-property" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Do you have a property?
          </label>
          <div className="relative">
            <select id="inq-property" name="property_status" className={`${inputClass} appearance-none pr-10`} defaultValue="Yes">
              <option value="Yes">Yes, I have a property</option>
              <option value="No">No</option>
              <option value="Still looking">Still looking</option>
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-charcoal" />
          </div>
        </div>
        <div>
          <label htmlFor="inq-service" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            What do you need?
          </label>
          <div className="relative">
            <select id="inq-service" name="service" defaultValue="" className={`${inputClass} appearance-none pr-10`}>
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-charcoal" />
          </div>
        </div>
        <div>
          <label htmlFor="inq-budget" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Estimated budget
          </label>
          <div className="relative">
            <select id="inq-budget" name="budget" defaultValue="" className={`${inputClass} appearance-none pr-10`}>
              <option value="" disabled>
                Select a range
              </option>
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-charcoal" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="inq-date" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
            Preferred consultation date
          </label>
          <input id="inq-date" name="preferred_date" type="date" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="inq-message" className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/70">
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
        <p role="alert" className="mt-4 border-l-2 border-terracotta bg-white px-4 py-3 text-sm text-charcoal">
          Your inquiry didn&apos;t go through. Check your connection and try again, or
          email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full bg-chestnut px-7 py-3.5 font-heading text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
