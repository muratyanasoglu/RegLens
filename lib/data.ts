import type {
  Source,
  RegulatoryUpdate,
  UpdateDiff,
  Framework,
  Control,
  Mapping,
  Task,
  EvidenceItem,
  AuditPack,
  DashboardMetrics,
} from "./types"

export const sources: Source[] = [
  {
    id: "src-1",
    name: "FCA Regulatory Feed",
    url: "https://www.fca.org.uk/publications/rss",
    type: "rss",
    active: true,
    lastPolled: "2026-02-09T14:30:00Z",
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "src-2",
    name: "SEC EDGAR Filings",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=rule&dateb=&owner=include&count=40&search_text=&action=getcompany&rss=1",
    type: "rss",
    active: true,
    lastPolled: "2026-02-09T12:00:00Z",
    createdAt: "2025-11-15T09:00:00Z",
  },
]

export const frameworks: Framework[] = [
  {
    id: "fw-1",
    name: "ISO 27001:2022",
    version: "2022",
    description: "Information security management systems requirements.",
  },
  {
    id: "fw-2",
    name: "SOC 2 Type II",
    version: "2024",
    description: "Trust services criteria for service organizations.",
  },
  {
    id: "fw-3",
    name: "GDPR",
    version: "2018",
    description: "EU General Data Protection Regulation.",
  },
]

export const controls: Control[] = [
  { id: "ctrl-1", frameworkId: "fw-1", frameworkName: "ISO 27001:2022", controlRef: "A.5.1", title: "Policies for information security", description: "Management direction for information security shall be established in accordance with business requirements and relevant laws and regulations.", category: "Governance" },
  { id: "ctrl-2", frameworkId: "fw-1", frameworkName: "ISO 27001:2022", controlRef: "A.5.2", title: "Information security roles and responsibilities", description: "Information security roles and responsibilities shall be defined and allocated.", category: "Governance" },
  { id: "ctrl-3", frameworkId: "fw-1", frameworkName: "ISO 27001:2022", controlRef: "A.6.1", title: "Screening", description: "Background verification checks on all candidates for employment shall be carried out prior to joining the organization.", category: "People" },
  { id: "ctrl-4", frameworkId: "fw-1", frameworkName: "ISO 27001:2022", controlRef: "A.8.1", title: "User endpoint devices", description: "Information stored on, processed by or accessible via user endpoint devices shall be protected.", category: "Technology" },
  { id: "ctrl-5", frameworkId: "fw-1", frameworkName: "ISO 27001:2022", controlRef: "A.8.9", title: "Configuration management", description: "Configurations, including security configurations, of hardware, software, services and networks shall be established, documented, implemented, monitored and reviewed.", category: "Technology" },
  { id: "ctrl-6", frameworkId: "fw-2", frameworkName: "SOC 2 Type II", controlRef: "CC6.1", title: "Logical and physical access controls", description: "The entity implements logical access security software, infrastructure, and architectures over protected information assets.", category: "Access Control" },
  { id: "ctrl-7", frameworkId: "fw-2", frameworkName: "SOC 2 Type II", controlRef: "CC6.3", title: "Role-based access", description: "The entity authorizes, modifies, or removes access to data, software, functions, and other protected information assets based on roles.", category: "Access Control" },
  { id: "ctrl-8", frameworkId: "fw-2", frameworkName: "SOC 2 Type II", controlRef: "CC7.2", title: "Monitoring for anomalies", description: "The entity monitors system components and the operation of those components for anomalies indicative of malicious acts.", category: "Monitoring" },
  { id: "ctrl-9", frameworkId: "fw-2", frameworkName: "SOC 2 Type II", controlRef: "CC8.1", title: "Change management", description: "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes to infrastructure.", category: "Change Management" },
  { id: "ctrl-10", frameworkId: "fw-3", frameworkName: "GDPR", controlRef: "Art.5", title: "Principles relating to processing", description: "Personal data shall be processed lawfully, fairly and in a transparent manner.", category: "Data Protection" },
  { id: "ctrl-11", frameworkId: "fw-3", frameworkName: "GDPR", controlRef: "Art.25", title: "Data protection by design", description: "The controller shall implement appropriate technical and organisational measures for ensuring that processing conforms to GDPR.", category: "Data Protection" },
  { id: "ctrl-12", frameworkId: "fw-3", frameworkName: "GDPR", controlRef: "Art.32", title: "Security of processing", description: "The controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk.", category: "Security" },
  { id: "ctrl-13", frameworkId: "fw-3", frameworkName: "GDPR", controlRef: "Art.33", title: "Notification of personal data breach", description: "In the case of a personal data breach, the controller shall notify the supervisory authority without undue delay.", category: "Incident Response" },
  { id: "ctrl-14", frameworkId: "fw-1", frameworkName: "ISO 27001:2022", controlRef: "A.5.23", title: "Information security for cloud services", description: "Processes for acquisition, use, management and exit from cloud services shall be established.", category: "Technology" },
  { id: "ctrl-15", frameworkId: "fw-2", frameworkName: "SOC 2 Type II", controlRef: "CC9.1", title: "Risk mitigation", description: "The entity identifies, selects, and develops risk mitigation activities for risks arising from potential business disruptions.", category: "Risk Management" },
]

export const regulatoryUpdates: RegulatoryUpdate[] = [
  { id: "upd-1", sourceId: "src-1", sourceName: "FCA Regulatory Feed", title: "FCA PS24/16: Operational resilience - updated requirements", summary: "The FCA has published final rules strengthening operational resilience requirements for regulated firms, including enhanced impact tolerance testing and third-party dependency mapping.", rawText: "Policy Statement PS24/16...", normalizedText: "The Financial Conduct Authority publishes final rules on operational resilience...", hash: "a1b2c3d4", publishedAt: "2026-01-15T09:00:00Z", status: "mapped", riskLevel: "high", createdAt: "2026-01-15T10:00:00Z" },
  { id: "upd-2", sourceId: "src-2", sourceName: "SEC EDGAR Filings", title: "SEC Rule 10b5-1: Insider Trading Plans Amendment", summary: "The SEC has adopted amendments to Rule 10b5-1 to enhance the disclosure requirements for insider trading arrangements and introduce cooling-off periods.", rawText: "Release No. 34-XXXXX...", normalizedText: "The Securities and Exchange Commission amends Rule 10b5-1...", hash: "e5f6g7h8", publishedAt: "2026-01-20T14:00:00Z", status: "analyzed", riskLevel: "critical", createdAt: "2026-01-20T15:00:00Z" },
  { id: "upd-3", sourceId: "src-1", sourceName: "FCA Regulatory Feed", title: "FCA CP25/1: Consumer Duty - Board reporting expectations", summary: "Consultation paper setting out the FCA's expectations for board-level reporting on Consumer Duty outcomes, including standardized metrics and benchmarks.", rawText: "Consultation Paper CP25/1...", normalizedText: "The Financial Conduct Authority consults on Consumer Duty board reporting...", hash: "i9j0k1l2", publishedAt: "2026-01-25T11:00:00Z", status: "new", riskLevel: "medium", createdAt: "2026-01-25T12:00:00Z" },
  { id: "upd-4", sourceId: "src-2", sourceName: "SEC EDGAR Filings", title: "SEC Cybersecurity Risk Management Disclosure Update", summary: "Updated guidance on cybersecurity risk management, strategy, and incident disclosure for public companies under the 2023 rule framework.", rawText: "Staff Guidance 2026-01...", normalizedText: "The SEC provides updated guidance on cybersecurity disclosures...", hash: "m3n4o5p6", publishedAt: "2026-01-28T10:00:00Z", status: "mapped", riskLevel: "high", createdAt: "2026-01-28T11:00:00Z" },
  { id: "upd-5", sourceId: "src-1", sourceName: "FCA Regulatory Feed", title: "FCA: Anti-money laundering supervisory strategy update", summary: "The FCA updates its supervisory approach to anti-money laundering controls, emphasizing technology-enabled transaction monitoring and enhanced due diligence.", rawText: "Supervisory Statement...", normalizedText: "The FCA updates AML supervisory strategy...", hash: "q7r8s9t0", publishedAt: "2026-02-01T08:00:00Z", status: "actioned", riskLevel: "high", createdAt: "2026-02-01T09:00:00Z" },
  { id: "upd-6", sourceId: "src-2", sourceName: "SEC EDGAR Filings", title: "SEC Climate-Related Disclosures: Implementation Guidance", summary: "The SEC releases implementation guidance for the climate-related disclosure rules, providing clarification on materiality thresholds and Scope 3 reporting.", rawText: "Implementation Release...", normalizedText: "The SEC provides implementation guidance for climate disclosures...", hash: "u1v2w3x4", publishedAt: "2026-02-03T13:00:00Z", status: "new", riskLevel: "medium", createdAt: "2026-02-03T14:00:00Z" },
  { id: "upd-7", sourceId: "src-1", sourceName: "FCA Regulatory Feed", title: "FCA: Digital assets regulatory framework consultation", summary: "The FCA launches a comprehensive consultation on the regulatory framework for digital assets, covering custody, trading, and lending activities.", rawText: "Discussion Paper DP26/1...", normalizedText: "The FCA consults on digital assets regulation...", hash: "y5z6a7b8", publishedAt: "2026-02-05T10:00:00Z", status: "analyzed", riskLevel: "medium", createdAt: "2026-02-05T11:00:00Z" },
  { id: "upd-8", sourceId: "src-2", sourceName: "SEC EDGAR Filings", title: "SEC: Enhanced beneficial ownership reporting requirements", summary: "Final rule amendments requiring accelerated filing deadlines for Schedules 13D and 13G, expanding the definition of beneficial ownership.", rawText: "Release No. 34-YYYYY...", normalizedText: "The SEC finalizes enhanced beneficial ownership reporting...", hash: "c9d0e1f2", publishedAt: "2026-02-06T15:00:00Z", status: "new", riskLevel: "low", createdAt: "2026-02-06T16:00:00Z" },
  { id: "upd-9", sourceId: "src-1", sourceName: "FCA Regulatory Feed", title: "FCA: Third-party risk management - concentration risk", summary: "New requirements addressing concentration risk in critical third-party service providers, including mandatory multi-provider strategies for systemic services.", rawText: "Policy Statement PS26/2...", normalizedText: "The FCA addresses third-party concentration risk...", hash: "g3h4i5j6", publishedAt: "2026-02-07T09:00:00Z", status: "mapped", riskLevel: "critical", createdAt: "2026-02-07T10:00:00Z" },
  { id: "upd-10", sourceId: "src-2", sourceName: "SEC EDGAR Filings", title: "SEC: Special purpose acquisition company (SPAC) disclosure rules", summary: "Final rules enhancing disclosure and investor protection in SPAC IPOs, de-SPAC transactions, and shell company reporting.", rawText: "Release No. 33-ZZZZZ...", normalizedText: "The SEC finalizes SPAC disclosure rules...", hash: "k7l8m9n0", publishedAt: "2026-02-08T12:00:00Z", status: "analyzed", riskLevel: "low", createdAt: "2026-02-08T13:00:00Z" },
]

export const updateDiffs: UpdateDiff[] = [
  { id: "diff-1", updateId: "upd-1", diffType: "addition", section: "Section 3.2 - Impact Tolerance", oldText: null, newText: "Firms must conduct scenario-based impact tolerance testing at least annually, covering all important business services identified under the operational resilience framework.", impact: "Requires new annual testing procedures and documentation." },
  { id: "diff-2", updateId: "upd-1", diffType: "modification", section: "Section 4.1 - Third-Party Mapping", oldText: "Firms should maintain awareness of their third-party dependencies.", newText: "Firms must maintain comprehensive real-time mapping of all critical third-party dependencies, updated quarterly at minimum.", impact: "Significant increase in third-party oversight requirements." },
  { id: "diff-3", updateId: "upd-2", diffType: "addition", section: "Rule 10b5-1(c)(1)(ii)", oldText: null, newText: "A cooling-off period of at least 90 days is required between the adoption of a new or modified Rule 10b5-1 plan and the first transaction under that plan for directors and officers.", impact: "New waiting period before insider trades can execute under plans." },
  { id: "diff-4", updateId: "upd-4", diffType: "modification", section: "Item 1.05 - Form 8-K", oldText: "Registrants must disclose material cybersecurity incidents within four business days.", newText: "Registrants must disclose material cybersecurity incidents within four business days, including a detailed assessment of the incident's scope, nature, and potential financial impact.", impact: "Expanded disclosure requirements for cyber incidents." },
  { id: "diff-5", updateId: "upd-9", diffType: "addition", section: "Section 2 - Concentration Limits", oldText: null, newText: "Where a single critical third-party provider serves more than 30% of regulated firms in a sector, firms must develop credible exit strategies and maintain viable alternative provider relationships.", impact: "Major operational requirement for firms relying on dominant cloud and data providers." },
]

export const mappings: Mapping[] = [
  { id: "map-1", updateId: "upd-1", controlId: "ctrl-5", controlRef: "A.8.9", controlTitle: "Configuration management", updateTitle: "FCA PS24/16: Operational resilience", confidence: "high", rationale: "The operational resilience requirements directly relate to configuration management controls, requiring documented configurations of critical systems.", aiGenerated: true, createdAt: "2026-01-15T11:00:00Z" },
  { id: "map-2", updateId: "upd-1", controlId: "ctrl-14", controlRef: "A.5.23", controlTitle: "Cloud services security", updateTitle: "FCA PS24/16: Operational resilience", confidence: "high", rationale: "Third-party dependency mapping requirements map directly to cloud services security controls.", aiGenerated: true, createdAt: "2026-01-15T11:05:00Z" },
  { id: "map-3", updateId: "upd-1", controlId: "ctrl-15", controlRef: "CC9.1", controlTitle: "Risk mitigation", updateTitle: "FCA PS24/16: Operational resilience", confidence: "medium", rationale: "Operational resilience measures contribute to overall risk mitigation strategies.", aiGenerated: true, createdAt: "2026-01-15T11:10:00Z" },
  { id: "map-4", updateId: "upd-2", controlId: "ctrl-6", controlRef: "CC6.1", controlTitle: "Logical and physical access controls", updateTitle: "SEC Rule 10b5-1: Insider Trading Plans", confidence: "medium", rationale: "Insider trading plan amendments require enhanced access controls around material non-public information systems.", aiGenerated: true, createdAt: "2026-01-20T16:00:00Z" },
  { id: "map-5", updateId: "upd-2", controlId: "ctrl-7", controlRef: "CC6.3", controlTitle: "Role-based access", updateTitle: "SEC Rule 10b5-1: Insider Trading Plans", confidence: "high", rationale: "Cooling-off period enforcement requires role-based access controls for trading system approvals.", aiGenerated: true, createdAt: "2026-01-20T16:05:00Z" },
  { id: "map-6", updateId: "upd-4", controlId: "ctrl-8", controlRef: "CC7.2", controlTitle: "Monitoring for anomalies", updateTitle: "SEC Cybersecurity Disclosure Update", confidence: "high", rationale: "Enhanced cybersecurity disclosure requirements necessitate robust anomaly monitoring and incident detection capabilities.", aiGenerated: true, createdAt: "2026-01-28T12:00:00Z" },
  { id: "map-7", updateId: "upd-4", controlId: "ctrl-13", controlRef: "Art.33", controlTitle: "Notification of personal data breach", updateTitle: "SEC Cybersecurity Disclosure Update", confidence: "high", rationale: "Cybersecurity incident disclosure aligns with GDPR breach notification requirements.", aiGenerated: true, createdAt: "2026-01-28T12:05:00Z" },
  { id: "map-8", updateId: "upd-4", controlId: "ctrl-12", controlRef: "Art.32", controlTitle: "Security of processing", updateTitle: "SEC Cybersecurity Disclosure Update", confidence: "medium", rationale: "Security of processing controls support the cybersecurity risk management framework required by the SEC.", aiGenerated: true, createdAt: "2026-01-28T12:10:00Z" },
  { id: "map-9", updateId: "upd-5", controlId: "ctrl-10", controlRef: "Art.5", controlTitle: "Principles relating to processing", updateTitle: "FCA AML supervisory strategy", confidence: "medium", rationale: "Enhanced due diligence requirements intersect with data processing principles under GDPR.", aiGenerated: true, createdAt: "2026-02-01T10:00:00Z" },
  { id: "map-10", updateId: "upd-5", controlId: "ctrl-1", controlRef: "A.5.1", controlTitle: "Policies for information security", updateTitle: "FCA AML supervisory strategy", confidence: "high", rationale: "AML strategy updates require corresponding updates to information security policies.", aiGenerated: true, createdAt: "2026-02-01T10:05:00Z" },
  { id: "map-11", updateId: "upd-9", controlId: "ctrl-14", controlRef: "A.5.23", controlTitle: "Cloud services security", updateTitle: "FCA Third-party concentration risk", confidence: "high", rationale: "Third-party concentration limits directly impact cloud services security controls and provider management.", aiGenerated: true, createdAt: "2026-02-07T11:00:00Z" },
  { id: "map-12", updateId: "upd-9", controlId: "ctrl-15", controlRef: "CC9.1", controlTitle: "Risk mitigation", updateTitle: "FCA Third-party concentration risk", confidence: "high", rationale: "Concentration risk requirements are core risk mitigation controls for business continuity.", aiGenerated: true, createdAt: "2026-02-07T11:05:00Z" },
  { id: "map-13", updateId: "upd-9", controlId: "ctrl-9", controlRef: "CC8.1", controlTitle: "Change management", updateTitle: "FCA Third-party concentration risk", confidence: "medium", rationale: "Exit strategy implementation requires structured change management processes.", aiGenerated: true, createdAt: "2026-02-07T11:10:00Z" },
  { id: "map-14", updateId: "upd-3", controlId: "ctrl-1", controlRef: "A.5.1", controlTitle: "Policies for information security", updateTitle: "FCA Consumer Duty board reporting", confidence: "low", rationale: "Consumer Duty reporting may require updates to information governance policies.", aiGenerated: true, createdAt: "2026-01-25T13:00:00Z" },
  { id: "map-15", updateId: "upd-6", controlId: "ctrl-11", controlRef: "Art.25", controlTitle: "Data protection by design", updateTitle: "SEC Climate-Related Disclosures", confidence: "low", rationale: "Climate disclosure data collection processes should incorporate data protection by design principles.", aiGenerated: true, createdAt: "2026-02-03T15:00:00Z" },
  { id: "map-16", updateId: "upd-7", controlId: "ctrl-6", controlRef: "CC6.1", controlTitle: "Logical and physical access controls", updateTitle: "FCA Digital assets framework", confidence: "high", rationale: "Digital asset custody and trading require robust logical access controls.", aiGenerated: true, createdAt: "2026-02-05T12:00:00Z" },
  { id: "map-17", updateId: "upd-7", controlId: "ctrl-12", controlRef: "Art.32", controlTitle: "Security of processing", updateTitle: "FCA Digital assets framework", confidence: "medium", rationale: "Digital asset operations must ensure appropriate security of processing.", aiGenerated: true, createdAt: "2026-02-05T12:05:00Z" },
  { id: "map-18", updateId: "upd-5", controlId: "ctrl-8", controlRef: "CC7.2", controlTitle: "Monitoring for anomalies", updateTitle: "FCA AML supervisory strategy", confidence: "high", rationale: "Technology-enabled transaction monitoring for AML requires anomaly detection capabilities.", aiGenerated: true, createdAt: "2026-02-01T10:10:00Z" },
  { id: "map-19", updateId: "upd-1", controlId: "ctrl-9", controlRef: "CC8.1", controlTitle: "Change management", updateTitle: "FCA PS24/16: Operational resilience", confidence: "medium", rationale: "Operational resilience testing may trigger infrastructure changes that must follow change management procedures.", aiGenerated: true, createdAt: "2026-01-15T11:15:00Z" },
  { id: "map-20", updateId: "upd-2", controlId: "ctrl-2", controlRef: "A.5.2", controlTitle: "Information security roles", updateTitle: "SEC Rule 10b5-1: Insider Trading Plans", confidence: "medium", rationale: "Insider trading compliance requires clear information security roles around MNPI handling.", aiGenerated: true, createdAt: "2026-01-20T16:10:00Z" },
]

export const tasks: Task[] = [
  { id: "task-1", mappingId: "map-1", updateId: "upd-1", controlRef: "A.8.9", title: "Update configuration management procedures for operational resilience", description: "Review and update configuration management procedures to align with FCA PS24/16 requirements. Document all critical system configurations and establish annual review cycles.", status: "in_progress", priority: "high", assignee: "Sarah Chen", dueDate: "2026-03-01", createdAt: "2026-01-16T09:00:00Z" },
  { id: "task-2", mappingId: "map-2", updateId: "upd-1", controlRef: "A.5.23", title: "Map all critical third-party cloud dependencies", description: "Create comprehensive mapping of all critical third-party cloud service dependencies. Establish quarterly update cadence per new FCA requirements.", status: "open", priority: "high", assignee: "James Wilson", dueDate: "2026-03-15", createdAt: "2026-01-16T09:30:00Z" },
  { id: "task-3", mappingId: "map-3", updateId: "upd-1", controlRef: "CC9.1", title: "Design operational resilience testing program", description: "Design and implement an annual scenario-based impact tolerance testing program covering all important business services.", status: "open", priority: "high", assignee: null, dueDate: "2026-04-01", createdAt: "2026-01-16T10:00:00Z" },
  { id: "task-4", mappingId: "map-4", updateId: "upd-2", controlRef: "CC6.1", title: "Enhance MNPI access controls for insider trading compliance", description: "Review and strengthen logical access controls around systems containing material non-public information to support Rule 10b5-1 amendments.", status: "open", priority: "critical", assignee: "Emily Rodriguez", dueDate: "2026-02-28", createdAt: "2026-01-21T09:00:00Z" },
  { id: "task-5", mappingId: "map-5", updateId: "upd-2", controlRef: "CC6.3", title: "Implement cooling-off period enforcement in trading systems", description: "Build automated enforcement of the 90-day cooling-off period for director and officer trading plans in compliance systems.", status: "in_progress", priority: "critical", assignee: "Michael Park", dueDate: "2026-02-20", createdAt: "2026-01-21T09:30:00Z" },
  { id: "task-6", mappingId: "map-6", updateId: "upd-4", controlRef: "CC7.2", title: "Enhance cybersecurity anomaly monitoring for SEC disclosure compliance", description: "Upgrade anomaly monitoring systems to detect and classify cybersecurity incidents at the level of detail required by updated SEC disclosure rules.", status: "review", priority: "high", assignee: "Sarah Chen", dueDate: "2026-02-15", createdAt: "2026-01-29T09:00:00Z" },
  { id: "task-7", mappingId: "map-7", updateId: "upd-4", controlRef: "Art.33", title: "Align SEC cyber incident disclosure with GDPR breach notification", description: "Create unified incident response procedures that satisfy both SEC 4-business-day disclosure and GDPR 72-hour breach notification requirements.", status: "open", priority: "high", assignee: "Emily Rodriguez", dueDate: "2026-03-01", createdAt: "2026-01-29T09:30:00Z" },
  { id: "task-8", mappingId: "map-8", updateId: "upd-4", controlRef: "Art.32", title: "Update security of processing risk assessment for SEC alignment", description: "Conduct updated risk assessment for security of processing controls incorporating SEC cybersecurity framework requirements.", status: "done", priority: "medium", assignee: "James Wilson", dueDate: "2026-02-10", createdAt: "2026-01-29T10:00:00Z" },
  { id: "task-9", mappingId: "map-10", updateId: "upd-5", controlRef: "A.5.1", title: "Update information security policy for AML requirements", description: "Revise information security policies to incorporate updated FCA AML supervisory strategy requirements, including technology-enabled monitoring.", status: "done", priority: "high", assignee: "Sarah Chen", dueDate: "2026-02-08", createdAt: "2026-02-01T11:00:00Z" },
  { id: "task-10", mappingId: "map-11", updateId: "upd-9", controlRef: "A.5.23", title: "Develop third-party exit strategies for cloud concentration risk", description: "Develop credible exit strategies for critical cloud service providers where market concentration exceeds 30% threshold.", status: "open", priority: "critical", assignee: null, dueDate: "2026-04-15", createdAt: "2026-02-07T12:00:00Z" },
  { id: "task-11", mappingId: "map-12", updateId: "upd-9", controlRef: "CC9.1", title: "Assess alternative provider viability for critical services", description: "Evaluate and document viable alternative provider relationships for all critical third-party services identified under concentration risk analysis.", status: "open", priority: "high", assignee: "Michael Park", dueDate: "2026-04-01", createdAt: "2026-02-07T12:30:00Z" },
  { id: "task-12", mappingId: "map-13", updateId: "upd-9", controlRef: "CC8.1", title: "Create change management plan for potential provider migrations", description: "Develop structured change management procedures for potential third-party provider migrations as part of exit strategy implementation.", status: "open", priority: "medium", assignee: null, dueDate: "2026-05-01", createdAt: "2026-02-07T13:00:00Z" },
  { id: "task-13", mappingId: "map-9", updateId: "upd-5", controlRef: "Art.5", title: "Review data processing for AML enhanced due diligence", description: "Ensure enhanced due diligence data processing activities comply with GDPR data processing principles, particularly purpose limitation and data minimization.", status: "in_progress", priority: "medium", assignee: "Emily Rodriguez", dueDate: "2026-02-28", createdAt: "2026-02-01T11:30:00Z" },
  { id: "task-14", mappingId: "map-18", updateId: "upd-5", controlRef: "CC7.2", title: "Implement AI-enhanced transaction monitoring for AML", description: "Deploy technology-enabled transaction monitoring capabilities as required by updated FCA AML supervisory strategy.", status: "in_progress", priority: "high", assignee: "James Wilson", dueDate: "2026-03-15", createdAt: "2026-02-01T12:00:00Z" },
  { id: "task-15", mappingId: "map-16", updateId: "upd-7", controlRef: "CC6.1", title: "Design access control framework for digital asset operations", description: "Design and document logical access control requirements for digital asset custody, trading, and lending activities per FCA consultation.", status: "open", priority: "medium", assignee: null, dueDate: "2026-04-30", createdAt: "2026-02-05T13:00:00Z" },
  { id: "task-16", mappingId: "map-19", updateId: "upd-1", controlRef: "CC8.1", title: "Update change management for resilience testing outcomes", description: "Ensure change management procedures capture and process infrastructure changes arising from operational resilience testing.", status: "done", priority: "medium", assignee: "Sarah Chen", dueDate: "2026-02-05", createdAt: "2026-01-16T10:30:00Z" },
  { id: "task-17", mappingId: "map-20", updateId: "upd-2", controlRef: "A.5.2", title: "Define MNPI handling roles and responsibilities", description: "Establish clear information security roles and responsibilities for handling material non-public information in context of insider trading compliance.", status: "review", priority: "high", assignee: "Michael Park", dueDate: "2026-02-18", createdAt: "2026-01-21T10:00:00Z" },
  { id: "task-18", mappingId: "map-14", updateId: "upd-3", controlRef: "A.5.1", title: "Assess Consumer Duty impact on information governance", description: "Evaluate whether Consumer Duty board reporting expectations require updates to existing information governance and security policies.", status: "open", priority: "low", assignee: null, dueDate: "2026-03-30", createdAt: "2026-01-25T14:00:00Z" },
  { id: "task-19", mappingId: "map-15", updateId: "upd-6", controlRef: "Art.25", title: "Review climate data collection for data protection compliance", description: "Ensure SEC climate-related disclosure data collection processes incorporate data protection by design principles.", status: "open", priority: "low", assignee: null, dueDate: "2026-04-30", createdAt: "2026-02-03T16:00:00Z" },
  { id: "task-20", mappingId: "map-17", updateId: "upd-7", controlRef: "Art.32", title: "Assess security requirements for digital asset processing", description: "Conduct security assessment for digital asset processing operations to ensure GDPR Article 32 compliance.", status: "open", priority: "medium", assignee: "Emily Rodriguez", dueDate: "2026-05-15", createdAt: "2026-02-05T13:30:00Z" },
  { id: "task-21", mappingId: null, updateId: "upd-1", controlRef: "A.8.9", title: "Document critical system recovery time objectives", description: "Document recovery time objectives (RTOs) and recovery point objectives (RPOs) for all critical systems identified in operational resilience mapping.", status: "done", priority: "high", assignee: "James Wilson", dueDate: "2026-02-01", createdAt: "2026-01-16T11:00:00Z" },
  { id: "task-22", mappingId: null, updateId: "upd-2", controlRef: "CC6.3", title: "Train compliance team on updated insider trading rules", description: "Conduct training sessions for compliance and legal teams on Rule 10b5-1 amendments and new cooling-off period requirements.", status: "done", priority: "high", assignee: "Emily Rodriguez", dueDate: "2026-02-05", createdAt: "2026-01-21T11:00:00Z" },
  { id: "task-23", mappingId: null, updateId: "upd-4", controlRef: "CC7.2", title: "Establish cybersecurity incident classification matrix", description: "Create a cybersecurity incident classification matrix aligned with SEC materiality thresholds for Form 8-K reporting.", status: "review", priority: "high", assignee: "Sarah Chen", dueDate: "2026-02-12", createdAt: "2026-01-29T10:30:00Z" },
  { id: "task-24", mappingId: null, updateId: "upd-9", controlRef: "A.5.23", title: "Conduct cloud provider concentration analysis", description: "Perform comprehensive analysis of current cloud service provider concentration across all business units and identify providers exceeding the 30% threshold.", status: "in_progress", priority: "critical", assignee: "Michael Park", dueDate: "2026-02-20", createdAt: "2026-02-07T13:30:00Z" },
  { id: "task-25", mappingId: null, updateId: "upd-5", controlRef: "A.5.1", title: "Board presentation on AML technology strategy", description: "Prepare board-level presentation on technology strategy for enhanced AML monitoring capabilities as required by FCA supervisory update.", status: "open", priority: "medium", assignee: "Sarah Chen", dueDate: "2026-03-01", createdAt: "2026-02-01T12:30:00Z" },
]

export const evidenceItems: EvidenceItem[] = [
  { id: "ev-1", taskId: "task-1", controlRef: "A.8.9", title: "Configuration Management Procedure v3.1", template: "## Configuration Management Procedure\n\n**Control Reference:** A.8.9\n**Last Updated:** [DATE]\n**Owner:** [NAME]\n\n### Purpose\nThis document establishes procedures for managing configurations of hardware, software, services, and networks.\n\n### Scope\nAll critical information systems identified in the operational resilience framework.\n\n### Procedures\n1. Configuration baseline documentation\n2. Change approval workflow\n3. Annual review cycle\n4. Compliance mapping\n\n### Evidence of Compliance\n- [ ] Baseline configurations documented\n- [ ] Review schedule established\n- [ ] Approval workflow configured\n\n---\n*Disclaimer: Not legal advice. Human review required.*", status: "pending_review", createdAt: "2026-01-17T09:00:00Z" },
  { id: "ev-2", taskId: "task-5", controlRef: "CC6.3", title: "Trading Plan Cooling-Off Period Controls", template: "## Trading Plan Cooling-Off Period Controls\n\n**Control Reference:** CC6.3\n**Last Updated:** [DATE]\n**Owner:** [NAME]\n\n### Purpose\nDocument automated controls enforcing the 90-day cooling-off period for Rule 10b5-1 trading plans.\n\n### Control Description\nThe trading compliance system enforces a mandatory 90-day cooling-off period between plan adoption/modification and first execution.\n\n### Test Procedures\n1. Verify system configuration for 90-day restriction\n2. Test plan adoption date logging\n3. Test automated execution blocking\n4. Verify exception handling and escalation\n\n### Evidence\n- [ ] System configuration screenshots\n- [ ] Test execution logs\n- [ ] Exception report samples\n\n---\n*Disclaimer: Not legal advice. Human review required.*", status: "draft", createdAt: "2026-01-22T09:00:00Z" },
  { id: "ev-3", taskId: "task-6", controlRef: "CC7.2", title: "Cybersecurity Anomaly Monitoring Specification", template: "## Cybersecurity Anomaly Monitoring Specification\n\n**Control Reference:** CC7.2\n**Last Updated:** [DATE]\n**Owner:** [NAME]\n\n### Purpose\nDefine monitoring capabilities for detecting cybersecurity anomalies at SEC-required disclosure detail levels.\n\n### Monitoring Categories\n1. Network traffic anomalies\n2. User behavior analytics\n3. Data exfiltration detection\n4. Privilege escalation monitoring\n\n### Incident Classification\n| Severity | Description | Disclosure Trigger |\n|----------|-------------|-------------------|\n| Critical | Material breach | SEC Form 8-K (4 days) |\n| High | Significant anomaly | Internal escalation |\n| Medium | Suspicious activity | Investigation |\n| Low | Minor anomaly | Log and monitor |\n\n---\n*Disclaimer: Not legal advice. Human review required.*", status: "approved", createdAt: "2026-01-30T09:00:00Z" },
  { id: "ev-4", taskId: "task-9", controlRef: "A.5.1", title: "Information Security Policy - AML Addendum", template: "## Information Security Policy - AML Addendum\n\n**Control Reference:** A.5.1\n**Effective Date:** [DATE]\n**Approved By:** [NAME]\n\n### Amendments Summary\nThis addendum incorporates requirements from the FCA's updated AML supervisory strategy.\n\n### Key Changes\n1. Technology-enabled transaction monitoring mandate\n2. Enhanced due diligence data handling procedures\n3. Suspicious activity reporting protocols\n4. Staff training requirements\n\n### Compliance Requirements\n- [ ] Policy reviewed by legal team\n- [ ] Board approval obtained\n- [ ] Staff training completed\n- [ ] Technology assessment done\n\n---\n*Disclaimer: Not legal advice. Human review required.*", status: "approved", createdAt: "2026-02-02T09:00:00Z" },
  { id: "ev-5", taskId: "task-21", controlRef: "A.8.9", title: "Critical Systems RTO/RPO Documentation", template: "## Critical Systems Recovery Time/Point Objectives\n\n**Control Reference:** A.8.9\n**Last Updated:** [DATE]\n**Owner:** [NAME]\n\n### System Inventory\n| System | Classification | RTO | RPO |\n|--------|---------------|-----|-----|\n| Core Banking | Critical | 1h | 15min |\n| Trading Platform | Critical | 30min | 5min |\n| Customer Portal | High | 4h | 1h |\n| Reporting System | Medium | 8h | 4h |\n\n### Testing Schedule\n- Quarterly: Tabletop exercises\n- Semi-annual: Technical recovery tests\n- Annual: Full-scale resilience scenario\n\n---\n*Disclaimer: Not legal advice. Human review required.*", status: "approved", createdAt: "2026-01-17T14:00:00Z" },
  { id: "ev-6", taskId: "task-22", controlRef: "CC6.3", title: "Insider Trading Rules Training Completion Report", template: "## Training Completion Report: Updated Insider Trading Rules\n\n**Control Reference:** CC6.3\n**Training Date:** [DATE]\n**Facilitator:** [NAME]\n\n### Training Coverage\n1. Rule 10b5-1 amendments overview\n2. 90-day cooling-off period requirements\n3. Enhanced disclosure obligations\n4. Compliance system demonstrations\n\n### Attendance\n- [ ] Compliance team (100%)\n- [ ] Legal team (100%)\n- [ ] Trading desk supervisors\n- [ ] Senior management briefed\n\n### Assessment Results\n- Average score: [SCORE]%\n- Pass rate: [RATE]%\n\n---\n*Disclaimer: Not legal advice. Human review required.*", status: "approved", createdAt: "2026-01-22T14:00:00Z" },
  { id: "ev-7", taskId: "task-8", controlRef: "Art.32", title: "Security Risk Assessment - SEC Cybersecurity Alignment", template: "## Security of Processing Risk Assessment\n\n**Control Reference:** Art.32\n**Assessment Date:** [DATE]\n**Assessor:** [NAME]\n\n### Scope\nRisk assessment for security of processing controls incorporating SEC cybersecurity framework.\n\n### Risk Matrix\n| Risk Area | Likelihood | Impact | Residual Risk |\n|-----------|------------|--------|---------------|\n| Data breach | Medium | High | Medium |\n| Unauthorized access | Low | High | Low |\n| System failure | Low | Critical | Medium |\n\n### Recommendations\n1. Implement enhanced logging\n2. Quarterly penetration testing\n3. Automated vulnerability scanning\n\n---\n*Disclaimer: Not legal advice. Human review required.*", status: "approved", createdAt: "2026-01-30T14:00:00Z" },
]

export const auditPacks: AuditPack[] = [
  {
    id: "ap-1",
    title: "Q1 2026 Operational Resilience Compliance Pack",
    description: "Comprehensive audit pack covering FCA PS24/16 operational resilience compliance, including configuration management, third-party mapping, and recovery documentation.",
    status: "finalized",
    taskIds: ["task-1", "task-2", "task-3", "task-16", "task-21"],
    evidenceIds: ["ev-1", "ev-5"],
    createdAt: "2026-02-01T09:00:00Z",
    finalizedAt: "2026-02-05T16:00:00Z",
  },
  {
    id: "ap-2",
    title: "Insider Trading Compliance - Rule 10b5-1 Update",
    description: "Audit pack documenting compliance actions taken in response to SEC Rule 10b5-1 amendments, covering access controls, cooling-off enforcement, and staff training.",
    status: "draft",
    taskIds: ["task-4", "task-5", "task-17", "task-22"],
    evidenceIds: ["ev-2", "ev-6"],
    createdAt: "2026-02-08T09:00:00Z",
    finalizedAt: null,
  },
]

export function getDashboardMetrics(): DashboardMetrics {
  const openTasks = tasks.filter((t) => t.status === "open" || t.status === "in_progress").length
  const criticalRisks = regulatoryUpdates.filter((u) => u.riskLevel === "critical").length
  const pendingMappings = mappings.filter((m) => m.confidence === "low").length

  const doneTasks = tasks.filter((t) => t.status === "done").length
  const complianceScore = Math.round((doneTasks / tasks.length) * 100)

  return {
    totalUpdates: regulatoryUpdates.length,
    openTasks,
    pendingMappings,
    criticalRisks,
    complianceScore,
    updatesByMonth: [
      { month: "Nov", count: 0 },
      { month: "Dec", count: 0 },
      { month: "Jan", count: 5 },
      { month: "Feb", count: 5 },
    ],
    tasksByStatus: [
      { status: "Open", count: tasks.filter((t) => t.status === "open").length },
      { status: "In Progress", count: tasks.filter((t) => t.status === "in_progress").length },
      { status: "Review", count: tasks.filter((t) => t.status === "review").length },
      { status: "Done", count: tasks.filter((t) => t.status === "done").length },
    ],
    riskDistribution: [
      { level: "Critical", count: regulatoryUpdates.filter((u) => u.riskLevel === "critical").length },
      { level: "High", count: regulatoryUpdates.filter((u) => u.riskLevel === "high").length },
      { level: "Medium", count: regulatoryUpdates.filter((u) => u.riskLevel === "medium").length },
      { level: "Low", count: regulatoryUpdates.filter((u) => u.riskLevel === "low").length },
    ],
  }
}
