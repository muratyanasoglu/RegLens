const fs = require("fs");
const path = require("path");

function flattenToKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...flattenToKeys(v, key));
    } else if (typeof v === "string") {
      keys.push(key);
    }
  }
  return keys;
}

function getNested(obj, keyPath) {
  return keyPath.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

const messagesDir = path.join(__dirname, "..", "messages");
const locales = ["en", "fr", "es", "tr"];

const enRaw = fs.readFileSync(path.join(messagesDir, "en.json"), "utf8");
let en;
try {
  en = JSON.parse(enRaw);
} catch (e) {
  console.error("en.json parse error:", e.message);
  process.exit(1);
}

const allKeys = flattenToKeys(en);
console.log(`Reference (en): ${allKeys.length} string keys.\n`);

let hasError = false;
const reports = { fr: [], es: [], tr: [] };

for (const locale of ["fr", "es", "tr"]) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error(`${locale}.json: parse error -`, e.message);
    hasError = true;
    continue;
  }
  const missing = [];
  const empty = [];
  for (const key of allKeys) {
    const value = getNested(data, key);
    if (value === undefined) missing.push(key);
    else if (typeof value !== "string" || value.trim() === "") empty.push(key);
  }
  if (missing.length) reports[locale].push(`Eksik (${missing.length}): ${missing.slice(0, 15).join(", ")}${missing.length > 15 ? "..." : ""}`);
  if (empty.length) reports[locale].push(`Boş (${empty.length}): ${empty.slice(0, 10).join(", ")}${empty.length > 10 ? "..." : ""}`);
  if (missing.length || empty.length) hasError = true;
}

if (hasError) {
  console.log("Dil dosyalarında eksik veya boş anahtarlar:\n");
  for (const [loc, items] of Object.entries(reports)) {
    if (items.length) console.log(`[${loc}]`, items.join(" "), "\n");
  }
  process.exit(1);
}

console.log("Tüm diller eksiksiz: en, fr, es, tr için", allKeys.length, "anahtar mevcut ve dolu.");
process.exit(0);
