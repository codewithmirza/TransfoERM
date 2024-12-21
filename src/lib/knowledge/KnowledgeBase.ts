import { RAGEngine } from '@/lib/ai/RAGEngine'
import { ErrorHandler } from '@/lib/error/ErrorHandler'
import type { Document } from '@/types/ai'
import type { Env } from '@/types/env'

export class KnowledgeBase {
  private static instance: KnowledgeBase
  private ragEngine: RAGEngine
  private errorHandler: ErrorHandler

  private constructor(env: Env) {
    this.ragEngine = RAGEngine.getInstance(env)
    this.errorHandler = ErrorHandler.getInstance()
  }

  static getInstance(env: Env): KnowledgeBase {
    if (!KnowledgeBase.instance) {
      KnowledgeBase.instance = new KnowledgeBase(env)
    }
    return KnowledgeBase.instance
  }

  async addDocument(document: { id: string; content: string; metadata?: Record<string, any> }) {
    try {
      await this.ragEngine.addToKnowledgeBase([document])
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  async addDocuments(documents: Array<{ id: string; content: string; metadata?: Record<string, any> }>) {
    try {
      await this.ragEngine.addToKnowledgeBase(documents)
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  async query(input: string, context?: Record<string, any>) {
    try {
      return await this.ragEngine.query(input, context || {})
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  async initialize(): Promise<void> {
    try {
      // Any initialization logic needed
      await this.ragEngine.initialize()
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }
} 