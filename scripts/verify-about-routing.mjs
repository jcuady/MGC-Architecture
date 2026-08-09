/**
 * About teaser + /about routing.
 * Usage: node scripts/verify-about-routing.mjs [baseUrl]
 */
const BASE = process.argv[2] || process.env.BASE_URL || "http://127.0.0.1:3847";
let failures = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

const home = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
const aboutIdx = home.indexOf('id="about"');
const aboutSlice =
  aboutIdx >= 0
    ? home.slice(aboutIdx, aboutIdx + 12000)
    : "";

check("homepage has #about", aboutIdx >= 0);
check("teaser Learn More links to /about", /href="\/about"[^>]*>[\s\S]*?Learn More|Learn More[\s\S]*?href="\/about"/.test(aboutSlice) || aboutSlice.includes('href="/about"'));
check("teaser shows designer name", aboutSlice.includes("Mariane Gayle Caballero"));
check("homepage teaser has no Education column", !aboutSlice.includes(">Education<") && !aboutSlice.includes("Education</h3>"));
check("homepage teaser has no Awards column", !aboutSlice.includes("Awards") || !aboutSlice.includes("Awards &amp; Distinctions"));
check("no sticky about markers", !aboutSlice.includes("data-about-sticky") && !aboutSlice.includes("data-about-credentials"));
check("portrait asset present", aboutSlice.includes("professional-shot") || aboutSlice.includes("/about/"));

const aboutRes = await fetch(`${BASE}/about`, { cache: "no-store", redirect: "manual" });
check(`/about → 200`, aboutRes.status === 200, `got ${aboutRes.status}`);
const aboutHtml = await aboutRes.text();
check("about page headline", aboutHtml.includes("designer behind MGC Architecture"));
check("about page body copy", aboutHtml.includes("Magna Cum Laude"));
check("about page portrait", aboutHtml.includes("professional-shot") || aboutHtml.includes("/about/"));
check("about page See Works CTA", aboutHtml.includes("See Works") && aboutHtml.includes('href="/work"'));
check("about page justified bio", aboutHtml.includes("text-justify"));
check("about page credentials section", aboutHtml.includes("data-about-credentials") || aboutHtml.includes("Professional Experience"));
check("about credentials education", aboutHtml.includes("Education") && aboutHtml.includes("Pamantasan"));
check(
  "about credentials awards",
  aboutHtml.includes("Awards") &&
    (aboutHtml.includes("Dean's Lister") ||
      aboutHtml.includes("Dean&#x27;s Lister") ||
      aboutHtml.includes("Dean&apos;s Lister") ||
      aboutHtml.includes("Lister")),
);

console.log(failures === 0 ? "\nABOUT ROUTING OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
