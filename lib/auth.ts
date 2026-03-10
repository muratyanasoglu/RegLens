import crypto from "crypto"
import { jwtVerify, SignJWT } from "jose"

const rawJwtSecret = process.env.JWT_SECRET

if (!rawJwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production for token security")
}

const JWT_SECRET = new TextEncoder().encode(rawJwtSecret || "dev-only-insecure-secret-change-me")
const JWT_EXPIRATION = "24h"

export interface TokenPayload {
  sub: string
  org: string
  role: string
  iat?: number
  exp?: number
}

export class AuthService {
  static async createToken(payload: TokenPayload): Promise<string> {
    const token = await new SignJWT(payload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRATION)
      .sign(JWT_SECRET)

    return token
  }

  static async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const verified = await jwtVerify(token, JWT_SECRET)
      return verified.payload as unknown as TokenPayload
    } catch (e) {
      return null
    }
  }

  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex")
    const iterations = 100000
    const hash = crypto
      .pbkdf2Sync(password, salt, iterations, 64, "sha512")
      .toString("hex")
    return `${iterations}:${salt}:${hash}`
  }

  static verifyPassword(password: string, hash: string): boolean {
    const [iterationsStr, salt, storedHash] = hash.split(":")
    const iterations = parseInt(iterationsStr)
    const newHash = crypto
      .pbkdf2Sync(password, salt, iterations, 64, "sha512")
      .toString("hex")
    return newHash === storedHash
  }

  static generateMFASecret(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(6).toString("hex").toUpperCase())
    }
    return codes
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  static verifyCSRFToken(token: string, storedToken: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken))
  }
}

export interface RolePermission {
  role: string
  permissions: string[]
}

const rolePermissions: Record<string, string[]> = {
  ADMIN: [
    "users:read",
    "users:write",
    "users:delete",
    "settings:read",
    "settings:write",
    "reports:read",
    "reports:write",
    "compliance:read",
    "compliance:write",
    "audit:read",
  ],
  MANAGER: [
    "tasks:read",
    "tasks:write",
    "evidence:read",
    "evidence:write",
    "reports:read",
    "compliance:read",
  ],
  AUDITOR: [
    "tasks:read",
    "evidence:read",
    "reports:read",
    "audit:read",
    "compliance:read",
  ],
  USER: ["tasks:read", "evidence:read", "reports:read"],
  VIEWER: ["reports:read", "compliance:read"],
}

export function hasPermission(role: string, permission: string): boolean {
  const permissions = rolePermissions[role] || []
  return permissions.includes(permission) || permissions.includes(`${permission.split(":")[0]}:*`)
}

export interface AuditLogEntry {
  action: string
  userId: string
  organizationId: string
  resourceType: string
  resourceId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export function createAuditLog(
  action: string,
  userId: string,
  organizationId: string,
  resourceType: string,
  details: Record<string, any> = {}
): AuditLogEntry {
  return {
    action,
    userId,
    organizationId,
    resourceType,
    details,
    timestamp: new Date(),
  }
}
