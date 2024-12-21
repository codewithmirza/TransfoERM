import { RateLimiter } from './ai/RateLimiter'
import { TokenCounter } from './ai/TokenCounter'
import { OpenAIMessage, OpenAICompletionOptions, OpenAICompletionResponse } from '@/types/openai'

export class OpenAI {
  private apiKey: string
  private baseUrl: string = 'https://api.openai.com/v1'
  private maxRetries: number = 3
  private retryDelay: number = 1000
  private rateLimiter: RateLimiter

  constructor(apiKey = process.env.OPENAI_API_KEY) {
    if (!apiKey) throw new Error('OpenAI API key is required')
    this.apiKey = apiKey
    this.rateLimiter = new RateLimiter()
  }

  async createCompletion(
    options: OpenAICompletionOptions,
    userId: string
  ): Promise<OpenAICompletionResponse> {
    // Check rate limit
    if (!await this.rateLimiter.canMakeRequest(userId)) {
      const waitTime = this.rateLimiter.getTimeUntilReset(userId)
      throw new OpenAIError(
        `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`,
        429,
        { waitTime }
      )
    }

    // Estimate tokens and cost
    const inputTokens = options.messages.reduce(
      (total, msg) => total + TokenCounter.estimateTokens(msg.content),
      0
    )

    if (inputTokens > this.getMaxTokens(options.model)) {
      throw new OpenAIError(
        'Input too long',
        400,
        { tokens: inputTokens }
      )
    }

    // Make the request with retries
    let lastError: Error | null = null
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest('/chat/completions', {
          method: 'POST',
          body: JSON.stringify({
            model: options.model,
            messages: options.messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.max_tokens ?? this.getMaxTokens(options.model),
            top_p: options.top_p ?? 1,
            frequency_penalty: options.frequency_penalty ?? 0,
            presence_penalty: options.presence_penalty ?? 0
          })
        })

        // Estimate cost
        const outputTokens = TokenCounter.estimateTokens(
          response.choices[0].message.content
        )
        const cost = TokenCounter.estimateCost(
          options.model,
          inputTokens,
          outputTokens
        )

        // Log usage
        await this.logUsage(userId, {
          model: options.model,
          inputTokens,
          outputTokens,
          cost
        })

        return response
      } catch (error) {
        lastError = error as Error
        if (this.shouldRetry(error)) {
          await this.wait(this.retryDelay * Math.pow(2, attempt))
          continue
        }
        throw error
      }
    }

    throw lastError || new Error('Failed to complete OpenAI request')
  }

  private getMaxTokens(model: string): number {
    const limits = {
      'gpt-4': 8192,
      'gpt-3.5-turbo': 4096
    }
    return limits[model as keyof typeof limits] || 4096
  }

  private async logUsage(userId: string, usage: {
    model: string
    inputTokens: number
    outputTokens: number
    cost: number
  }) {
    // Log to your database or monitoring system
    console.log('AI Usage:', { userId, ...usage })
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit
  ): Promise<OpenAICompletionResponse> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new OpenAIError(
        `OpenAI API error: ${response.statusText}`,
        response.status,
        error
      )
    }

    return response.json()
  }

  private shouldRetry(error: any): boolean {
    if (error instanceof OpenAIError) {
      // Retry on rate limits and server errors
      return error.status === 429 || error.status >= 500
    }
    // Retry on network errors
    return error instanceof TypeError
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export class OpenAIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: any
  ) {
    super(message)
    this.name = 'OpenAIError'
  }
} 