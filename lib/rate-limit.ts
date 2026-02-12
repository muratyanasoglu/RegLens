import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const apiRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"),
  analytics: true,
})

export const authRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
})

export const aiRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"),
  analytics: true,
})

export const exportRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
})

export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)
    return { success, limit, remaining, reset }
  } catch (e) {
    console.error("Rate limit check failed:", e)
    return { success: true, limit: 0, remaining: 0, reset: 0 }
  }
}

export class BruteForceProtection {
  private lockoutDuration = 15 * 60 * 1000 // 15 minutes
  private maxAttempts = 5

  async recordFailure(identifier: string): Promise<boolean> {
    const key = `brute:${identifier}`
    const attempts = await redis.incr(key)

    if (attempts === 1) {
      await redis.expire(key, Math.ceil(this.lockoutDuration / 1000))
    }

    return attempts < this.maxAttempts
  }

  async isLocked(identifier: string): Promise<boolean> {
    const key = `brute:${identifier}`
    const attempts = await redis.get<number>(key)
    return attempts ? attempts >= this.maxAttempts : false
  }

  async reset(identifier: string): Promise<void> {
    const key = `brute:${identifier}`
    await redis.del(key)
  }
}

export const bruteForceProtection = new BruteForceProtection()
