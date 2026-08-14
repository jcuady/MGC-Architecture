/**
 * Site content CMS contract — SectionEditor upsert/reset + sectionMeta.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

const editor = readFileSync(
  join(root, "src/components/studio/SectionEditor.tsx"),
  "utf8",
);
const contentPage = readFileSync(
  join(root, "src/app/studio/(admin)/content/page.tsx"),
  "utf8",
);
const cms = readFileSync(join(root, "src/lib/cms.ts"), "utf8");
const cmsServer = readFileSync(join(root, "src/lib/cms-server.ts"), "utf8");

check("SectionEditor upserts site_content", editor.includes('.from("site_content").upsert'));
check("SectionEditor reset deletes row", editor.includes(".delete()"));
check("SectionEditor revalidates", editor.includes("/api/revalidate"));
check("content index lists sections", contentPage.includes("sectionMeta"));
check("work section points to Projects studio", cms.includes("Studio → Projects"));
check("getSiteContent merge", cmsServer.includes("getSiteContent") && cmsServer.includes("mergeSection"));

console.log(failures === 0 ? "\nSITE CONTENT CMS OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
