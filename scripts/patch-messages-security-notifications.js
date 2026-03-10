const fs = require("fs");
const path = require("path");

const securityNotifications = {
  fr: {
    security: {
      expires: "Expire",
      noCertifications: "Aucune certification en base. Ajoutez via admin ou seed.",
      certificationsTab: "Certifications",
      dataResidencyTab: "Résidence des données",
      policiesTab: "Politiques de sécurité",
      complianceCertifications: "Certifications de conformité",
      fromOrg: "De votre organisation",
      dataResidencyTitle: "Résidence des données et chiffrement",
      dataResidencyDesc: "Configurer dans les paramètres de l'organisation",
      dataResidencyBody: "La résidence des données et le chiffrement sont configurés au niveau de l'organisation dans la base.",
      securityPolicies: "Politiques de sécurité",
      noPolicies: "Aucune politique de sécurité en base.",
      metricCertifications: "Certifications",
      metricPolicies: "Politiques de sécurité",
      metricActivePolicies: "Politiques actives",
      metricAuth: "Auth",
      credentials: "Identifiants",
    },
    notifications: { title: "Notifications", markAllRead: "Tout marquer comme lu", noNotifications: "Aucune notification" },
  },
  es: {
    security: {
      expires: "Expira",
      noCertifications: "Sin certificaciones en la base de datos. Añada vía admin o seed.",
      certificationsTab: "Certificaciones",
      dataResidencyTab: "Residencia de datos",
      policiesTab: "Políticas de seguridad",
      complianceCertifications: "Certificaciones de cumplimiento",
      fromOrg: "De su organización",
      dataResidencyTitle: "Residencia de datos y cifrado",
      dataResidencyDesc: "Configurar en ajustes de la organización",
      dataResidencyBody: "La residencia de datos y el cifrado se configuran a nivel de organización en la base de datos.",
      securityPolicies: "Políticas de seguridad",
      noPolicies: "Sin políticas de seguridad en la base de datos.",
      metricCertifications: "Certificaciones",
      metricPolicies: "Políticas de seguridad",
      metricActivePolicies: "Políticas activas",
      metricAuth: "Auth",
      credentials: "Credenciales",
    },
    notifications: { title: "Notificaciones", markAllRead: "Marcar todo como leído", noNotifications: "Sin notificaciones" },
  },
  tr: {
    security: {
      expires: "Bitiş",
      noCertifications: "Veritabanında sertifika yok. Admin veya seed ile ekleyin.",
      certificationsTab: "Sertifikalar",
      dataResidencyTab: "Veri konumu",
      policiesTab: "Güvenlik politikaları",
      complianceCertifications: "Uyumluluk sertifikaları",
      fromOrg: "Kuruluşunuzdan",
      dataResidencyTitle: "Veri konumu ve şifreleme",
      dataResidencyDesc: "Kuruluş ayarlarından yapılandırın",
      dataResidencyBody: "Veri konumu ve şifreleme veritabanında kuruluş düzeyinde yapılandırılır.",
      securityPolicies: "Güvenlik politikaları",
      noPolicies: "Veritabanında güvenlik politikası yok.",
      metricCertifications: "Sertifikalar",
      metricPolicies: "Güvenlik politikaları",
      metricActivePolicies: "Aktif politikalar",
      metricAuth: "Auth",
      credentials: "Kimlik bilgileri",
    },
    notifications: { title: "Bildirimler", markAllRead: "Tümünü okundu işaretle", noNotifications: "Bildirim yok" },
  },
};

const dir = path.join(__dirname, "..", "messages");
for (const [locale, patch] of Object.entries(securityNotifications)) {
  const filePath = path.join(dir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!data.security) data.security = {};
  Object.assign(data.security, patch.security);
  data.notifications = patch.notifications;
  fs.writeFileSync(filePath, JSON.stringify(data));
}
console.log("Patched fr, es, tr with security and notifications keys.");
