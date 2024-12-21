import { EventEmitter } from 'events'
import type { 
  Workflow, 
  WorkflowStep, 
  WorkflowTrigger,
  WorkflowExecution,
  WorkflowStepExecution
} from '@/types/core'
import { WorkflowEngine } from './WorkflowEngine'

export class WorkflowEngineImpl extends EventEmitter implements WorkflowEngine {
  private workflows: Map<string, Workflow>
  private executions: Map<string, WorkflowExecution>

  constructor() {
    super()
    this.workflows = new Map()
    this.executions = new Map()
  }

  emit(eventName: string, data: any): boolean {
    return super.emit(eventName, data)
  }

  on(eventName: string, handler: (data: any) => Promise<void>): this {
    super.on(eventName, handler)
    return this
  }

  off(eventName: string, handler: (data: any) => Promise<void>): this {
    super.off(eventName, handler)
    return this
  }

  async registerWorkflow(workflow: Workflow): Promise<void> {
    const completeWorkflow: Workflow = {
      ...workflow,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.workflows.set(completeWorkflow.id, completeWorkflow)
  }

  async executeWorkflow(workflowId: string, context: any): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }

    const execution: WorkflowExecution = {
      id: crypto.randomUUID(),
      workflowId,
      status: 'running',
      startedAt: new Date(),
      steps: []
    }

    this.executions.set(execution.id, execution)
    await this.executeSteps(workflow.steps, execution, context)

    return execution
  }

  private async executeSteps(
    steps: WorkflowStep[],
    execution: WorkflowExecution,
    context: any
  ): Promise<void> {
    for (const step of steps) {
      const stepExecution: WorkflowStepExecution = {
        id: crypto.randomUUID(),
        status: 'pending',
        startedAt: new Date()
      }

      execution.steps.push(stepExecution)

      try {
        stepExecution.status = 'running'
        // Execute step logic here
        stepExecution.status = 'completed'
        stepExecution.completedAt = new Date()
      } catch (error) {
        stepExecution.status = 'failed'
        stepExecution.error = error as Error
        execution.status = 'failed'
        execution.error = error as Error
        break
      }
    }

    if (execution.status !== 'failed') {
      execution.status = 'completed'
      execution.completedAt = new Date()
    }
  }

  async startWorkflow(workflow: Workflow): Promise<void> {
    await this.registerWorkflow(workflow);
    await this.executeWorkflow(workflow.id, {});
  }
} 