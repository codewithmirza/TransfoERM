export interface ErrorContext {
  flowId?: string
  flowType?: string
  integrationStatus?: string
  analysisType?: string
  metricsCount?: number
  dataSize?: number
  generationTime?: number
  codeSize?: number
  optimizationTarget?: string
  moduleId?: string
  executionTime?: number
  stepId?: string
  errorDetails?: string
  timestamp?: number
  flow?: any
  integrationId?: string
  requirements?: string[]
  codeLength?: number
  type?: string
  dataPoints?: number
  config?: any
  validationErrors?: string[]
  transformationErrors?: string[]
  [key: string]: any // Allow additional properties
}

export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const

export type ErrorSeverityType = typeof ErrorSeverity[keyof typeof ErrorSeverity]

export type ErrorHandlerParams = {
  error: Error
  severity: ErrorSeverityType
  context: Partial<ErrorContext>
} 