/**
 * Runtime HTML checks for annotated UI fixes.
 * Usage: node scripts/verify-runtime-annotated.mjs [baseUrl]
 */
const BASE = process.argv[2] || process.env.BASE_URL || "http://127.0.0.1:3847";
let failures = 0;

function ok(name, pass, detail = "") {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failures += 1;
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  return { status: res.status, html: await res.text() };
}

const home = await get("/");
const about = await get("/about");
const processPage = await get("/process");
const estimate = await get("/estimate");
const inquire = await get("/inquire");
const contact = await get("/contact");
const blog = await get("/blog");

const aboutIdx = home.html.indexOf('id="about"');
const aboutSlice = aboutIdx >= 0 ? home.html.slice(aboutIdx, aboutIdx + 14000) : "";
const processIdx = home.html.indexOf('id="process"');
const processSlice = processIdx >= 0 ? home.html.slice(processIdx, processIdx + 9000) : "";
const navMatch = home.html.match(/aria-label="Primary"[\s\S]*?<\/nav>/);
const nav = navMatch?.[0] ?? "";

const slugMatch = home.html.match(/href="\/blog\/([^"]+)"/);
const blogSlug = slugMatch?.[1] ?? null;
const blogPost = blogSlug ? await get(`/blog/${blogSlug}`) : null;

ok("home 200", home.status === 200);
ok("nav Blog before About", /Blog[\s\S]*About/.test(nav) && !/About[\s\S]*Blog/.test(nav));
ok(
  "about teaser has no Education/Awards",
  !/>Education</.test(aboutSlice) && !/Awards &amp; Distinctions/.test(aboutSlice),
);
ok("about teaser Learn More → /about", aboutSlice.includes('href="/about"') && /Learn More/.test(aboutSlice));
ok("/about 200", about.status === 200);
ok("/about headline", about.html.includes("designer behind MGC Architecture"));
ok(
  "/process has no Finish Levels block",
  !processPage.html.includes("Finish Level") && !processPage.html.includes("Cost Estimate Calculator"),
);
ok(
  "/estimate has finish levels",
  /Finish Level/i.test(estimate.html) || /Cost Estimate Calculator/i.test(estimate.html),
);
ok("/inquire 200", inquire.status === 200);
ok(
  "inquire Inspiration & Details",
  inquire.html.includes("Inspiration &amp; Details") || inquire.html.includes("Inspiration & Details"),
);
ok("inquire 6 steps (no Other Details)", !inquire.html.includes("Other Details"));
ok(
  "contact shows FB + IG handles",
  contact.status === 200 &&
    contact.html.includes("@mgcarchitecture") &&
    contact.html.includes("@mgcarchitectureph"),
);
ok("home process CTA", processSlice.includes("Explore the full process") || processSlice.includes("/process"));
ok("home process shows week durations", /1-2 Weeks/.test(processSlice));
ok("/blog 200", blog.status === 200);

if (blogPost) {
  ok(`blog post /${blogSlug} 200`, blogPost.status === 200);
  const dualCta =
    /All articles[\s\S]{0,500}Start a project/.test(blogPost.html) ||
    /Start a project[\s\S]{0,500}All articles/.test(blogPost.html);
  ok("blog article: no All articles + Start a project pair", !dualCta);
  ok("blog More to read present", blogPost.html.includes("More to read"));
} else {
  ok("blog slug found for deep check", false, "no /blog/slug on homepage");
}

console.log(failures === 0 ? "\nRUNTIME ANNOTATED OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
