import { CloudflareAI } from './CloudflareAI'
import { Intent, Entity, ValidationResult, CommandResult } from '@/types/ai/command'
import { BaseWorkflow, Workflow, N8NClient } from '@/types/workflow/types'
import { WorkflowGenerator } from '@/lib/workflow/WorkflowGenerator'

export class CommandProcessor {
  private workflowGenerator: WorkflowGenerator

  constructor(
    private ai: CloudflareAI,
    private n8nClient: N8NClient
  ) {
    this.workflowGenerator = new WorkflowGenerator(n8nClient)
  }

  async processCommand(input: string): Promise<CommandResult> {
    try {
      const intent = await this.recognizeIntent(input)
      const entities = await this.extractEntities(input)
      const validationResult = await this.validateCommand(intent, entities)
      
      if (validationResult.isValid) {
        const baseWorkflow = await this.workflowGenerator.generateWorkflow(intent, entities)
        
        // Create the full workflow with required methods
        const workflow: Workflow = {
          ...baseWorkflow,
          get: async () => ({ ...baseWorkflow }),
          create: async () => ({ id: baseWorkflow.id })
        }
        
        return {
          success: true,
          workflow
        }
      }
      
      return {
        success: false,
        error: validationResult.error
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  private async recognizeIntent(input: string): Promise<Intent> {
    const analysis = await this.ai.analyze(input)
    return analysis.intent
  }

  private async extractEntities(input: string): Promise<Entity[]> {
    const analysis = await this.ai.analyze(input)
    return analysis.entities
  }

  private async validateCommand(intent: Intent, entities: Entity[]): Promise<ValidationResult> {
    // Basic validation
    if (!intent.module || !intent.action) {
      return {
        isValid: false,
        error: 'Invalid command: missing module or action'
      }
    }

    if (intent.confidence < 0.7) {
      return {
        isValid: false,
        error: 'Command intent not clear enough'
      }
    }

    return {
      isValid: true
    }
  }
} 