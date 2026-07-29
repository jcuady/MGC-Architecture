import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const header = readFileSync(join(root, "src/components/Header.tsx"), "utf8");
const sitemap = readFileSync(join(root, "src/app/sitemap.ts"), "utf8");

const expected = [
  { label: "Works", href: "/work", page: "src/app/work/page.tsx" },
  { label: "Process", href: "/process", page: "src/app/process/page.tsx" },
  { label: "Inquire", href: "/inquire", page: "src/app/inquire/page.tsx" },
  { label: "Cost Calculator", href: "/estimate", page: "src/app/estimate/page.tsx" },
  { label: "FAQ", href: "/faq", page: "src/app/faq/page.tsx" },
  { label: "About", href: "/about", page: "src/app/about/page.tsx" },
  { label: "Blog", href: "/blog", page: "src/app/blog/page.tsx" },
];

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const navStart = content.indexOf("export const nav");
const navBlock = content.slice(navStart, content.indexOf("];", navStart) + 2);

for (const item of expected) {
  check(
    `nav ${item.label} → ${item.href}`,
    navBlock.includes(`label: "${item.label}"`) && navBlock.includes(`href: "${item.href}"`),
  );
  check(`page exists ${item.href}`, existsSync(join(root, item.page)));
}

check("Contact CTA → /contact", header.includes('href="/contact"') && !header.includes("/#contact"));
check("no hash nav leftovers", !navBlock.includes("/#"));
check("sitemap lists /work /faq /about /contact", ["/work", "/faq", "/about", "/contact"].every((p) => sitemap.includes(`\${BASE}${p}`)));
check("contact page exists", existsSync(join(root, "src/app/contact/page.tsx")));

console.log(failures === 0 ? "\nHEADER NAV PAGES OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
