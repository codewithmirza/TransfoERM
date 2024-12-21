import OpenAI from 'openai'
import type { AIService } from '@/types/ai'

export class OpenAIService implements AIService {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async predict({ moduleId, dataType, historicalData, timeframe }: {
    moduleId: string
    dataType: string
    historicalData: any[]
    timeframe: string
  }) {
    // Implement prediction logic using OpenAI
    const response = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a data analysis AI. Analyze the historical data and make predictions.`
      }, {
        role: "user",
        content: JSON.stringify({ moduleId, dataType, historicalData, timeframe })
      }]
    })

    return this.parsePredictions(response.choices[0].message.content)
  }

  async analyze({ moduleId, dataType, historicalData, predictions }: {
    moduleId: string
    dataType: string
    historicalData: any[]
    predictions: any[]
  }) {
    // Implement analysis logic using OpenAI
    const response = await this.client.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are a business analysis AI. Provide insights based on the data.`
      }, {
        role: "user",
        content: JSON.stringify({ moduleId, dataType, historicalData, predictions })
      }]
    })

    return this.parseInsights(response.choices[0].message.content)
  }

  private parsePredictions(content: string | null): any[] {
    if (!content) return []
    try {
      return JSON.parse(content)
    } catch {
      return []
    }
  }

  private parseInsights(content: string | null): string[] {
    if (!content) return []
    try {
      return JSON.parse(content)
    } catch {
      return []
    }
  }
} 