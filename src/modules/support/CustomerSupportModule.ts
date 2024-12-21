import { AIEngine } from '@/lib/ai/AIEngine'
import { RAGEngine } from '@/lib/ai/RAGEngine'
import { DialogueManager } from '@/lib/ai/DialogueManager'
import { ErrorHandler } from '@/lib/error/ErrorHandler'

interface SupportTicket {
  id: string
  userId: string
  query: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  history: Array<{
    action: string
    timestamp: Date
    actor: string
    details: any
  }>
}

export class CustomerSupportModule {
  private aiEngine: AIEngine
  private ragEngine: RAGEngine
  private dialogueManager: DialogueManager
  private errorHandler: ErrorHandler
  private activeTickets: Map<string, SupportTicket>

  constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.ragEngine = RAGEngine.getInstance()
    this.dialogueManager = DialogueManager.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
    this.activeTickets = new Map()
  }

  async handleQuery(userId: string, query: string): Promise<string> {
    try {
      // First try automated response
      const response = await this.ragEngine.query(query, { userId })
      
      if (response.confidence > 0.8) {
        return response.content
      }

      // If confidence is low, create support ticket
      const ticket = await this.createTicket(userId, query)
      return `Support ticket created: ${ticket.id}. Our team will assist you shortly.`
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }

  private async createTicket(userId: string, query: string): Promise<SupportTicket> {
    const ticket: SupportTicket = {
      id: crypto.randomUUID(),
      userId,
      query,
      status: 'open',
      priority: await this.determinePriority(query),
      history: [{
        action: 'created',
        timestamp: new Date(),
        actor: 'system',
        details: { query }
      }]
    }

    this.activeTickets.set(ticket.id, ticket)
    return ticket
  }

  private async determinePriority(query: string): Promise<'low' | 'medium' | 'high'> {
    const analysis = await this.aiEngine.analyzeCode(query)
    const urgencyScore = analysis.confidence

    if (urgencyScore > 0.8) return 'high'
    if (urgencyScore > 0.5) return 'medium'
    return 'low'
  }
} 