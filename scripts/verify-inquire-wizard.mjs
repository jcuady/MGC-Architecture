import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3847";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const home = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const inquire = await (await fetch(`${BASE}/inquire`, { cache: "no-store" })).text();
const withCat = await (
  await fetch(`${BASE}/inquire?category=${encodeURIComponent("Architectural Design")}`, {
    cache: "no-store",
  })
).text();

const cmsSrc = readFileSync(join(root, "src/lib/cms.ts"), "utf8");
const navSrc = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const inquireLib = readFileSync(join(root, "src/lib/inquire.ts"), "utf8");
const previewSrc = readFileSync(join(root, "src/components/studio/SectionPreview.tsx"), "utf8");
const migration = readFileSync(join(root, "supabase/migrations/0005_inquire_wizard.sql"), "utf8");
const wizardSrc = readFileSync(join(root, "src/components/inquire/InquireWizard.tsx"), "utf8");
const revalidateSrc = readFileSync(join(root, "src/app/api/revalidate/route.ts"), "utf8");
const sitemapSrc = readFileSync(join(root, "src/app/sitemap.ts"), "utf8");

check("home loads", home.length > 2000);
check("inquire page loads", inquire.length > 2000);
check("inquire hero title", inquire.includes("Tell Us About Your Project"));
check("inquire has progress steps", inquire.includes("About You") && inquire.includes("Review"));
check("inquire has continue CTA", inquire.includes("Continue"));
check("category query still loads", withCat.length > 2000);

check("nav Inquire points to /inquire", navSrc.includes('{ label: "Inquire", href: "/inquire" }'));
check(
  "header inquire nav live",
  home.includes('href="/inquire"') || /href=\"\/inquire\"/.test(home),
);
check(
  "services CTA routes to inquire",
  home.includes("/inquire?category=") || cmsSrc.includes("/inquire?category="),
);
check(
  "cms registers inquire section",
  cmsSrc.includes("inquire: inquireDefaults") && cmsSrc.includes('label: "Inquire wizard"'),
);
check("studio preview has inquire case", previewSrc.includes('case "inquire"'));
check("migration adds payload column", migration.includes("payload jsonb"));
check("migration allows inquiry uploads", migration.includes("anon uploads inquiry attachments"));
check("wizard submits to inquiries", wizardSrc.includes('.from("inquiries").insert'));
check("wizard has consent gate", wizardSrc.includes("consent"));
check("wizard has progressbar", wizardSrc.includes('role="progressbar"'));
check("compile helper present", inquireLib.includes("export function compileInquireMessage"));
check("revalidate includes /inquire", revalidateSrc.includes('revalidatePath("/inquire")'));
check("sitemap includes /inquire", sitemapSrc.includes("/inquire"));

console.log(failures === 0 ? "\nINQUIRE WIZARD OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
