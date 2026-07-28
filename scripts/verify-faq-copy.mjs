// Smoke-check: FAQ architect copy revision
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const faqIdx = html.indexOf('id="faq"');
const contactIdx = html.indexOf('id="contact"', faqIdx + 1);
const slice =
  faqIdx >= 0
    ? html.slice(faqIdx, contactIdx > faqIdx ? contactIdx : faqIdx + 8000)
    : "";

check("faq section present", faqIdx >= 0);
check("title Got questions?", slice.includes("Got questions?"));
check("old title gone", !slice.includes("Answers before you ask"));
check(
  "new lede",
  slice.includes("Find quick answers to common questions about costs, timeline, permits"),
);
check("old lede gone", !slice.includes("The questions most clients start with"));
check("accordion still present", slice.includes("How much does a project cost?"));

console.log(failures === 0 ? "\nFAQ COPY OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
