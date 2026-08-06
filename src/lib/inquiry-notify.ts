/**
 * Branded inquiry notification email — chestnut / beige / charcoal (BRANDING.md).
 * Email-safe: inline CSS, system fonts (Poppins→Arial, Lora→Georgia).
 * From address must use the verified Resend domain (mgcarchitecture.com).
 */

export const INQUIRY_NOTIFY_TO =
  process.env.INQUIRY_NOTIFY_EMAIL?.trim() || "mgcarchitectureph@gmail.com";

/** Default From — verified domain at resend.com/domains (not onboarding@resend.dev). */
export const INQUIRY_FROM_DEFAULT =
  "MGC Architecture <inquiries@mgcarchitecture.com>";

export type InquiryEmailPayload = {
  source: "contact" | "inquire";
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  location?: string | null;
  budget?: string | null;
  preferred_date?: string | null;
  message: string;
  /** Extra labeled rows for contact method, wizard fields, etc. */
  extras?: Array<{ label: string; value: string }>;
};

const BRAND = {
  chestnut: "#753627",
  warmWhite: "#F3F2F2",
  charcoal: "#2F2A28",
  gold: "#C89B4B",
  terracotta: "#A64327",
  beige: "#F1E8DE",
  warmGray: "#D8D2CC",
} as const;

const BRACKET_LINE = /^\[([^:\]]+):\s*([^\]]*)\]\s*$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function display(value: string | null | undefined): string {
  const v = value?.trim();
  return v ? v : "—";
}

function row(label: string, value: string | null | undefined, opts?: { hideEmpty?: boolean }): string {
  const raw = value?.trim();
  if (opts?.hideEmpty && !raw) return "";
  const shown = raw || "—";
  return `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${BRAND.warmGray};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.terracotta};width:34%;vertical-align:top;">${escapeHtml(label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${BRAND.warmGray};font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.5;color:${BRAND.charcoal};">${escapeHtml(shown).replace(/\n/g, "<br/>")}</td>
</tr>`;
}

function sectionTitle(title: string): string {
  return `<tr><td colspan="2" style="padding:22px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.chestnut};border-bottom:2px solid ${BRAND.gold};">${escapeHtml(title)}</td></tr>`;
}

/** Pull `[Label: value]` lines out of compiled messages so the email stays structured. */
export function splitCompiledMessage(message: string): {
  fields: Array<{ label: string; value: string }>;
  notes: string;
} {
  const fields: Array<{ label: string; value: string }> = [];
  const notes: string[] = [];
  for (const line of message.split(/\r?\n/)) {
    const m = line.match(BRACKET_LINE);
    if (m) {
      fields.push({ label: m[1].trim(), value: m[2].trim() });
    } else if (line.trim()) {
      notes.push(line);
    }
  }
  return { fields, notes: notes.join("\n").trim() };
}

function mergeFields(
  payload: InquiryEmailPayload,
): Array<{ label: string; value: string }> {
  const { fields: fromMessage, notes } = splitCompiledMessage(payload.message);
  const map = new Map<string, string>();

  const put = (label: string, value: string | null | undefined) => {
    const v = value?.trim();
    if (!v) return;
    const key = label.toLowerCase();
    if (!map.has(key)) map.set(key, v);
  };

  put("Name", payload.name);
  put("Email", payload.email);
  put("Phone", payload.phone);
  put("Service", payload.service);
  put("Location", payload.location);
  put("Budget", payload.budget);
  put("Preferred date", payload.preferred_date);
  for (const e of payload.extras ?? []) put(e.label, e.value);
  for (const f of fromMessage) put(f.label, f.value);
  if (notes) put("Project notes", notes);

  return [...map.entries()].map(([k, value]) => {
    // Restore original casing from first write — use title from known list
    const known: Record<string, string> = {
      name: "Name",
      email: "Email",
      phone: "Phone",
      service: "Service",
      location: "Location",
      budget: "Budget",
      "preferred date": "Preferred date",
      "project notes": "Project notes",
      "contact method": "Contact method",
      "contact details": "Contact details",
      consent: "Consent",
      source: "Source",
      "project type": "Project type",
      "sub-category": "Sub-category",
      "project status": "Project status",
      "has property": "Has property",
    };
    return { label: known[k] || k.replace(/\b\w/g, (c) => c.toUpperCase()), value };
  });
}

export function inquiryEmailSubject(payload: InquiryEmailPayload): string {
  const kind = payload.source === "inquire" ? "Inquire" : "Contact";
  const detail = payload.service?.trim() || payload.name.trim();
  return `[MGC] ${kind}: ${detail}`.slice(0, 120);
}

export function buildInquiryEmailHtml(payload: InquiryEmailPayload): string {
  const kindLabel =
    payload.source === "inquire" ? "Project inquiry" : "Discussion call";
  const all = mergeFields(payload);
  const contactLabels = new Set([
    "name",
    "email",
    "phone",
    "contact method",
    "contact details",
    "preferred date",
    "consent",
  ]);
  const contactRows = all.filter((f) => contactLabels.has(f.label.toLowerCase()));
  const projectRows = all.filter((f) => !contactLabels.has(f.label.toLowerCase()));

  // Always show the core contact grid so empty answers read as "—"
  const contactBlock = [
    sectionTitle("Contact"),
    row("Name", payload.name),
    row("Email", payload.email),
    row("Phone", payload.phone),
    ...contactRows
      .filter((f) => !["name", "email", "phone"].includes(f.label.toLowerCase()))
      .map((f) => row(f.label, f.value)),
    row("Preferred date", payload.preferred_date, {
      hideEmpty: payload.source === "inquire",
    }),
  ].join("");

  const projectBlock =
    payload.source === "inquire" || projectRows.length
      ? [
          sectionTitle("Project"),
          row("Service", payload.service),
          row("Location", payload.location, {
            hideEmpty: payload.source === "contact",
          }),
          row("Budget", payload.budget, {
            hideEmpty: payload.source === "contact",
          }),
          ...projectRows
            .filter(
              (f) =>
                !["service", "location", "budget", "project notes"].includes(
                  f.label.toLowerCase(),
                ),
            )
            .map((f) => row(f.label, f.value)),
        ].join("")
      : "";

  const notesField =
    all.find((f) => f.label.toLowerCase() === "project notes")?.value ||
    (payload.source === "contact"
      ? splitCompiledMessage(payload.message).notes
      : splitCompiledMessage(payload.message).notes);
  const notesHtml = escapeHtml(display(notesField === "—" ? "" : notesField)).replace(
    /\n/g,
    "<br/>",
  );

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/><title>${escapeHtml(inquiryEmailSubject(payload))}</title></head>
<body style="margin:0;padding:0;background:${BRAND.warmWhite};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.warmWhite};">
    <tr><td style="padding:24px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid ${BRAND.warmGray};">
        <tr>
          <td style="background:${BRAND.chestnut};padding:28px 28px 24px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.gold};">New inquiry</p>
            <h1 style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:600;line-height:1.25;color:${BRAND.warmWhite};">mgc architecture</h1>
            <p style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.5;color:rgba(243,242,242,0.75);">${escapeHtml(kindLabel)} · www.mgcarchitecture.com</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 28px 28px;background:${BRAND.beige};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${contactBlock}
              ${projectBlock}
            </table>
            <p style="margin:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.chestnut};border-bottom:2px solid ${BRAND.gold};padding-bottom:8px;">Notes</p>
            <div style="padding:16px;background:#ffffff;border-left:3px solid ${BRAND.gold};font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.65;color:${BRAND.charcoal};">${notesHtml || "—"}</div>
            <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:rgba(47,42,40,0.65);">Reply to this email to reach <strong style="color:${BRAND.charcoal};">${escapeHtml(payload.name)}</strong> &lt;${escapeHtml(payload.email)}&gt;.</p>
          </td>
        </tr>
        <tr>
          <td style="background:${BRAND.chestnut};padding:18px 28px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:rgba(243,242,242,0.7);">Saved in Studio → Inquiries · <a href="https://www.mgcarchitecture.com/studio/inquiries" style="color:${BRAND.gold};text-decoration:none;">Open studio</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildInquiryEmailText(payload: InquiryEmailPayload): string {
  const lines = [
    `MGC Architecture — new ${payload.source === "inquire" ? "project inquiry" : "discussion call"}`,
    "",
    "CONTACT",
    `Name: ${display(payload.name)}`,
    `Email: ${display(payload.email)}`,
    `Phone: ${display(payload.phone)}`,
  ];
  for (const e of mergeFields(payload)) {
    if (["name", "email", "phone"].includes(e.label.toLowerCase())) continue;
    if (e.label.toLowerCase() === "project notes") continue;
    lines.push(`${e.label}: ${e.value}`);
  }
  const notes =
    mergeFields(payload).find((f) => f.label.toLowerCase() === "project notes")
      ?.value || splitCompiledMessage(payload.message).notes;
  lines.push("", "NOTES", notes || "—", "", "—", "Also in Studio → Inquiries");
  return lines.join("\n");
}

export type SendInquiryEmailResult =
  | { ok: true; provider: "resend" | "formsubmit" | "dry-run"; id?: string }
  | { ok: false; error: string };

/**
 * Send branded inquiry mail to the studio Gmail.
 * Prefer Resend (RESEND_API_KEY) from the verified domain.
 */
export async function sendInquiryEmail(
  payload: InquiryEmailPayload,
): Promise<SendInquiryEmailResult> {
  const to = INQUIRY_NOTIFY_TO;
  const subject = inquiryEmailSubject(payload);
  const html = buildInquiryEmailHtml(payload);
  const text = buildInquiryEmailText(payload);

  if (process.env.INQUIRY_EMAIL_DRY_RUN === "1") {
    return { ok: true, provider: "dry-run" };
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const from = process.env.INQUIRY_FROM_EMAIL?.trim() || INQUIRY_FROM_DEFAULT;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject,
        html,
        text,
      }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };
    if (!res.ok) {
      return {
        ok: false,
        error: body.message || body.name || `Resend HTTP ${res.status}`,
      };
    }
    return { ok: true, provider: "resend", id: body.id };
  }

  // Fallback when Resend is not configured
  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.mgcarchitecture.com";
  const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: siteOrigin,
      Referer: `${siteOrigin}/contact`,
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _replyto: payload.email,
      _captcha: "false",
      Source: payload.source === "inquire" ? "Inquire wizard" : "Contact form",
      Name: payload.name,
      Email: payload.email,
      Phone: payload.phone || "—",
      Service: payload.service || "—",
      Location: payload.location || "—",
      Budget: payload.budget || "—",
      "Preferred date": payload.preferred_date || "—",
      Message: payload.message,
      ...(payload.extras ?? []).reduce<Record<string, string>>((acc, e) => {
        acc[e.label] = e.value;
        return acc;
      }, {}),
    }),
  });

  if (!fsRes.ok) {
    const errText = await fsRes.text().catch(() => "");
    return { ok: false, error: `FormSubmit HTTP ${fsRes.status}: ${errText.slice(0, 200)}` };
  }

  const fsBody = (await fsRes.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };
  const success =
    fsBody.success === true ||
    fsBody.success === "true" ||
    String(fsBody.message ?? "")
      .toLowerCase()
      .includes("success");

  if (!success) {
    const msg = fsBody.message || "FormSubmit did not confirm delivery";
    if (/activ/i.test(msg)) {
      return {
        ok: false,
        error:
          "FormSubmit activation required — set RESEND_API_KEY with verified domain From address instead.",
      };
    }
    return { ok: false, error: msg };
  }

  return { ok: true, provider: "formsubmit" };
}

/** Fetch Resend email last_event for delivery verification. */
export async function getResendEmailStatus(
  id: string,
  apiKey = process.env.RESEND_API_KEY?.trim(),
): Promise<{ last_event?: string; to?: string[]; from?: string } | null> {
  if (!apiKey || !id) return null;
  const res = await fetch(`https://api.resend.com/emails/${id}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    last_event?: string;
    to?: string[];
    from?: string;
  };
}
