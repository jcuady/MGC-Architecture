/**
 * Smoke-check annotated UI fixes (nav, inquire steps, scopes, finish levels placement).
 * Run: node scripts/verify-annotated-fixes.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), "utf8");

let failed = 0;
function ok(name, pass, detail = "") {
  if (pass) console.log(`✓ ${name}`);
  else {
    failed += 1;
    console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const content = read("src/lib/content.ts");
const navBlock = content.slice(content.indexOf("export const nav"), content.indexOf("];", content.indexOf("export const nav")) + 2);
ok("Nav: Blog before About", /Blog[\s\S]*About/.test(navBlock) && !/About[\s\S]*Blog/.test(navBlock));
ok(
  "Cost Estimation scopes",
  content.includes('"Residential estimates"') && content.includes('"Commercial estimates"'),
);
ok(
  "Design Documentation Need… scopes",
  content.includes("Need complete drawings") &&
    content.includes("Need assistance for permit") &&
    content.includes("Need to update existing drawing"),
);

const inquire = read("src/lib/inquire.ts");
ok("Inquire step renamed Inspiration & Details", inquire.includes('"Inspiration & Details"'));
ok("Other Details step removed from defaults", !inquire.includes('"Other Details"'));

const wizard = read("src/components/inquire/InquireWizard.tsx");
ok("Wizard: 6 STEP_KEYS (no details)", !wizard.includes('"details"') && wizard.includes('"inspiration"') && wizard.includes('"review"'));
ok("Wizard: property fields not gated on Yes", !wizard.includes('hasProperty === "Yes"'));
ok("Wizard: FileDropZone present", wizard.includes("function FileDropZone"));
ok("Wizard: professional notice", wizard.includes("professionalNotice"));

const header = read("src/components/Header.tsx");
ok("Header logo bumped", header.includes("h-9 w-9") && header.includes("sm:h-10 sm:w-10"));

const contact = read("src/components/sections/Contact.tsx");
ok("Contact: FB+IG in channel list", contact.includes("Facebook") && contact.includes("Instagram") && contact.includes("facebookHandle"));

const phases = read("src/components/process/ProcessPhases.tsx");
ok("Process phase list fonts bumped", phases.includes("text-base") && phases.includes("sm:text-[1.0625rem]"));

const blogSlug = read("src/app/blog/[slug]/page.tsx");
ok("Blog slug: Start a project removed from article CTA", !/Start a project/.test(blogSlug));
ok("Blog slug: More to read shows excerpt", blogSlug.includes("p.excerpt"));

const latest = read("src/components/sections/LatestArticles.tsx");
ok("LatestArticles: excerpt under title", latest.includes("item.excerpt"));
ok("LatestArticles: fluid heading type", latest.includes("clamp(1.75rem"));
ok("LatestArticles: safe-zone max-w-7xl", latest.includes("max-w-7xl") && latest.includes("lg:px-10"));
ok("LatestArticles: responsive grid 1/2/4", latest.includes("grid-cols-1") && latest.includes("sm:grid-cols-2") && latest.includes("lg:grid-cols-4"));
ok("LatestArticles: uniform aspect-ratio images", latest.includes("aspect-[3/4]") && latest.includes("object-cover") && !latest.includes("max-h-["));
ok("LatestArticles: no horizontal pin scroll", !latest.includes("articles-horizontal") && !latest.includes("useGSAP"));
ok("LatestArticles: heading above grid (z-10 header)", latest.includes('header className="relative z-10"'));

const blogDefaults = read("src/lib/blog.ts");
ok("Blog covers: blog-01", blogDefaults.includes("/blog/blog-01-before-you-build.png"));
ok("Blog covers: blog-02", blogDefaults.includes("/blog/blog-02-mistakes-to-avoid.jpg"));
ok("Blog covers: blog-03", blogDefaults.includes("/blog/blog-03-from-ideas-to-reality.png"));
ok("Blog covers: blog-04", blogDefaults.includes("/blog/blog-04-budget.jpg"));
ok("Blog asset blog-01 on disk", existsSync(join(root, "public/blog/blog-01-before-you-build.png")));
ok("Blog asset blog-02 on disk", existsSync(join(root, "public/blog/blog-02-mistakes-to-avoid.jpg")));
ok("Blog asset blog-03 on disk", existsSync(join(root, "public/blog/blog-03-from-ideas-to-reality.png")));
ok("Blog asset blog-04 on disk", existsSync(join(root, "public/blog/blog-04-budget.jpg")));

const processPage = read("src/app/process/page.tsx");
const estimatePage = read("src/app/estimate/page.tsx");
ok("Process page has no FinishLevels", !processPage.includes("FinishLevels"));
ok("Estimate page has FinishLevels", estimatePage.includes("FinishLevels"));

const about = read("src/components/sections/About.tsx");
ok("About homepage is teaser (Learn More → /about)", about.includes('href="/about"') && about.includes("learnMoreLabel"));
ok("About homepage has no Education/Awards credentials UI", !about.includes("Education") && !about.includes("Awards") && !about.includes("data-about-credentials"));
ok("AboutSticky deleted", !existsSync(join(root, "src/components/sections/AboutSticky.tsx")));
ok("About page has credentials component", existsSync(join(root, "src/components/about/AboutCredentials.tsx")));
const aboutPage = read("src/app/about/page.tsx");
ok("About page See Works + justified", aboutPage.includes("See Works") && aboutPage.includes("text-justify") && aboutPage.includes("AboutCredentials"));

const processSection = read("src/components/sections/Process.tsx");
ok("Process teaser shows step time", processSection.includes("step.time"));
ok("Process CTA Explore the full process", content.includes("Explore the full process"));
ok(
  "Process step copy matches overview",
  content.includes("Understanding project goals. Site assessment") &&
    content.includes('time: "1-2 Weeks"'),
);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nAll annotated-fix checks passed.");
