import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger } from '../logging/Logger'
import { Env } from '@/types/env'

export class CacheManager {
  private errorHandler: ErrorHandler
  private logger: Logger

  constructor(private env: Env) {
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.env.CACHE.get(key)
    } catch (error) {
      this.logger.error('Cache Get Error:', error)
      throw this.errorHandler.handleError(
        error instanceof Error ? error : new Error('Cache Get Error'),
        ErrorSeverity.MEDIUM,
        { key }
      )
    }
  }

  async set(
    key: string,
    value: string,
    options: { ttl?: number } = {}
  ): Promise<void> {
    try {
      const ttl = options.ttl || await this.calculateCacheTTL(key)
      await this.env.CACHE.put(key, value, { expirationTtl: ttl })
    } catch (error) {
      this.logger.error('Cache Set Error:', error)
      throw this.errorHandler.handleError(
        error instanceof Error ? error : new Error('Cache Set Error'),
        ErrorSeverity.MEDIUM,
        { key, ttl: options.ttl }
      )
    }
  }

  private async calculateCacheTTL(key: string): Promise<number> {
    const baseTime = 3600 // 1 hour
    const multipliers = {
      volatility: await this.getVolatilityMultiplier(key),
      importance: await this.getImportanceMultiplier(key),
      frequency: await this.getFrequencyMultiplier(key)
    }

    return Math.floor(
      baseTime * 
      multipliers.volatility * 
      multipliers.importance * 
      multipliers.frequency
    )
  }

  private async getVolatilityMultiplier(key: string): Promise<number> {
    const stats = await this.getKeyStats(key)
    return stats.updateFrequency > 10 ? 0.5 : 
           stats.updateFrequency > 5 ? 0.75 : 
           1
  }

  private async getImportanceMultiplier(key: string): Promise<number> {
    const stats = await this.getKeyStats(key)
    return stats.accessCount > 1000 ? 0.5 :
           stats.accessCount > 100 ? 0.75 :
           1
  }

  private async getFrequencyMultiplier(key: string): Promise<number> {
    const stats = await this.getKeyStats(key)
    return stats.accessFrequency > 10 ? 2 :
           stats.accessFrequency > 5 ? 1.5 :
           1
  }

  private async getKeyStats(key: string): Promise<{
    updateFrequency: number
    accessCount: number
    accessFrequency: number
  }> {
    const stats = await this.env.KV.get(`cache:stats:${key}`)
    return stats ? JSON.parse(stats) : {
      updateFrequency: 0,
      accessCount: 0,
      accessFrequency: 0
    }
  }
} 