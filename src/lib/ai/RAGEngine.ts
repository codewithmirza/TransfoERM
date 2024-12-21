import { VectorStore } from './VectorStore'
import { AIEngine } from './AIEngine'
import { KnowledgeBaseService } from '@/services/ai/KnowledgeBaseService'
import { ErrorHandler } from '../error/ErrorHandler'
import type { AIResponse, Document } from '@/types/ai'
import type { Env } from '@/types/env'
import type { VectorizeMatches } from '@cloudflare/workers-types'

interface StoredDocument extends Document {
  id: string
  content: string
  metadata: {
    source: string
    content: string
    [key: string]: any
  }
}

interface KBDocument {
  id: string
  content: string
  metadata: {
    source: string
    content: string
    score?: number
    [key: string]: any
  }
}

export class RAGEngine {
  private static instance: RAGEngine
  private vectorStore: VectorStore
  private aiEngine: AIEngine
  private knowledgeBase: KnowledgeBaseService
  private errorHandler: ErrorHandler

  private constructor(env: Env) {
    this.aiEngine = AIEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
    this.vectorStore = new VectorStore(env.VECTORIZE)
    this.knowledgeBase = new KnowledgeBaseService(
      this.vectorStore,
      env.KV,
      this.aiEngine,
      this.errorHandler
    )
  }

  static getInstance(env?: Env): RAGEngine {
    if (!RAGEngine.instance) {
      if (!env) {
        throw new Error('Environment configuration required for RAGEngine initialization')
      }
      RAGEngine.instance = new RAGEngine(env)
    }
    return RAGEngine.instance
  }

  async query(input: string, context: any): Promise<AIResponse> {
    try {
      const queryVector = await this.aiEngine.generateEmbedding(input)
      const matches = await this.vectorStore.query(queryVector)
      
      // Convert matches to documents
      const documents = await this.convertMatchesToDocuments(matches)

      const prompt = this.buildPrompt(input, documents, context)
      const response = await this.aiEngine.complete(prompt)

      return {
        ...response,
        context: {
          ...response.context,
          documents
        }
      }
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  private async convertMatchesToDocuments(matches: VectorizeMatches): Promise<KBDocument[]> {
    return Promise.all(
      matches.matches.map(async match => {
        const rawDoc = await this.knowledgeBase.getDocument(match.id)
        const storedDoc = rawDoc as unknown as StoredDocument
        
        const kbDoc: KBDocument = {
          id: storedDoc.id,
          content: storedDoc.content,
          metadata: {
            source: storedDoc.metadata.source,
            content: storedDoc.content,
            score: match.score
          }
        }
        return kbDoc
      })
    )
  }

  async addToKnowledgeBase(documents: Array<{ id: string; content: string; metadata?: Record<string, any> }>) {
    try {
      await this.knowledgeBase.addDocuments(documents)
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  private buildPrompt(query: string, documents: KBDocument[], context: any): string {
    const documentContext = documents
      .map(doc => `Context: ${doc.content}`)
      .join('\n\n')

    const userContext = context?.userContext 
      ? `Additional Context: ${JSON.stringify(context.userContext)}\n`
      : ''

    return `
${documentContext}

${userContext}
User Query: ${query}

Please provide a response based on the above context and query.
    `.trim()
  }

  async initialize(): Promise<void> {
    try {
      // Any initialization logic needed
      // For example, loading initial knowledge base, warming up embeddings, etc.
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }
} 