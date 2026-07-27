/**
 * Self-check: mergeSection schema prune + TextStyle shell additive keys.
 * Run: node scripts/verify-cms-merge.mjs
 */
const TEXT_STYLE_KEYS = new Set(["font", "italic", "size"]);

function isTextStyleShell(obj) {
  return Object.keys(obj).every((k) => TEXT_STYLE_KEYS.has(k));
}

function mergeSection(defaults, stored) {
  if (
    typeof defaults !== "object" ||
    defaults === null ||
    Array.isArray(defaults) ||
    typeof stored !== "object" ||
    stored === null ||
    Array.isArray(stored)
  ) {
    return stored ?? defaults;
  }
  const out = { ...defaults };
  for (const [key, value] of Object.entries(stored)) {
    if (key in out) {
      out[key] = mergeSection(out[key], value);
    } else if (isTextStyleShell(out) && TEXT_STYLE_KEYS.has(key)) {
      out[key] = value;
    }
  }
  return out;
}

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const defaults = {
  line1: "Design with Purpose.",
  image: "/portfolio/the-noir/the-noir-living-view-1.png",
  secondaryCta: "Start a project",
  styles: { line1: {}, lede: {} },
};

const merged = mergeSection(defaults, {
  line1: "CMS Override",
  primaryCta: "DEAD FIELD",
  proofStat: "99+",
  styles: { line1: { font: "body", size: 72, italic: true }, lede: { size: 20 } },
});

check("keeps CMS override for live fields", merged.line1 === "CMS Override");
check("drops removed schema keys (primaryCta)", !("primaryCta" in merged));
check("drops removed schema keys (proofStat)", !("proofStat" in merged));
check("TextStyle font still merges", merged.styles.line1.font === "body");
check("TextStyle size still merges", merged.styles.line1.size === 72);
check("TextStyle italic still merges", merged.styles.line1.italic === true);
check("lede size still merges", merged.styles.lede.size === 20);
check("defaults fill missing keys", merged.secondaryCta === "Start a project");

console.log(failures === 0 ? "\nCMS MERGE OK" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
