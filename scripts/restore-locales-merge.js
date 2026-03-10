const fs = require("fs");
const path = require("path");

function deepMergeStrings(target, source) {
  const out = {};
  for (const key of new Set([...Object.keys(target), ...Object.keys(source)])) {
    const t = target[key];
    const s = source[key];
    if (s != null && typeof s === "object" && !Array.isArray(s) && typeof t === "object" && t != null && !Array.isArray(t)) {
      out[key] = deepMergeStrings(t, s);
    } else if (s !== undefined) {
      out[key] = s;
    } else {
      out[key] = t;
    }
  }
  return out;
}

const messagesDir = path.join(__dirname, "..", "messages");
const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));

for (const locale of ["fr", "es", "tr"]) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  let current;
  try {
    current = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`${locale}.json parse error:`, e.message);
    continue;
  }
  const merged = deepMergeStrings(en, current);
  fs.writeFileSync(filePath, JSON.stringify(merged));
  const enKeys = countLeaves(en);
  const mergedKeys = countLeaves(merged);
  console.log(`${locale}: merged, ${mergedKeys} keys (en has ${enKeys}).`);
}

function countLeaves(obj) {
  let n = 0;
  for (const v of Object.values(obj)) {
    if (v != null && typeof v === "object" && !Array.isArray(v)) n += countLeaves(v);
    else n += 1;
  }
  return n;
}
