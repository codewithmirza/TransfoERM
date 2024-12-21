import { VectorStore } from '@/lib/ai/VectorStore'
import { ErrorHandler } from '@/lib/error/ErrorHandler'
import { AIEngine } from '@/lib/ai/AIEngine'
import type { KVNamespace } from '@/types/env'

export class KnowledgeBaseService {
  constructor(
    private vectorStore: VectorStore,
    private kv: KVNamespace,
    private aiEngine: AIEngine,
    private errorHandler: ErrorHandler
  ) {}

  async addDocuments(documents: Array<{ id: string; content: string; metadata?: Record<string, any> }>) {
    try {
      // Generate embeddings for each document
      const embeddings = await Promise.all(
        documents.map(async doc => {
          // Using run method instead of generateEmbedding
          const vector = await this.aiEngine.run({
            type: 'embedding',
            content: doc.content
          }) as number[]
          
          return {
            id: doc.id,
            vector
          }
        })
      )

      // Store vectors in the vector store
      await this.vectorStore.bulkInsert(embeddings)

      // Store original documents in KV
      await Promise.all(
        documents.map(doc =>
          this.kv.put(
            `doc:${doc.id}`,
            JSON.stringify({
              content: doc.content,
              metadata: doc.metadata || {},
              timestamp: Date.now()
            })
          )
        )
      )
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  async getDocument(id: string): Promise<Document> {
    try {
      const docString = await this.kv.get(`doc:${id}`)
      if (!docString) {
        throw new Error(`Document ${id} not found`)
      }
      return JSON.parse(docString) as Document
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  // Rest of the class implementation...
} 