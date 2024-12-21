interface CacheConfig {
  ttl: number
  maxSize: number
  strategy: 'lru' | 'lfu'
}

export class CacheOptimizer {
  private static instance: CacheOptimizer
  private cache: Map<string, { data: any; timestamp: number; hits: number }>
  private config: CacheConfig

  private constructor() {
    this.cache = new Map()
    this.config = {
      ttl: 3600000, // 1 hour
      maxSize: 1000,
      strategy: 'lru'
    }
  }

  static getInstance(): CacheOptimizer {
    if (!CacheOptimizer.instance) {
      CacheOptimizer.instance = new CacheOptimizer()
    }
    return CacheOptimizer.instance
  }

  async set(key: string, value: any, options?: Partial<CacheConfig>): Promise<void> {
    this.evictIfNeeded()
    
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      hits: 0
    })
  }

  async get(key: string): Promise<any> {
    const item = this.cache.get(key)
    if (!item) return null

    if (this.isExpired(item)) {
      this.cache.delete(key)
      return null
    }

    item.hits++
    return item.data
  }

  private isExpired(item: { timestamp: number }): boolean {
    return Date.now() - item.timestamp > this.config.ttl
  }

  private evictIfNeeded(): void {
    if (this.cache.size >= this.config.maxSize) {
      if (this.config.strategy === 'lru') {
        const oldest = Array.from(this.cache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0]
        if (oldest) this.cache.delete(oldest[0])
      } else {
        const leastUsed = Array.from(this.cache.entries())
          .sort(([, a], [, b]) => a.hits - b.hits)[0]
        if (leastUsed) this.cache.delete(leastUsed[0])
      }
    }
  }
} 