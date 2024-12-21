import type { KVNamespace } from '@cloudflare/workers-types'

export class Cache {
  constructor(private kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    return this.kv.get<T>(key, 'json')
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const options = ttl ? { expirationTtl: ttl } : undefined
    await this.kv.put(key, JSON.stringify(value), options)
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key)
  }

  // Cache specific data types
  async cacheUserData(userId: string, data: any): Promise<void> {
    await this.set(`user:${userId}`, data, 3600) // 1 hour TTL
  }

  async getCachedUserData<T>(userId: string): Promise<T | null> {
    return this.get<T>(`user:${userId}`)
  }

  async cacheAIResponse(commandId: string, response: any): Promise<void> {
    await this.set(`ai:${commandId}`, response, 1800) // 30 minutes TTL
  }

  async getCachedAIResponse<T>(commandId: string): Promise<T | null> {
    return this.get<T>(`ai:${commandId}`)
  }
}
