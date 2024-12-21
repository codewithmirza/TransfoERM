import { WorkflowEngine } from './WorkflowEngine'

export class WorkflowEngineProvider {
  private static instance: WorkflowEngine

  static getInstance(): WorkflowEngine {
    if (!this.instance) {
      this.instance = new WorkflowEngine()
    }
    return this.instance
  }
} 