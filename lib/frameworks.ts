export type Framework = {
  id: string
  name: string
  shortCode: string
  version: string
  region: string
  description: string
  frameworkType: 'standard' | 'regulation' | 'industry' | 'custom'
  totalControls: number
  categories: string[]
}

export type FrameworkControl = {
  id: string
  frameworkId: string
  controlRef: string
  title: string
  description: string
  category: string
  implementationGuidance: string
  relatedControls: string[]
  riskLevel: 'critical' | 'high' | 'medium' | 'low'
}

export type FrameworkMapping = {
  sourceFramework: string
  targetFramework: string
  mappings: {
    sourceControl: string
    targetControls: string[]
    coverage: number // percentage
    gapDescription?: string
  }[]
  totalCoverage: number
}

export const frameworks: Framework[] = [
  {
    id: 'nist-csf',
    name: 'NIST Cybersecurity Framework',
    shortCode: 'NIST CSF',
    version: '1.1',
    region: 'global',
    description: 'US-based voluntary framework for critical infrastructure cybersecurity',
    frameworkType: 'standard',
    totalControls: 108,
    categories: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'],
  },
  {
    id: 'iso-27001',
    name: 'ISO/IEC 27001:2013',
    shortCode: 'ISO 27001',
    version: '2013',
    region: 'global',
    description: 'International Information Security Management System standard',
    frameworkType: 'standard',
    totalControls: 114,
    categories: ['Policies', 'Organization', 'HR Security', 'Asset Management', 'Access Control', 'Cryptography', 'Physical', 'Operations', 'Communications', 'System Acquisition', 'Supplier', 'Information Security Incident', 'Business Continuity', 'Compliance'],
  },
  {
    id: 'soc2-type2',
    name: 'SOC 2 Type II',
    shortCode: 'SOC 2',
    version: '2023',
    region: 'global',
    description: 'Service organization control audit for trust service principles',
    frameworkType: 'standard',
    totalControls: 85,
    categories: ['Security', 'Availability', 'Processing Integrity', 'Confidentiality', 'Privacy'],
  },
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    shortCode: 'PCI DSS',
    version: '3.2.1',
    region: 'global',
    description: 'Payment Card Industry Data Security Standard',
    frameworkType: 'regulation',
    totalControls: 78,
    categories: ['Network Security', 'Data Protection', 'Vulnerability Management', 'Access Control', 'Testing', 'Policy'],
  },
  {
    id: 'hipaa',
    name: 'HIPAA Security Rule',
    shortCode: 'HIPAA',
    version: '2013',
    region: 'US',
    description: 'Health Insurance Portability and Accountability Act security requirements',
    frameworkType: 'regulation',
    totalControls: 66,
    categories: ['Administrative', 'Physical', 'Technical', 'Breach Notification'],
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    shortCode: 'GDPR',
    version: '2018',
    region: 'EU',
    description: 'General Data Protection Regulation for personal data protection',
    frameworkType: 'regulation',
    totalControls: 40,
    categories: ['Data Rights', 'Consent', 'Data Processing', 'Data Transfer', 'Incidents', 'DPA'],
  },
  {
    id: 'ccpa',
    name: 'CCPA',
    shortCode: 'CCPA',
    version: '2020',
    region: 'US-CA',
    description: 'California Consumer Privacy Act for personal information',
    frameworkType: 'regulation',
    totalControls: 35,
    categories: ['Consumer Rights', 'Data Sale', 'Disclosure', 'Deletion', 'Non-Discrimination'],
  },
  {
    id: 'cis-controls',
    name: 'CIS Controls',
    shortCode: 'CIS',
    version: '8.1',
    region: 'global',
    description: 'Center for Internet Security controls for cybersecurity',
    frameworkType: 'standard',
    totalControls: 93,
    categories: ['Inventory', 'Security Basics', 'Data Protection', 'Access Control', 'Account Management', 'Data Recovery', 'Logging', 'Email', 'Malware', 'Network Segmentation', 'Security Awareness', 'Incident Response'],
  },
  {
    id: 'cobit',
    name: 'COBIT 2019',
    shortCode: 'COBIT',
    version: '2019',
    region: 'global',
    description: 'Control Objectives for Information Technologies',
    frameworkType: 'standard',
    totalControls: 98,
    categories: ['Governance', 'Strategic Alignment', 'Value Delivery', 'Risk Management', 'Resource Management'],
  },
  {
    id: 'nist-sp800-53',
    name: 'NIST SP 800-53',
    shortCode: 'NIST 800-53',
    version: 'Rev. 5',
    region: 'US',
    description: 'Security and Privacy Controls for US Federal Systems',
    frameworkType: 'regulation',
    totalControls: 360,
    categories: ['Access Control', 'Awareness Training', 'Audit', 'Security Assessment', 'Configuration', 'Identification', 'Incident Response', 'Maintenance', 'Media Protection', 'Physical/Env', 'Planning', 'Personnel Security', 'Risk Assessment', 'System Development', 'System & Communications Protection', 'System Monitoring', 'Transparency', 'Supply Chain', 'Privacy'],
  },
  {
    id: 'nis2',
    name: 'NIS2 Directive',
    shortCode: 'NIS2',
    version: '2022',
    region: 'EU',
    description: 'EU Network and Information Security Directive',
    frameworkType: 'regulation',
    totalControls: 55,
    categories: ['Risk Management', 'Incident Response', 'Business Continuity', 'Supply Chain Security'],
  },
  {
    id: 'tisax',
    name: 'TiSAX/Cyber',
    shortCode: 'TiSAX',
    version: '2021',
    region: 'Germany',
    description: 'Trusted Information Security Assessment Exchange',
    frameworkType: 'standard',
    totalControls: 88,
    categories: ['Information Security', 'Cloud Security', 'Cryptography', 'Incident Management'],
  },
]

export const nistControls: FrameworkControl[] = [
  {
    id: 'nist-1',
    frameworkId: 'nist-csf',
    controlRef: 'ID.AM-1',
    title: 'Physical devices and systems inventoried',
    description: 'All physical devices and systems within the organization are inventoried with the goal of accurately identifying and managing them.',
    category: 'Identify',
    implementationGuidance: 'Maintain comprehensive inventory of all IT assets including hardware, servers, network equipment, and IoT devices.',
    relatedControls: ['ISO.A.8.1.1', 'CIS.1.1'],
    riskLevel: 'high',
  },
  {
    id: 'nist-2',
    frameworkId: 'nist-csf',
    controlRef: 'ID.AM-2',
    title: 'Software platforms and applications inventoried',
    description: 'All software platforms and applications within the organization are inventoried.',
    category: 'Identify',
    implementationGuidance: 'Track all installed software, licensed applications, and custom-developed solutions with versions and patch levels.',
    relatedControls: ['ISO.A.8.1.3', 'CIS.2'],
    riskLevel: 'high',
  },
  {
    id: 'nist-3',
    frameworkId: 'nist-csf',
    controlRef: 'ID.GV-1',
    title: 'Organizational cybersecurity policy established',
    description: 'Organizational cybersecurity policy is established and communicated.',
    category: 'Identify',
    implementationGuidance: 'Develop formal cybersecurity policies approved by management and communicated to all staff.',
    relatedControls: ['ISO.A.5.1.1', 'HIPAA.164.308(a)(1)'],
    riskLevel: 'critical',
  },
  {
    id: 'nist-4',
    frameworkId: 'nist-csf',
    controlRef: 'ID.RA-1',
    title: 'Asset vulnerabilities are identified and documented',
    description: 'Organizational assets are evaluated to identify vulnerabilities.',
    category: 'Identify',
    implementationGuidance: 'Conduct regular vulnerability assessments and penetration tests to identify security weaknesses.',
    relatedControls: ['ISO.A.12.6.1', 'CIS.7'],
    riskLevel: 'high',
  },
]

export const frameworkMappings: Record<string, FrameworkMapping> = {
  'nist-iso': {
    sourceFramework: 'NIST CSF',
    targetFramework: 'ISO 27001',
    totalCoverage: 85,
    mappings: [
      {
        sourceControl: 'ID.AM-1',
        targetControls: ['A.8.1.1'],
        coverage: 90,
      },
      {
        sourceControl: 'ID.AM-2',
        targetControls: ['A.8.1.3'],
        coverage: 88,
      },
      {
        sourceControl: 'PR.AC-1',
        targetControls: ['A.9.1.1', 'A.9.2.1'],
        coverage: 92,
        gapDescription: 'ISO requires more granular role-based access controls',
      },
    ],
  },
  'nist-soc2': {
    sourceFramework: 'NIST CSF',
    targetFramework: 'SOC 2',
    totalCoverage: 92,
    mappings: [
      {
        sourceControl: 'PR.AC-1',
        targetControls: ['CC6.1', 'CC6.2'],
        coverage: 95,
      },
      {
        sourceControl: 'DE.AE-1',
        targetControls: ['CC7.1', 'CC7.2'],
        coverage: 90,
      },
    ],
  },
}

export function analyzeGaps(sourceFramework: string, targetFramework: string): { gaps: string[]; coverage: number } {
  const mapping = frameworkMappings[`${sourceFramework}-${targetFramework}`]

  if (!mapping) {
    return {
      gaps: ['No mapping data available'],
      coverage: 0,
    }
  }

  const gaps = mapping.mappings
    .filter((m) => m.gapDescription)
    .map((m) => `${m.sourceControl}: ${m.gapDescription}`)

  return {
    gaps,
    coverage: mapping.totalCoverage,
  }
}

export function getRelatedFrameworks(frameworkId: string): Framework[] {
  return frameworks.filter((f) => {
    const source = frameworkId.replace('-', '')
    const target = f.id.replace('-', '')
    return Object.keys(frameworkMappings).some(
      (key) =>
        key.includes(source.substring(0, 5)) && key.includes(target.substring(0, 5))
    )
  })
}

export function calculateComplianceScore(
  frameworkId: string,
  implementedControls: number
): number {
  const framework = frameworks.find((f) => f.id === frameworkId)
  if (!framework) return 0
  return Math.round((implementedControls / framework.totalControls) * 100)
}
