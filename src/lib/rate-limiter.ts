import { Env } from '@/types/cloudflare'

interface RateLimitConfig {
  limit: number
  window: number // in seconds
}

interface RateLimitResult {
  allowed: boolean
  retryAfter: number
  remaining: number
}

export class RateLimiter {
  constructor(private env: Env) {}

  async checkLimit(
    key: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const { limit, window } = config
    const current = await this.env.CACHE.get(key)
    const count = current ? parseInt(current) : 0

    if (count >= limit) {
      const ttl = await this.env.CACHE.get(`${key}:ttl`)
      const retryAfter = ttl ? parseInt(ttl) : window
      return { 
        allowed: false, 
        retryAfter,
        remaining: 0
      }
    }

    await this.env.CACHE.put(key, (count + 1).toString(), { 
      expirationTtl: window 
    })
    
    if (count === 0) {
      await this.env.CACHE.put(`${key}:ttl`, window.toString(), { 
        expirationTtl: window 
      })
    }

    return { 
      allowed: true, 
      retryAfter: 0,
      remaining: limit - (count + 1)
    }
  }

  generateKey(prefix: string, identifier: string): string {
    return `rate_limit:${prefix}:${identifier}`
  }
} 