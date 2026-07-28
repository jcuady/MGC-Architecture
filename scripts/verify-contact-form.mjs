// Smoke-check: Contact architect revisions
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const idx = html.indexOf('id="contact"');
const slice = idx >= 0 ? html.slice(idx, idx + 25000) : "";

check("contact section", idx >= 0);
check("eyebrow Contact", slice.includes(">Contact<") || slice.includes("Contact</p>"));
check("title Let's talk", /Let(&#x27;|')s talk/i.test(slice));
check("old share details gone", !slice.includes("Share a few details"));
check("we're here to help", /We(&#x27;|')re here to help/i.test(slice));
check("prepare note removed", !slice.includes("Helpful to prepare"));
check("Discussion call for free", slice.includes("Discussion call for free"));
check("Contact info label", slice.includes("Contact info"));
check("Book a consultation gone", !slice.includes("Book a consultation"));
check("Project Details gone", !slice.includes("Project Details"));
check("location field gone", !slice.includes("Project location") && !slice.includes("inq-location"));
check("budget field gone", !slice.includes("Estimated budget") && !slice.includes("inq-budget"));
check("property field gone", !slice.includes("Do you have a property?"));
check("date calendar input", slice.includes('type="date"') || slice.includes("type=date"));
check("project message kept", slice.includes("Tell us about your project"));
check("Facebook compressed", slice.includes("Facebook"));
check("Instagram compressed", slice.includes("Instagram"));

console.log(failures === 0 ? "\nCONTACT FORM OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
