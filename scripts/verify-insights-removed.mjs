/**
 * Assert Before You Build immersive is gone; Latest Articles remains.
 * Usage: node scripts/verify-insights-removed.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
let failed = 0;
function ok(name, pass) {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}`);
  if (!pass) failed += 1;
}

const insights = readFileSync(join(root, "src/components/sections/Insights.tsx"), "utf8");
ok("Insights.tsx has no InsightsImmersive", !insights.includes("InsightsImmersive"));
ok("Insights.tsx renders LatestArticles", insights.includes("LatestArticles"));
ok("InsightsImmersive.tsx deleted", !existsSync(join(root, "src/components/sections/InsightsImmersive.tsx")));
ok("insights-chapters.ts deleted", !existsSync(join(root, "src/lib/insights-chapters.ts")));
ok("LatestArticles exists", existsSync(join(root, "src/components/sections/LatestArticles.tsx")));

console.log(failed === 0 ? "\nINSIGHTS REMOVAL OK" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
