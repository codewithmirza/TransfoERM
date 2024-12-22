import { Intent, Entity } from '@/types/ai/command'

// Base workflow interfaces
export interface BaseWorkflow {
  id: string
  nodes: WorkflowNode[]
  connections: Connection[]
  metadata: WorkflowMetadata
}

// Extended workflow interface with required methods
export interface Workflow extends BaseWorkflow {
  get: () => Promise<any>
  create: () => Promise<any>
}

export interface WorkflowNode {
  id: string
  type: string
  parameters: Record<string, any>
  position: [number, number]
}

export interface Connection {
  source: string
  target: string
  type: 'main' | 'error'
}

export interface WorkflowMetadata {
  intent: Intent
  entities: Entity[]
  created: Date
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: Connection[]
}

export interface N8NClient {
  createWorkflow(workflow: BaseWorkflow): Promise<string>
  executeWorkflow(id: string, data?: any): Promise<any>
} 