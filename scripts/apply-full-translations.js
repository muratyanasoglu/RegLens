"use strict";
const fs = require("fs");
const path = require("path");

function deepMerge(target, source) {
  const out = {};
  for (const key of new Set([...Object.keys(target), ...Object.keys(source)])) {
    const t = target[key];
    const s = source[key];
    if (s != null && typeof s === "object" && !Array.isArray(s) && t != null && typeof t === "object" && !Array.isArray(t)) {
      out[key] = deepMerge(t, s);
    } else if (s !== undefined) {
      out[key] = s;
    } else {
      out[key] = t;
    }
  }
  return out;
}

const messagesDir = path.join(__dirname, "..", "messages");
const enPath = path.join(messagesDir, "en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

// Full overlays for fr, es, tr (only sections that differ from en)
const overlays = require("./full-translations-overlays.js");

for (const locale of ["fr", "es", "tr"]) {
  const overlay = overlays[locale];
  if (!overlay) continue;
  const outPath = path.join(messagesDir, `${locale}.json`);
  const current = fs.existsSync(outPath)
    ? JSON.parse(fs.readFileSync(outPath, "utf8"))
    : {};
  // Preserve existing translations, then apply explicit overlay overrides.
  const merged = deepMerge(deepMerge(en, current), overlay);
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 0));
  console.log(`Written ${locale}.json`);
}
console.log("Done. Run node scripts/check-all-locales.js to verify.");
