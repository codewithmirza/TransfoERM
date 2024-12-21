export interface SystemMetrics {
  id: string
  timestamp: Date
  metrics: {
    cpu: number
    memory: number
    disk: number
    network: number
    latency: number
    errorRate: number
    throughput: number
  }
  tags: Record<string, string>
}

export interface MaintenancePrediction {
  systemId: string
  timestamp: Date
  predictions: {
    failureProbability: number
    timeToFailure: number
    affectedComponents: string[]
    suggestedActions: MaintenanceAction[]
    confidence: number
  }
  insights: string[]
}

export interface MaintenanceAction {
  type: 'replace' | 'repair' | 'optimize' | 'monitor'
  component: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedTime: number
  estimatedCost: number
  impact: {
    performance: number
    reliability: number
    cost: number
  }
} 