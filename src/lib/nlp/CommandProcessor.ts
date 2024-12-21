import { AIEngine } from '../ai/AIEngine'
import { WorkflowEngine } from '../workflow/WorkflowEngine'
import { WorkflowEngineProvider } from '../workflow/WorkflowEngineProvider'
import type { CommandResult } from '../../types/nlp'

export class CommandProcessor {
  private aiEngine: AIEngine
  private workflowEngine: WorkflowEngine

  constructor() {
    this.aiEngine = AIEngine.getInstance()
    this.workflowEngine = WorkflowEngineProvider.getInstance()
  }

  async processCommand(command: string): Promise<CommandResult> {
    // Parse natural language command using AI
    const intent = await this.aiEngine.analyzeIntent(command)
    
    // Generate workflow based on intent
    const workflow = await this.workflowEngine.generateWorkflow(intent)
    
    // Execute workflow
    const execution = await this.workflowEngine.execute(workflow)
    
    return {
      success: execution.status === 'completed',
      executionId: execution.id,
      data: execution.result,
      error: execution.error
    }
  }
} 