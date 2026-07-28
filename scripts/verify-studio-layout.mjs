// Smoke-check: architect studio statement split (no Approach/Process/Promise)
const BASE = process.env.BASE_URL ?? "http://localhost:3847";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

function splitStatement(statement) {
  const parts = statement.split(/\s*[—–]\s*/);
  if (parts.length < 2) return [statement, ""];
  return [parts[0].trim(), parts.slice(1).join(" — ").trim()];
}

const sample =
  "We believe the best spaces begin with listening to the people who will use them — this collection showcases selected architectural and interior design works, from concept to completion.";
const [lead, trail] = splitStatement(sample);
check("splits lead before dash", lead.startsWith("We believe the best spaces"));
check("splits trail after dash", trail.startsWith("this collection showcases"));
check("lead has no em dash", !lead.includes("—"));

const html = await (await fetch(`${BASE}/`, { cache: "no-store" })).text();
check("studio seq markers present", html.includes('data-studio-seq="1"') && html.includes('data-studio-seq="2"'));
check("Approach column removed", !html.includes(">Approach<") && !html.includes("APPROACH"));
check("Process value-point removed from studio", !html.includes("Every project begins with understanding how you live"));
check("Promise column removed", !html.includes("We'll guide you through every step with clear communication"));
check("lead copy on page", html.includes("listening to the people who will use them"));
check("trail copy on page", html.includes("this collection showcases selected architectural"));

console.log(failures === 0 ? "\nSTUDIO LAYOUT OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
