import type { ModuleHandler, ModuleType, ModuleConfig } from './modules'
import type { Schedule } from './schedule'
import type { NotificationConfig } from './notifications'

export class ModuleRegistry {
  private modules: Map<string, ModuleHandler>
  private static instance: ModuleRegistry

  private constructor() {
    this.modules = new Map()
  }

  static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry()
    }
    return ModuleRegistry.instance
  }
}

export interface CustomizationRequest {
  moduleType: 'finance' | 'hr' | 'inventory' | 'sales'
  industry: string
  companySize: 'small' | 'medium' | 'large' | 'enterprise'
  requirements: string[]
  compliance?: string[]
  integrations?: string[]
}

export interface SecurityAnalysisResult {
  vulnerabilities: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    recommendation: string
  }>
  recommendations: string[]
}

export interface IntegrationConfig {
  sourceSystem: string
  targetSystem: string
  dataFlows: DataFlow[]
  transformationRules?: TransformationRule[]
  schedule?: Schedule
}

export interface DataFlow {
  sourceEntity: string
  targetEntity: string
  mappings: Record<string, string>
  transformations?: TransformationRule[]
}

export interface TransformationRule {
  field: string
  transformation: string
  condition?: string
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule'
  config: {
    eventType?: string
    schedule?: string
  }
}

export interface WorkflowStepConfig {
  action: string;
  context: Record<string, any>;
  assignee?: string;
  template?: string;
  timeoutHours?: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action';
  config: WorkflowStepConfig;
}

export interface Workflow {
  id: string
  name: string
  version: number
  status: 'draft' | 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
  triggers: WorkflowTrigger[]
  steps: WorkflowStep[]
}

export interface WorkflowStepExecution {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  error?: Error
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  error?: Error
  steps: WorkflowStepExecution[]
}

export interface ErrorHandlingConfig {
  retryCount?: number
  retryDelay?: number
  fallbackAction?: string
  notifications?: NotificationConfig[]
}

export interface AIResponse {
  content: string
  confidence: number
  context: any
  metadata: {
    model: string
    processingTime: number
    tokens: number
  }
}

export type { ModuleConfig, ModuleType } from './modules'