import { VectorizeService } from './vectorize'
import { LLMService } from './llm'
import { Env } from '@/types/cloudflare'

export class RAGService {
  private vectorize: VectorizeService
  private llm: LLMService

  constructor(env: Env) {
    this.vectorize = new VectorizeService(env)
    this.llm = new LLMService(env)
  }

  async streamQuery(
    question: string,
    onChunk: (chunk: { content: string; done: boolean }) => Promise<void>
  ): Promise<void> {
    try {
      // Search for relevant documents
      const results = await this.vectorize.search(question)
      const context = results.map(r => r.metadata.content)
      
      // Stream the response
      await this.llm.streamComplete(question, onChunk, context)
    } catch (error) {
      await onChunk({ 
        content: 'Sorry, I encountered an error processing your request.',
        done: true 
      })
      throw error
    }
  }

  async query(question: string): Promise<string> {
    const results = await this.vectorize.search(question)
    const context = results.map(r => r.metadata.content)
    return await this.llm.complete(question, context)
  }

  async addToKnowledgeBase(
    content: string,
    metadata: Record<string, any>
  ): Promise<void> {
    await this.vectorize.addDocument(content, {
      ...metadata,
      content,
      timestamp: new Date().toISOString()
    })
  }
} 