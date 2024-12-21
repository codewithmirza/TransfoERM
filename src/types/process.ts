export interface ProcessModel {
  id: string
  name: string
  version: string
  nodes: ProcessNode[]
  edges: ProcessEdge[]
  metrics: ProcessMetrics
}

export interface ProcessNode {
  id: string
  type: 'activity' | 'gateway' | 'event'
  name: string
  properties: Record<string, any>
  metrics: ActivityMetrics
}

export interface ProcessEdge {
  id: string
  source: string
  target: string
  type: 'sequence' | 'message' | 'association'
  properties: Record<string, any>
}

export interface ProcessEvent {
  id: string
  type: string
  timestamp: Date
  activity: string
  resource: string
  case: string
  attributes: Record<string, any>
}

export interface ProcessMetrics {
  throughputTime: number
  waitingTime: number
  processingTime: number
  costPerCase: number
  resourceUtilization: number
}

export interface ActivityMetrics {
  frequency: number
  duration: {
    average: number
    min: number
    max: number
  }
  cost: number
  resources: string[]
}

export interface Bottleneck {
  nodeId: string
  type: 'waiting' | 'processing' | 'resource'
  severity: 'high' | 'medium' | 'low'
  impact: {
    time: number
    cost: number
  }
  recommendation: string
}

export interface ProcessOptimization {
  type: 'automation' | 'parallelization' | 'elimination' | 'resequencing'
  target: string[]
  description: string
  impact: {
    timeReduction: number
    costReduction: number
  }
  implementation: {
    difficulty: 'high' | 'medium' | 'low'
    steps: string[]
    prerequisites: string[]
  }
} 