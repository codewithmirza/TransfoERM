import { AIEngine } from '@/lib/ai/AIEngine'
import { RAGEngine } from '@/lib/ai/RAGEngine'
import { DialogueManager } from '@/lib/ai/DialogueManager'
import { ErrorHandler } from '@/lib/error/ErrorHandler'

interface SupportResponse {
  content: string
  confidence: number
  suggestedActions?: string[]
  metadata?: Record<string, any>
}

export class AutomatedSupportService {
  private aiEngine: AIEngine
  private ragEngine: RAGEngine
  private dialogueManager: DialogueManager
  private errorHandler: ErrorHandler

  constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.ragEngine = RAGEngine.getInstance()
    this.dialogueManager = DialogueManager.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
  }

  async handleQuery(userId: string, query: string): Promise<SupportResponse> {
    try {
      // First try RAG-based response
      const ragResponse = await this.ragEngine.query(query, { userId })
      
      if (ragResponse.confidence > 0.8) {
        return {
          content: ragResponse.content,
          confidence: ragResponse.confidence,
          metadata: ragResponse.metadata
        }
      }

      // If RAG confidence is low, use dialogue manager
      const dialogueResponse = await this.dialogueManager.handleInput(
        userId,
        query,
        {
          userId,
          currentModule: 'support',
          userRole: 'customer',
          recentActions: [],
          companyContext: {
            industry: 'technology',
            size: 'enterprise',
            region: 'global'
          }
        }
      )

      return {
        content: dialogueResponse.content,
        confidence: dialogueResponse.confidence,
        suggestedActions: this.extractActions(dialogueResponse)
      }
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  private extractActions(response: any): string[] {
    try {
      return JSON.parse(response.metadata?.suggestedActions || '[]')
    } catch {
      return []
    }
  }
} 