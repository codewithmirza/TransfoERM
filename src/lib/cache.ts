import { Env } from '@/types/cloudflare'

export class CacheService {
  constructor(private env: Env) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.env.CACHE.get(key)
    if (!cached) return null
    return JSON.parse(cached) as T
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.env.CACHE.put(
      key,
      JSON.stringify(value),
      ttl ? { expirationTtl: ttl } : undefined
    )
  }

  async delete(key: string): Promise<void> {
    await this.env.CACHE.delete(key)
  }

  generateKey(...parts: string[]): string {
    return parts.join(':')
  }
} 