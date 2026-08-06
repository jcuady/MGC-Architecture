/**
 * Inquiry email branding + notify address.
 * Usage: node scripts/verify-inquiry-email.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.argv[2] || "http://127.0.0.1:3847";
let failed = 0;

function ok(label, pass, detail = "") {
  if (pass) console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const notifySrc = readFileSync(
  resolve("src/lib/inquiry-notify.ts"),
  "utf8",
);
const routeSrc = readFileSync(
  resolve("src/app/api/inquiries/route.ts"),
  "utf8",
);
const contactSrc = readFileSync(
  resolve("src/components/InquiryForm.tsx"),
  "utf8",
);
const inquireSrc = readFileSync(
  resolve("src/components/inquire/InquireWizard.tsx"),
  "utf8",
);

ok(
  "default notify address is studio Gmail",
  notifySrc.includes('"mgcarchitectureph@gmail.com"'),
);
ok("brand chestnut in HTML email", notifySrc.includes("#753627"));
ok("brand gold accent in HTML email", notifySrc.includes("#C89B4B"));
ok("brand beige surface in HTML email", notifySrc.includes("#F1E8DE"));
ok("brand charcoal body in HTML email", notifySrc.includes("#2F2A28"));
ok("email uses Resend API", notifySrc.includes("api.resend.com/emails"));
ok("email has FormSubmit fallback to Gmail", notifySrc.includes("formsubmit.co/ajax"));
ok("API route sends inquiry email", routeSrc.includes("sendInquiryEmail"));
ok("contact form posts to /api/inquiries", contactSrc.includes('"/api/inquiries"'));
ok("inquire wizard posts to /api/inquiries", inquireSrc.includes('"/api/inquiries"'));
ok(
  "forms no longer insert inquiries client-side",
  !contactSrc.includes('.from("inquiries")') &&
    !inquireSrc.includes('.from("inquiries")'),
);

// Build a sample HTML via dynamic import of compiled... use inline mirror of brand checks + live API dry path
const sample = {
  source: "contact",
  name: "Verify Bot",
  email: "verify@example.com",
  phone: "09560753154",
  message: "Automated branding check — ignore.",
  consent: true,
  extras: [{ label: "Contact method", value: "Email" }],
  company: "",
};

const health = await fetch(`${BASE}/api/inquiries`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(sample),
});
const body = await health.json().catch(() => ({}));
ok(
  `POST /api/inquiries → 200 (got ${health.status})`,
  health.status === 200,
  JSON.stringify(body).slice(0, 160),
);
ok(
  "API reports ok",
  body.ok === true,
);

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nInquiry email checks passed");
if (body.emailed === false) {
  console.log(
    "NOTE  Email provider reported failure (inquiry still saved). Check FormSubmit activation or set RESEND_API_KEY.",
  );
  console.log(`      emailError: ${body.emailError ?? "(none)"}`);
} else if (body.provider) {
  console.log(`NOTE  Email provider: ${body.provider}`);
}
