import { Message, AIResponse, AnalysisResult } from '@/types/ai/command'
import { AI_CONFIG } from './config'

export class CloudflareAI {
  private async createCompletion(messages: Message[], model: string): Promise<AIResponse> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/ai/run/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_AI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    return response.json()
  }

  async analyze(input: string): Promise<AnalysisResult> {
    const messages: Message[] = [
      {
        role: 'system',
        content: 'Analyze the following command and extract intent and entities.'
      },
      {
        role: 'user',
        content: input
      }
    ]

    const response = await this.createCompletion(messages, AI_CONFIG.models.analysis)
    return response.data
  }
} 