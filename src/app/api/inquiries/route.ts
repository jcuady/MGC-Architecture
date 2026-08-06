import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  FORM_LIMITS,
  validateConsent,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
} from "@/lib/form-validation";
import {
  sendInquiryEmail,
  type InquiryEmailPayload,
} from "@/lib/inquiry-notify";

export const runtime = "nodejs";

type InquiryBody = {
  source?: "contact" | "inquire";
  name?: string;
  email?: string;
  phone?: string | null;
  service?: string | null;
  location?: string | null;
  budget?: string | null;
  preferred_date?: string | null;
  message?: string;
  consent?: boolean;
  payload?: Record<string, unknown> | null;
  extras?: Array<{ label: string; value: string }>;
  /** Honeypot — bots fill this; humans leave empty. */
  company?: string;
};

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: InquiryBody;
  try {
    body = (await request.json()) as InquiryBody;
  } catch {
    return bad("Invalid JSON body.");
  }

  // Silent discard for bots
  if (body.company?.trim()) {
    return NextResponse.json({ ok: true, emailed: false });
  }

  const source = body.source === "inquire" ? "inquire" : "contact";
  const name = String(body.name ?? "");
  const email = String(body.email ?? "");
  const phone = body.phone ? String(body.phone) : "";
  const message = String(body.message ?? "");

  const nameErr = validateName(name);
  if (nameErr) return bad(nameErr);
  const emailErr = validateEmail(email);
  if (emailErr) return bad(emailErr);
  const phoneErr = validatePhone(phone, { required: false });
  if (phoneErr) return bad(phoneErr);
  const messageErr = validateMessage(message);
  if (messageErr) return bad(messageErr);
  const consentErr = validateConsent(Boolean(body.consent));
  if (consentErr) return bad(consentErr);

  if (message.length > FORM_LIMITS.message) {
    return bad("Message is too long.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return bad("Server is missing Supabase configuration.", 500);
  }

  const insertRow: Record<string, unknown> = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim() || null,
    service: body.service?.trim() || null,
    location: body.location?.trim() || null,
    budget: body.budget?.trim() || null,
    preferred_date: body.preferred_date?.trim() || null,
    message: message.trim(),
  };
  if (body.payload && typeof body.payload === "object") {
    insertRow.payload = body.payload;
  }

  const supabase = createClient(url, anon);
  let { error } = await supabase.from("inquiries").insert(insertRow);

  // Legacy DBs without payload column — retry without it.
  if (error && insertRow.payload) {
    delete insertRow.payload;
    ({ error } = await supabase.from("inquiries").insert(insertRow));
  }

  if (error) {
    console.error("[inquiries] insert failed", error.message);
    return bad("Couldn't save your inquiry. Try again shortly.", 502);
  }

  const emailPayload: InquiryEmailPayload = {
    source,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim() || null,
    service: body.service?.trim() || null,
    location: body.location?.trim() || null,
    budget: body.budget?.trim() || null,
    preferred_date: body.preferred_date?.trim() || null,
    message: message.trim(),
    extras: Array.isArray(body.extras) ? body.extras.slice(0, 20) : undefined,
  };

  const mailed = await sendInquiryEmail(emailPayload);
  if (!mailed.ok) {
    console.error("[inquiries] email failed", mailed.error);
    // Inquiry is saved in Studio — still success for the visitor.
    return NextResponse.json({
      ok: true,
      emailed: false,
      emailError: mailed.error,
    });
  }

  return NextResponse.json({
    ok: true,
    emailed: true,
    provider: mailed.provider,
  });
}
