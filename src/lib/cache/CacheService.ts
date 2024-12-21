import type { CacheEntry } from '@/types/modules'

export class CacheService {
  private cache: Map<string, CacheEntry>
  private defaultTTL: number

  constructor(defaultTTL = 3600000) { // 1 hour default TTL
    this.cache = new Map()
    this.defaultTTL = defaultTTL
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    this.cache.set(key, entry)
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key) as CacheEntry<T>
    if (!entry) return null

    if (this.isExpired(entry)) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached

    const value = await factory()
    await this.set(key, value, ttl)
    return value
  }
} 