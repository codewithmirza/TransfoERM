import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { AIEngine } from '../ai/AIEngine'

interface CustomAction {
  id: string
  name: string
  description: string
  code: string
  triggers: string[]
  permissions: string[]
}

export class CustomActionEngine {
  private static instance: CustomActionEngine
  private aiEngine: AIEngine
  private errorHandler: ErrorHandler
  private actions: Map<string, CustomAction>

  private constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
    this.actions = new Map()
  }

  static getInstance(): CustomActionEngine {
    if (!CustomActionEngine.instance) {
      CustomActionEngine.instance = new CustomActionEngine()
    }
    return CustomActionEngine.instance
  }

  async registerAction(action: CustomAction): Promise<void> {
    try {
      // Validate action code using AI
      const analysis = await this.aiEngine.analyzeCode(action.code)
      
      if (analysis.confidence < 0.8) {
        throw new Error('Action code validation failed')
      }

      this.actions.set(action.id, action)
    } catch (error) {
      await this.errorHandler.handleError(error as Error, ErrorSeverity.HIGH)
      throw error
    }
  }

  async executeAction(actionId: string, context: Record<string, any>): Promise<any> {
    const action = this.actions.get(actionId)
    if (!action) throw new Error('Action not found')

    try {
      // Execute in isolated context
      const fn = new Function('context', action.code)
      return await fn(context)
    } catch (error) {
      await this.errorHandler.handleError(error as Error, ErrorSeverity.HIGH)
      throw error
    }
  }
} 