import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { RateLimiter } from '../RateLimiter'

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter
  const userId = 'test-user'

  beforeEach(() => {
    jest.useFakeTimers()
    rateLimiter = new RateLimiter(1000, 2) // 2 requests per second
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should allow requests within limit', async () => {
    const result1 = await rateLimiter.canMakeRequest(userId)
    const result2 = await rateLimiter.canMakeRequest(userId)

    expect(result1).toBe(true)
    expect(result2).toBe(true)
  })

  it('should block requests over limit', async () => {
    await rateLimiter.canMakeRequest(userId)
    await rateLimiter.canMakeRequest(userId)
    const result = await rateLimiter.canMakeRequest(userId)

    expect(result).toBe(false)
  })

  it('should reset after window', async () => {
    await rateLimiter.canMakeRequest(userId)
    await rateLimiter.canMakeRequest(userId)
    
    jest.advanceTimersByTime(1000)
    
    const result = await rateLimiter.canMakeRequest(userId)
    expect(result).toBe(true)
  })

  it('should calculate correct reset time', async () => {
    const now = Date.now()
    await rateLimiter.canMakeRequest(userId)
    
    const resetTime = rateLimiter.getTimeUntilReset(userId)
    expect(resetTime).toBeLessThanOrEqual(1000)
    expect(resetTime).toBeGreaterThan(0)
  })
}) 