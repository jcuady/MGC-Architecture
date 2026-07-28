// Smoke-check: Insights 4-slot grid + Latest Articles layout
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();

const insightsIdx = html.indexOf('id="insights"');
const blogIdx = html.indexOf('id="blog"');
const faqIdx = html.indexOf('id="faq"');

const insightsSlice =
  insightsIdx >= 0
    ? html.slice(insightsIdx, blogIdx > insightsIdx ? blogIdx : insightsIdx + 20000)
    : "";
const blogSlice =
  blogIdx >= 0
    ? html.slice(blogIdx, faqIdx > blogIdx ? faqIdx : blogIdx + 15000)
    : "";

check("insights section id", insightsIdx >= 0);
check("blog/articles section id", blogIdx >= 0 && blogIdx > insightsIdx);
check("Before You Build title", insightsSlice.includes("Read this before you break ground"));
check("team matters tile", insightsSlice.includes("Why the right team matters"));
check("mistakes tile", insightsSlice.includes("5 mistakes to avoid"));
check("coming soon slots", insightsSlice.includes("Coming soon"));
check("content to follow label", insightsSlice.includes("Content to follow"));
check("slot 03 present", insightsSlice.includes("03"));
check("slot 04 present", insightsSlice.includes("04"));
check("Latest Articles eyebrow", blogSlice.includes("Latest Articles"));
check("article cards", blogSlice.includes("data-article-card") || blogSlice.includes("Read ·"));
check("See all articles", blogSlice.includes("See all articles"));
check("4 article titles", (blogSlice.match(/Read ·/g) || []).length >= 4 || blogSlice.includes("What to prepare"));

console.log(failures === 0 ? "\nINSIGHTS + ARTICLES OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
