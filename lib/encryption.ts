import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const ENCODING = "hex"
const AUTH_TAG_LENGTH = 16
const IV_LENGTH = 12

export class EncryptionService {
  private masterKey: Buffer

  constructor(masterKey: string = process.env.ENCRYPTION_KEY || "default-key-do-not-use-in-production") {
    const hash = crypto.createHash("sha256").update(masterKey).digest()
    this.masterKey = hash
  }

  encrypt(data: string, additionalData?: string): string {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, this.masterKey, iv)

    if (additionalData) {
      cipher.setAAD(Buffer.from(additionalData))
    }

    let encrypted = cipher.update(data, "utf8", ENCODING)
    encrypted += cipher.final(ENCODING)

    const authTag = cipher.getAuthTag()
    return `${iv.toString(ENCODING)}.${encrypted}.${authTag.toString(ENCODING)}`
  }

  decrypt(encryptedData: string, additionalData?: string): string {
    const parts = encryptedData.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format")
    }

    const iv = Buffer.from(parts[0], ENCODING)
    const encrypted = parts[1]
    const authTag = Buffer.from(parts[2], ENCODING)

    const decipher = crypto.createDecipheriv(ALGORITHM, this.masterKey, iv)
    decipher.setAuthTag(authTag)

    if (additionalData) {
      decipher.setAAD(Buffer.from(additionalData))
    }

    let decrypted = decipher.update(encrypted, ENCODING, "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  hashForCompliance(data: string): string {
    return crypto.createHash("sha256").update(data).digest(ENCODING)
  }

  static generateKey(): string {
    return crypto.randomBytes(32).toString(ENCODING)
  }
}

export const encryptionService = new EncryptionService()

export function pseudonymize(value: string, salt: string): string {
  return crypto
    .createHash("sha256")
    .update(value + salt)
    .digest(ENCODING)
}

export class FieldEncryption {
  static encryptFields(
    data: Record<string, any>,
    fieldsToEncrypt: string[],
    encService: EncryptionService = encryptionService
  ): Record<string, any> {
    const encrypted = { ...data }
    for (const field of fieldsToEncrypt) {
      if (field in encrypted && encrypted[field]) {
        encrypted[field] = encService.encrypt(String(encrypted[field]))
      }
    }
    return encrypted
  }

  static decryptFields(
    data: Record<string, any>,
    fieldsToDecrypt: string[],
    encService: EncryptionService = encryptionService
  ): Record<string, any> {
    const decrypted = { ...data }
    for (const field of fieldsToDecrypt) {
      if (field in decrypted && decrypted[field]) {
        try {
          decrypted[field] = encService.decrypt(String(decrypted[field]))
        } catch (e) {
          console.error(`Failed to decrypt field ${field}:`, e)
        }
      }
    }
    return decrypted
  }
}

export function maskSensitiveData(value: string, revealChars: number = 4): string {
  if (!value || value.length <= revealChars) return "*".repeat(value.length)
  const lastChars = value.slice(-revealChars)
  return "*".repeat(value.length - revealChars) + lastChars
}

export function tokenize(value: string): string {
  return crypto.randomUUID()
}

export function createDataToken(userId: string, organizationId: string): string {
  return crypto
    .createHash("sha256")
    .update(`${userId}:${organizationId}:${Date.now()}`)
    .digest(ENCODING)
}
