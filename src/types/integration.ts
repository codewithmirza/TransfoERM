import type { Env } from './cloudflare'

export interface IntegrationConfig {
  id: string
  name: string
  sourceSystem: string
  targetSystem: string
  sourceUrl: string
  headers?: Record<string, string>
  credentials?: Record<string, any>
  dataFlows: DataFlow[]
  transformationRules?: TransformationRule[]
  schedule?: Schedule
  status: IntegrationStatus
}

export interface DataFlow {
  id: string
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

export interface Schedule {
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly'
  startTime?: Date
  endTime?: Date
}

export type IntegrationStatus = 'active' | 'paused' | 'failed' | 'completed' 