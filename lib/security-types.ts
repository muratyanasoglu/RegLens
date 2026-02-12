export type UserRole = "ADMIN" | "MANAGER" | "AUDITOR" | "USER" | "VIEWER"
export type ComplianceType = "SOC2" | "ISO27001" | "HIPAA" | "PCI-DSS" | "GDPR" | "CCPA" | "HITECH"
export type CertificationStatus = "in_progress" | "certified" | "expired" | "pending_renewal"
export type DataResidency = "US" | "EU" | "APAC" | "CUSTOM"
export type AuditAction = "login" | "logout" | "data_access" | "data_export" | "config_change" | "user_created" | "user_deleted" | "permission_change" | "mfa_enabled" | "policy_updated"
export type EncryptionAlgorithm = "AES-256-GCM" | "ChaCha20-Poly1305"

export interface SecurityContext {
  userId: string
  organizationId: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  action: AuditAction
  resourceType: string
  resourceId?: string
}

export interface ComplianceCertification {
  id: string
  organizationId: string
  type: ComplianceType
  status: CertificationStatus
  certificationDate?: Date
  expiryDate?: Date
  auditScope?: string
  certifierName?: string
  documentUrl?: string
}

export interface SecurityPolicy {
  id: string
  organizationId: string
  name: string
  description: string
  policyType: string
  isActive: boolean
  enforcedAt?: Date
}

export interface UserSession {
  id: string
  userId: string
  deviceName: string
  deviceType: string
  ipAddress: string
  lastActiveAt: Date
  createdAt: Date
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  expiryDays: number | null
  historyCount: number
}

export interface MFAConfig {
  enabled: boolean
  grace_period_days: number
  algorithms: string[]
  issuer: string
}

export interface SAMLConfig {
  enabled: boolean
  entityId: string
  ssoUrl: string
  certificate: string
  attributeMapping: {
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

export interface OIDCConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
  discoveryUrl: string
  scope: string[]
}

export interface RBACPolicy {
  role: UserRole
  permissions: Permission[]
}

export interface Permission {
  resource: string
  action: "read" | "create" | "update" | "delete" | "export" | "share"
  fields?: string[]
}

export interface EncryptionMetadata {
  algorithm: EncryptionAlgorithm
  keyVersion: number
  rotationDate: Date
  iv: string
}
