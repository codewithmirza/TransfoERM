import { AIEngine } from './AIEngine'
import { RAGEngine } from './RAGEngine'
import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { AIResponse, AIAssistantContext } from '@/types/ai'

interface DialogueContext {
  history: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  currentTopic?: string
  intentStack: string[]
  entities: Record<string, any>
}

export class DialogueManager {
  private static instance: DialogueManager
  private aiEngine: AIEngine
  private ragEngine: RAGEngine
  private errorHandler: ErrorHandler
  private dialogueContexts: Map<string, DialogueContext>
  private currentContext: DialogueContext | null = null

  private constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.ragEngine = RAGEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
    this.dialogueContexts = new Map()
  }

  static getInstance(): DialogueManager {
    if (!DialogueManager.instance) {
      DialogueManager.instance = new DialogueManager()
    }
    return DialogueManager.instance
  }

  async handleInput(
    userId: string,
    input: string,
    context: AIAssistantContext
  ): Promise<AIResponse> {
    try {
      const dialogueContext = this.getOrCreateContext(userId)
      
      // Add user input to history
      dialogueContext.history.push({
        role: 'user',
        content: input,
        timestamp: new Date()
      })

      // Analyze intent and update context
      const intent = await this.analyzeIntent(input, dialogueContext)
      if (intent) {
        dialogueContext.intentStack.push(intent)
      }

      // Get response using RAG with dialogue context
      const response = await this.ragEngine.query(input, {
        ...context,
        dialogueContext,
        intent
      })

      // Add assistant response to history
      dialogueContext.history.push({
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      })

      return response
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { userId, input, context }
      )
      throw error
    }
  }

  private async analyzeIntent(input: string, context: DialogueContext): Promise<string | null> {
    const prompt = `Analyze the intent of this message in the context of previous conversation:\n${input}`
    const response = await this.aiEngine.complete(prompt)
    return response.content
  }

  private getOrCreateContext(userId: string): DialogueContext {
    if (!this.dialogueContexts.has(userId)) {
      this.dialogueContexts.set(userId, {
        history: [],
        intentStack: [],
        entities: {}
      })
    }
    return this.dialogueContexts.get(userId)!
  }

  clearContext(userId: string): void {
    this.dialogueContexts.delete(userId)
  }

  async processMessage(message: string): Promise<string> {
    try {
      if (!this.currentContext) {
        this.currentContext = {
          history: [],
          intentStack: [],
          entities: {}
        }
      }

      const response = await this.aiEngine.run({
        type: 'dialogue',
        content: message,
        dialogueContext: this.currentContext
      })

      return response.content
    } catch (error) {
      await this.errorHandler.handleError(error as Error)
      throw error
    }
  }
} 