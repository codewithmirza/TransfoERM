export type ConnectorOperationType = 'read' | 'write' | 'delete' | 'update' | 'ping' | 'function'

export interface ConnectorOperation {
  type: ConnectorOperationType
  payload?: Record<string, any>
  options?: Record<string, any>
}

export interface ConnectorConfig {
  id: string
  name: string
  type: string
  version: string
  options?: Record<string, any>
  credentials?: {
    username?: string
    password?: string
    apiKey?: string
    certificate?: string
  }
  retry?: {
    maxAttempts: number
    delay: number
    backoffFactor: number
  }
  timeout?: number
  encryption?: {
    enabled: boolean
    algorithm?: string
    keyPath?: string
  }
}

export interface ConnectorStatus {
  isConnected: boolean
  lastCheck: Date
  metrics: ConnectorMetrics
  errors?: {
    lastError?: Error
    errorCount: number
    lastErrorTime?: Date
  }
  performance?: {
    avgResponseTime: number
    maxResponseTime: number
    minResponseTime: number
    requestsPerSecond: number
  }
}

export interface ConnectorMetrics {
  requestCount: number
  errorCount: number
  avgResponseTime: number
  successRate: number
  lastMinuteRequests: number
  activeConnections: number
  queueSize: number
  bytesTransferred: number
}

export interface ConnectorValidationResult {
  isValid: boolean
  errors?: string[]
  warnings?: string[]
  suggestions?: string[]
}

export interface ConnectorEvent {
  type: 'connection' | 'operation' | 'error' | 'metric'
  timestamp: Date
  data: any
  metadata?: Record<string, any>
} 