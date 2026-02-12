import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const frameworksData = [
  { name: "ISO 27001:2022", version: "2022", description: "Information security management systems requirements.", frameworkType: "standard", region: "global" },
  { name: "SOC 2 Type II", version: "2024", description: "Trust services criteria for service organizations.", frameworkType: "standard", region: "global" },
  { name: "GDPR", version: "2018", description: "EU General Data Protection Regulation.", frameworkType: "regulation", region: "EU" },
]

const controlsData = [
  { frameworkName: "ISO 27001:2022", controlRef: "A.5.1", title: "Policies for information security", description: "Management direction for information security.", category: "Governance" },
  { frameworkName: "ISO 27001:2022", controlRef: "A.5.2", title: "Information security roles and responsibilities", description: "Roles and responsibilities shall be defined.", category: "Governance" },
  { frameworkName: "ISO 27001:2022", controlRef: "A.6.1", title: "Screening", description: "Background verification checks.", category: "People" },
  { frameworkName: "ISO 27001:2022", controlRef: "A.8.1", title: "User endpoint devices", description: "Protect information on endpoint devices.", category: "Technology" },
  { frameworkName: "ISO 27001:2022", controlRef: "A.8.9", title: "Configuration management", description: "Configurations established and documented.", category: "Technology" },
  { frameworkName: "SOC 2 Type II", controlRef: "CC6.1", title: "Logical and physical access controls", description: "Logical access security over protected assets.", category: "Access Control" },
  { frameworkName: "SOC 2 Type II", controlRef: "CC6.3", title: "Role-based access", description: "Authorize access based on roles.", category: "Access Control" },
  { frameworkName: "SOC 2 Type II", controlRef: "CC7.2", title: "Monitoring for anomalies", description: "Monitor for malicious acts.", category: "Monitoring" },
  { frameworkName: "SOC 2 Type II", controlRef: "CC8.1", title: "Change management", description: "Authorize and implement changes.", category: "Change Management" },
  { frameworkName: "GDPR", controlRef: "Art.5", title: "Principles relating to processing", description: "Lawful, fair, transparent processing.", category: "Data Protection" },
  { frameworkName: "GDPR", controlRef: "Art.25", title: "Data protection by design", description: "Technical and organisational measures.", category: "Data Protection" },
  { frameworkName: "GDPR", controlRef: "Art.32", title: "Security of processing", description: "Appropriate security measures.", category: "Security" },
  { frameworkName: "GDPR", controlRef: "Art.33", title: "Notification of personal data breach", description: "Notify supervisory authority.", category: "Incident Response" },
]

async function main() {
  for (const fw of frameworksData) {
    await prisma.framework.upsert({
      where: { name: fw.name },
      create: fw,
      update: {},
    })
  }
  const frameworks = await prisma.framework.findMany()
  for (const c of controlsData) {
    const framework = frameworks.find((f) => f.name === c.frameworkName)
    if (!framework) continue
    await prisma.control.upsert({
      where: {
        frameworkId_controlRef: { frameworkId: framework.id, controlRef: c.controlRef },
      },
      create: {
        frameworkId: framework.id,
        controlRef: c.controlRef,
        title: c.title,
        description: c.description,
        category: c.category,
      },
      update: {},
    })
  }
  console.log("Seed: Frameworks and controls created.")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
