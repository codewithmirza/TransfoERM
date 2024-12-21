import { AIResponse, ModelType } from '@/types/ai'

export class AIService {
  private static instance: AIService
  private readonly cache: Map<string, { data: any; timestamp: number }>
  private readonly dialogueHistory: Map<string, Array<{ role: string; content: string }>>
  private readonly vectorizeIndex: string

  private constructor() {
    this.cache = new Map()
    this.dialogueHistory = new Map()
    this.vectorizeIndex = process.env.VECTORIZE_INDEX_NAME!
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async processDialogue(
    userId: string,
    input: string,
    context?: Record<string, any>
  ): Promise<AIResponse> {
    const history = this.getOrCreateHistory(userId)
    history.push({ role: 'user', content: input })

    const response = await this.analyze('dialogue', {
      input,
      context,
      dialogueHistory: history
    })

    history.push({ role: 'assistant', content: response.content })
    if (history.length > 10) history.splice(0, 2) // Keep last 5 exchanges
    
    return response
  }

  private getOrCreateHistory(userId: string) {
    if (!this.dialogueHistory.has(userId)) {
      this.dialogueHistory.set(userId, [])
    }
    return this.dialogueHistory.get(userId)!
  }

  async analyze(context: string, data: any): Promise<AIResponse> {
    const cacheKey = `${context}:${JSON.stringify(data)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.data as AIResponse;
    }

    // Get relevant context from Vectorize
    const contextData = await this.getContext(context, data);

    // Use Workers AI with Llama for completion
    const completionResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/llama/2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: this.formatPrompt(context, data, contextData),
        max_tokens: 500
      })
    });

    const completion = await completionResponse.json() as {
      result: {
        response: string;
        processing_time: number;
        total_tokens: number;
        confidence: number;
      }
    };

    const response: AIResponse = {
      content: completion.result.response,
      confidence: completion.result.confidence,
      context: contextData,
      metadata: {
        model: '@cf/llama/2',
        processingTime: completion.result.processing_time,
        tokens: completion.result.total_tokens
      }
    };

    this.cache.set(cacheKey, { data: response, timestamp: Date.now() });
    return response;
  }

  async monitor(context: string, config: any): Promise<void> {
    // Set up continuous monitoring using Workers
    const monitoringWorker = new Worker(process.env.MONITORING_WORKER_URL!, {
      name: `monitor-${context}`
    });

    monitoringWorker.postMessage({
      type: 'startMonitoring',
      context,
      config
    });
  }

  async embed(input: { content: string; metadata: Record<string, any> }): Promise<number[]> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/baai/bge-base-en-v1.5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: input.content,
        metadata: input.metadata
      })
    });

    const result = await response.json() as {
      result: {
        embedding: number[]
      }
    };

    return result.result.embedding;
  }

  private async getContext(context: string, data: any): Promise<any> {
    const embedding = await this.generateEmbedding(JSON.stringify(data));
    
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/{account_id}/vectorize/indexes/${this.vectorizeIndex}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vector: embedding,
        topK: 5,
        namespace: context
      })
    });

    const queryResult = await response.json() as {
      result: {
        matches: any[]
      }
    };

    return queryResult.result.matches;
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/baai/bge-base-en-v1.5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text
      })
    });

    const embeddingResult = await response.json() as {
      result: {
        embedding: number[]
      }
    };

    return embeddingResult.result.embedding;
  }

  private formatPrompt(context: string, data: any, contextData: any): string {
    return `Context: ${context}\nData: ${JSON.stringify(data)}\nHistorical Context: ${JSON.stringify(contextData)}\nPlease analyze this information and provide insights and recommendations.`;
  }
} 