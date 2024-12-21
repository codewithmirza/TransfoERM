import { describe, it, expect, beforeEach } from 'vitest'
import { AIEngine } from '@/lib/ai/AIEngine'

describe('AIEngine', () => {
  let engine: AIEngine

  beforeEach(() => {
    engine = AIEngine.getInstance()
  })

  it('should analyze code', async () => {
    const code = `
      function processUserInput(input) {
        return eval(input) // Unsafe
      }
    `

    const result = await engine.analyzeCode(code)
    expect(result.quality.security).toBeLessThan(50)
    expect(result.issues).toHaveLength(1)
    expect(result.issues[0].type).toBe('error')
  })

  it('should suggest optimizations', async () => {
    const code = `
      function calculateTotal(items) {
        let total = 0
        for (let i = 0; i < items.length; i++) {
          total += items[i].price
        }
        return total
      }
    `

    const suggestions = await engine.suggestOptimizations(code)
    expect(suggestions).toHaveLength(1)
    expect(suggestions[0].type).toBe('performance')
  })
}) 