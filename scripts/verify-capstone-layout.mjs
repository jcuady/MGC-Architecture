import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = readFileSync(join(root, "src/lib/content.ts"), "utf8");
const page = readFileSync(join(root, "src/app/work/[slug]/page.tsx"), "utf8");
const layout = readFileSync(
  join(root, "src/components/work/CapstoneCaseStudy.tsx"),
  "utf8",
);
const block = content.slice(content.indexOf('slug: "capstone"'));

let failures = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failures++;
}

check("CapstoneCaseStudy type exists", content.includes("export type CapstoneCaseStudy"));
check("capstone project has capstone layout data", block.includes("capstone: {"));
check("2x2 grid has 4 images", (block.match(/exterior-view-[1-4]\.png/g) || []).length >= 4);
check("problem diagram", block.includes("archi-capstone-design-problem.png"));
check("approach diagram", block.includes("archi-capstone-design-approach.png"));
check("classroom interior", block.includes("archi-capstone-interior-view-.png"));
check("strategy diagrams", block.includes("archi-capstone-design-strategy-1.png") && block.includes("archi-capstone-design-strategy-2.png"));
check("axonometric / material key", block.includes("archi-capstone-axonometric-view-1.png"));
check("feature image 6", block.includes("archi-capstone-exterior-view-5.png"));
check("closing pair", block.includes("archi-capstone-exterior-view-6.png") && block.includes("archi-capstone-interior-view-1.png"));
check("problem copy from fact sheet", block.includes("overcrowded classrooms, poor ventilation"));
check("approach copy from fact sheet", block.includes("Needs, Design, and Comfort"));
check("strategy copy from fact sheet", block.includes("thermal comfort inside the classrooms"));
check("intro story is short (not dumping strategy)", !block.includes('story:') || (() => {
  const m = block.match(/story:\s*"([^"]*)"/);
  return m ? !m[1].includes("solar analysis") : false;
})());
check("page imports CapstoneCaseStudy", page.includes('from "@/components/work/CapstoneCaseStudy"'));
check("page branches on showCapstone", page.includes("showCapstone") && page.includes("<CapstoneCaseStudy"));
check("layout has problem | approach zig-zag", layout.includes("capstone-problem") && layout.includes("capstone-approach"));
check("layout has strategy 3-up", layout.includes("sm:grid-cols-3") && layout.includes("Axonometric / material key"));
check("layout has classroom + feature + closing", layout.includes("Inside classroom view") && layout.includes("closing"));

const assets = [
  "archi-capstone-exterior-view-1.png",
  "archi-capstone-exterior-view-2.png",
  "archi-capstone-exterior-view-3.png",
  "archi-capstone-exterior-view-4.png",
  "archi-capstone-exterior-view-5.png",
  "archi-capstone-exterior-view-6.png",
  "archi-capstone-interior-view-.png",
  "archi-capstone-interior-view-1.png",
  "archi-capstone-design-problem.png",
  "archi-capstone-design-approach.png",
  "archi-capstone-design-strategy-1.png",
  "archi-capstone-design-strategy-2.png",
  "archi-capstone-axonometric-view-1.png",
];
check(
  "all layout assets present on disk",
  assets.every((f) => existsSync(join(root, "public/portfolio/capstone", f))),
);

console.log(failures === 0 ? "\nCAPSTONE CASE-STUDY LAYOUT OK" : `\n${failures} FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
