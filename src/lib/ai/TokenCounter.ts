export class TokenCounter {
  private static readonly AVG_CHARS_PER_TOKEN = 4

  static estimateTokens(text: string): number {
    return Math.ceil(text.length / this.AVG_CHARS_PER_TOKEN)
  }

  static estimateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    }

    const modelPricing = pricing[model as keyof typeof pricing]
    if (!modelPricing) throw new Error(`Unknown model: ${model}`)

    return (
      (inputTokens * modelPricing.input) / 1000 +
      (outputTokens * modelPricing.output) / 1000
    )
  }
} 