const path = require("path");
const fs = require("fs");

function getNested(obj, keyPath) {
  return keyPath.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

const LANDING_KEYS = [
  "landing.brandName",
  "landing.nav.guide",
  "landing.nav.docs",
  "landing.nav.login",
  "landing.nav.register",
  "landing.hero.badgeOpenSource",
  "landing.hero.badgeFree",
  "landing.hero.title1",
  "landing.hero.title2",
  "landing.hero.subtitle",
  "landing.hero.ctaStart",
  "landing.hero.ctaLogin",
  "landing.hero.footerNote",
  "landing.why.title",
  "landing.why.problem",
  "landing.why.solution",
  "landing.why.problemDesc",
  "landing.why.solutionDesc",
  "landing.features.title",
  "landing.features.subtitle",
  "landing.features.dashboard",
  "landing.features.dashboardDesc",
  "landing.features.trackSources",
  "landing.features.trackSourcesDesc",
  "landing.features.detectChanges",
  "landing.features.detectChangesDesc",
  "landing.features.mapControls",
  "landing.features.mapControlsDesc",
  "landing.features.generateTasks",
  "landing.features.generateTasksDesc",
  "landing.features.collectEvidence",
  "landing.features.collectEvidenceDesc",
  "landing.features.auditPacks",
  "landing.features.auditPacksDesc",
  "landing.features.aiTitle",
  "landing.features.aiSubtitle",
  "landing.features.normalize",
  "landing.features.normalizeDesc",
  "landing.features.map",
  "landing.features.mapDesc",
  "landing.features.evidenceGen",
  "landing.features.evidenceGenDesc",
  "landing.features.openSourceTitle",
  "landing.features.openSourceDesc",
  "landing.features.openSourceCta",
  "landing.features.openSourceLogin",
  "landing.features.securityTitle",
  "landing.features.securityDesc",
  "landing.features.auth",
  "landing.features.https",
  "landing.features.dataEncryption",
  "landing.features.auditLogs",
  "landing.features.gdpr",
  "landing.features.soc2Hipaa",
  "landing.features.faqTitle",
  "landing.features.faqFreeQ",
  "landing.features.faqFreeA",
  "landing.features.faqDataQ",
  "landing.features.faqDataA",
  "landing.features.faqExportQ",
  "landing.features.faqExportA",
  "landing.features.faqLangQ",
  "landing.features.faqLangA",
  "landing.features.finalCtaTitle",
  "landing.features.finalCtaSubtitle",
  "landing.features.finalCtaButton",
  "landing.features.footerGuide",
  "landing.features.footerDocs",
  "landing.features.footerLogin",
  "landing.features.footerRegister",
  "landing.features.footerDot",
  "landing.features.footerLicense",
  "landing.features.footerTagline",
  "landing.features.footerSupport",
];

const LOCALES = ["en", "fr", "es", "tr"];
const messagesDir = path.join(__dirname, "..", "messages");

let hasError = false;
for (const locale of LOCALES) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const raw = fs.readFileSync(filePath, "utf8");
  let messages;
  try {
    messages = JSON.parse(raw);
  } catch (e) {
    console.error(`[${locale}] JSON parse error:`, e.message);
    hasError = true;
    continue;
  }
  const missing = [];
  const empty = [];
  for (const key of LANDING_KEYS) {
    const value = getNested(messages, key);
    if (value === undefined) missing.push(key);
    else if (typeof value !== "string" || value.trim() === "") empty.push(key);
  }
  if (missing.length) {
    console.error(`[${locale}] Eksik anahtarlar: ${missing.join(", ")}`);
    hasError = true;
  }
  if (empty.length) {
    console.error(`[${locale}] Boş anahtarlar: ${empty.join(", ")}`);
    hasError = true;
  }
}

if (!hasError) {
  console.log("Tanıtım sayfası: Tüm diller (en, fr, es, tr) eksiksiz destekleniyor.");
  console.log("Toplam", LANDING_KEYS.length, "anahtar x 4 dil = hepsi mevcut ve dolu.");
}

process.exit(hasError ? 1 : 0);
