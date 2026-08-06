/**
 * Branded inquiry notification email — chestnut / beige / charcoal (BRANDING.md).
 * Email-safe: inline CSS, system fonts (Poppins→Arial, Lora→Georgia).
 */

export const INQUIRY_NOTIFY_TO =
  process.env.INQUIRY_NOTIFY_EMAIL?.trim() || "mgcarchitectureph@gmail.com";

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
  /** Extra labeled rows for contact method, etc. */
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value?.trim()) return "";
  return `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${BRAND.warmGray};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.terracotta};width:34%;vertical-align:top;">${escapeHtml(label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${BRAND.warmGray};font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.5;color:${BRAND.charcoal};">${escapeHtml(value.trim())}</td>
</tr>`;
}

export function inquiryEmailSubject(payload: InquiryEmailPayload): string {
  const kind = payload.source === "inquire" ? "Inquire" : "Contact";
  const detail = payload.service?.trim() || payload.name.trim();
  return `[MGC] ${kind}: ${detail}`.slice(0, 120);
}

export function buildInquiryEmailHtml(payload: InquiryEmailPayload): string {
  const kindLabel = payload.source === "inquire" ? "Project inquiry" : "Discussion call";
  const extras = (payload.extras ?? [])
    .map((e) => row(e.label, e.value))
    .join("");

  const messageHtml = escapeHtml(payload.message).replace(/\n/g, "<br/>");

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
            <p style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.5;color:rgba(243,242,242,0.75);">${escapeHtml(kindLabel)} from the website</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;background:${BRAND.beige};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row("Name", payload.name)}
              ${row("Email", payload.email)}
              ${row("Phone", payload.phone)}
              ${row("Service", payload.service)}
              ${row("Location", payload.location)}
              ${row("Budget", payload.budget)}
              ${row("Preferred date", payload.preferred_date)}
              ${extras}
            </table>
            <p style="margin:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.terracotta};">Message</p>
            <div style="padding:16px;background:#ffffff;border-left:3px solid ${BRAND.gold};font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.65;color:${BRAND.charcoal};">${messageHtml}</div>
            <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:rgba(47,42,40,0.65);">Reply directly to this email to reach <strong style="color:${BRAND.charcoal};">${escapeHtml(payload.name)}</strong> at ${escapeHtml(payload.email)}.</p>
          </td>
        </tr>
        <tr>
          <td style="background:${BRAND.chestnut};padding:18px 28px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:rgba(243,242,242,0.7);">Also saved in Studio → Inquiries · <a href="https://www.mgcarchitecture.com/studio/inquiries" style="color:${BRAND.gold};text-decoration:none;">Open studio</a></p>
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
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
  ];
  if (payload.phone) lines.push(`Phone: ${payload.phone}`);
  if (payload.service) lines.push(`Service: ${payload.service}`);
  if (payload.location) lines.push(`Location: ${payload.location}`);
  if (payload.budget) lines.push(`Budget: ${payload.budget}`);
  if (payload.preferred_date) lines.push(`Preferred date: ${payload.preferred_date}`);
  for (const e of payload.extras ?? []) lines.push(`${e.label}: ${e.value}`);
  lines.push("", "Message:", payload.message, "", "—", "Also in Studio → Inquiries");
  return lines.join("\n");
}

export type SendInquiryEmailResult =
  | { ok: true; provider: "resend" | "formsubmit" | "dry-run"; id?: string }
  | { ok: false; error: string };

/**
 * Send branded inquiry mail to the studio Gmail.
 * Prefer Resend (RESEND_API_KEY); fall back to FormSubmit so delivery still works.
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
    const from =
      process.env.INQUIRY_FROM_EMAIL?.trim() ||
      "MGC Architecture <onboarding@resend.dev>";
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
    };
    if (!res.ok) {
      return {
        ok: false,
        error: body.message || `Resend HTTP ${res.status}`,
      };
    }
    return { ok: true, provider: "resend", id: body.id };
  }

  // Zero-config fallback → studio Gmail (activate once via confirmation email).
  // FormSubmit rejects bare server calls without a browser-like Origin/Referer.
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
    // First-time setup: FormSubmit emails an Activate link to the studio Gmail.
    if (/activ/i.test(msg)) {
      return {
        ok: false,
        error:
          "FormSubmit activation required — open mgcarchitectureph@gmail.com and click Activate Form, or set RESEND_API_KEY for branded delivery.",
      };
    }
    return { ok: false, error: msg };
  }

  return { ok: true, provider: "formsubmit" };
}
