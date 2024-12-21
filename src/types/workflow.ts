export interface WorkflowDefinition {
  id: string
  name: string
  version: string
  steps: WorkflowStep[]
  initialData?: Record<string, any>
  timeout?: number
  errorHandling?: WorkflowErrorConfig
  metadata?: Record<string, any>
}

export type WorkflowStepType = 'task' | 'decision' | 'parallel' | 'loop' | 'wait'

export interface BaseWorkflowStep {
  id: string
  type: WorkflowStepType
  action: string
  params?: Record<string, any>
  errorHandling?: {
    retry?: boolean
    maxRetries?: number
    retryDelay?: number
    fallbackAction?: string
  }
}

export interface TaskStep extends BaseWorkflowStep {
  type: 'task'
  next?: string
}

export interface DecisionStep extends BaseWorkflowStep {
  type: 'decision'
  condition: string
  next: string | [string, string] // [trueStep, falseStep]
}

export interface ParallelStep extends BaseWorkflowStep {
  type: 'parallel'
  next: string[]
}

export interface LoopStep extends BaseWorkflowStep {
  type: 'loop'
  condition: string
  next: string[]
}

export interface WaitStep extends BaseWorkflowStep {
  type: 'wait'
  next?: string
  params: {
    duration: number
  }
}

export type WorkflowStep = 
  | TaskStep 
  | DecisionStep 
  | ParallelStep 
  | LoopStep 
  | WaitStep

export interface WorkflowContext {
  workflowId: string
  stepId?: string
  data: Record<string, any>
  metadata: {
    startTime: Date
    retryCount: number
    path: string[]
  }
}

export interface WorkflowErrorConfig {
  retry?: boolean
  maxRetries?: number
  retryDelay?: number
  fallbackAction?: string
  notifications?: NotificationConfig[]
}

export interface NotificationConfig {
  type: 'email' | 'slack' | 'webhook'
  target: string
  template?: string
}

export interface WorkflowInstance {
  id: string
  workflowId: string
  status: WorkflowStatus
  currentStep?: string
  data: Record<string, any>
  error?: Error
  startTime: Date
  endTime?: Date
  metadata?: Record<string, any>
}

export type WorkflowStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'suspended' 

export type WorkflowNodeType = 'trigger' | 'action' | 'condition'

export interface WorkflowNode {
  id: string
  type: WorkflowNodeType
  parameters: Record<string, any>
  position: { x: number; y: number }
}

export interface Workflow {
  id?: string
  name: string
  nodes: WorkflowNode[]
  connections: Array<{
    sourceNode: string
    targetNode: string
  }>
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  result?: any
  error?: string
} 