const fs = require("fs");
const path = require("path");

const messagesDir = path.join(__dirname, "..", "messages");

// Duplicate block in fr/es/tr: second occurrence of sidebar (English) through docs (English).
// We remove from ,"sidebar":{"reglens":"RegLens","tagline":"Regulatory Intelligence","monitor":"Monitor"
// to "diagramDeployment":"Deployment components"}}  (inclusive), so the first (translated) block remains.
const DUPLICATE_START = ',"sidebar":{"reglens":"RegLens","tagline":"Regulatory Intelligence","monitor":"Monitor"';
const DUPLICATE_END = '"diagramDeployment":"Deployment components"}}';

for (const locale of ["fr", "es", "tr"]) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  let s = fs.readFileSync(filePath, "utf8");
  const idx = s.indexOf(DUPLICATE_START);
  if (idx === -1) {
    console.log(`${locale}: no duplicate block found, skip.`);
    continue;
  }
  const endIdx = s.indexOf(DUPLICATE_END, idx);
  if (endIdx === -1) {
    console.log(`${locale}: end marker not found, skip.`);
    continue;
  }
  const removeEnd = endIdx + DUPLICATE_END.length;
  s = s.slice(0, idx) + s.slice(removeEnd);
  fs.writeFileSync(filePath, s);
  console.log(`${locale}: removed duplicate English block.`);
}
