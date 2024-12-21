import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'
import { EventEmitter } from 'events'
import type { 
  ConnectorConfig, 
  ConnectorOperation, 
  ConnectorStatus,
  ConnectorMetrics,
  ConnectorEvent,
  ConnectorValidationResult 
} from '@/types/connector'

export abstract class BaseConnector extends EventEmitter {
  protected config: ConnectorConfig
  protected status: ConnectorStatus
  protected errorHandler: ErrorHandler
  protected logger: Logger
  protected metrics: ConnectorMetrics
  private metricsInterval: NodeJS.Timeout | null = null

  constructor(config: ConnectorConfig) {
    super()
    this.config = this.validateConfig(config)
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
    this.metrics = this.initializeMetrics()
    this.status = this.initializeStatus()
    this.startMetricsCollection()
  }

  abstract connect(): Promise<void>
  abstract disconnect(): Promise<void>
  abstract execute(operation: ConnectorOperation): Promise<any>
  abstract validateConnection(): Promise<boolean>

  protected initializeMetrics(): ConnectorMetrics {
    return {
      requestCount: 0,
      errorCount: 0,
      avgResponseTime: 0,
      successRate: 100,
      lastMinuteRequests: 0,
      activeConnections: 0,
      queueSize: 0,
      bytesTransferred: 0
    }
  }

  protected initializeStatus(): ConnectorStatus {
    return {
      isConnected: false,
      lastCheck: new Date(),
      metrics: this.metrics,
      errors: {
        errorCount: 0
      },
      performance: {
        avgResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: Number.MAX_VALUE,
        requestsPerSecond: 0
      }
    }
  }

  getStatus(): ConnectorStatus {
    return { ...this.status }
  }

  protected async updateMetrics(duration: number, hasError: boolean, byteCount: number): Promise<void> {
    this.metrics.requestCount++
    if (hasError) this.metrics.errorCount++
    
    // Update response time metrics
    const oldTotal = this.metrics.avgResponseTime * (this.metrics.requestCount - 1)
    this.metrics.avgResponseTime = (oldTotal + duration) / this.metrics.requestCount

    // Update performance metrics
    if (this.status.performance) {
      this.status.performance.maxResponseTime = Math.max(
        this.status.performance.maxResponseTime,
        duration
      )
      this.status.performance.minResponseTime = Math.min(
        this.status.performance.minResponseTime,
        duration
      )
    }

    // Update bytes transferred
    this.metrics.bytesTransferred += byteCount

    // Update success rate
    this.metrics.successRate = 
      ((this.metrics.requestCount - this.metrics.errorCount) / this.metrics.requestCount) * 100

    this.emit('metrics', { type: 'metric', timestamp: new Date(), data: this.metrics })
  }

  private startMetricsCollection(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
    }

    this.metricsInterval = setInterval(() => {
      this.collectMetrics()
    }, 60000) // Collect metrics every minute
  }

  private async collectMetrics(): Promise<void> {
    try {
      const isConnected = await this.validateConnection()
      this.status.isConnected = isConnected
      this.status.lastCheck = new Date()

      this.emit('status', {
        type: 'status',
        timestamp: new Date(),
        data: this.status
      })
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.LOW,
        { context: 'BaseConnector.collectMetrics' }
      )
    }
  }

  protected validateConfig(config: ConnectorConfig): ConnectorConfig {
    if (!config.id || !config.name || !config.type || !config.version) {
      throw new Error('Invalid connector configuration: missing required fields')
    }
    return config
  }

  async dispose(): Promise<void> {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
    }
    await this.disconnect()
  }
} 