import { EventEmitter } from 'events'
import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'
import type { 
  MonitoringMetric, 
  Alert, 
  HealthCheck,
  MonitoringDashboard,
  TimeFrame,
  MetricValue 
} from '@/types/monitoring'

export class MonitoringEngine extends EventEmitter {
  private static instance: MonitoringEngine
  private errorHandler: ErrorHandler
  private logger: Logger
  private metrics: Map<string, MonitoringMetric[]>
  private alerts: Map<string, Alert>
  private healthChecks: Map<string, HealthCheck>
  private dashboards: Map<string, MonitoringDashboard>

  private constructor() {
    super()
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
    this.metrics = new Map()
    this.alerts = new Map()
    this.healthChecks = new Map()
    this.dashboards = new Map()
  }

  static getInstance(): MonitoringEngine {
    if (!MonitoringEngine.instance) {
      MonitoringEngine.instance = new MonitoringEngine()
    }
    return MonitoringEngine.instance
  }

  async recordMetric(metric: MonitoringMetric): Promise<void> {
    try {
      const metrics = this.metrics.get(metric.name) || []
      metrics.push(metric)
      this.metrics.set(metric.name, metrics)
      
      await this.checkThresholds(metric)
      this.emit('metricRecorded', metric)
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'MonitoringEngine.recordMetric' }
      )
    }
  }

  async createAlert(alert: Alert): Promise<void> {
    try {
      this.alerts.set(alert.id, alert)
      this.emit('alertCreated', alert)
      
      if (alert.severity === 'critical') {
        await this.notifyStakeholders(alert)
      }
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.HIGH,
        { context: 'MonitoringEngine.createAlert' }
      )
    }
  }

  async updateHealthCheck(check: HealthCheck): Promise<void> {
    try {
      this.healthChecks.set(check.service, check)
      this.emit('healthCheckUpdated', check)

      if (check.status === 'unhealthy') {
        await this.createAlert({
          id: crypto.randomUUID(),
          severity: 'high',
          message: `Service ${check.service} is unhealthy`,
          source: 'health-check',
          timestamp: new Date(),
          status: 'active',
          metadata: check
        })
      }
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.HIGH,
        { context: 'MonitoringEngine.updateHealthCheck' }
      )
    }
  }

  async createDashboard(dashboard: MonitoringDashboard): Promise<void> {
    try {
      this.dashboards.set(dashboard.id, dashboard)
      this.emit('dashboardCreated', dashboard)
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'MonitoringEngine.createDashboard' }
      )
    }
  }

  private async checkThresholds(metric: MonitoringMetric): Promise<void> {
    // Implement threshold checking logic
    const thresholds = await this.getThresholds(metric.name)
    
    for (const threshold of thresholds) {
      if (this.isThresholdViolated(metric.value, threshold)) {
        await this.createAlert({
          id: crypto.randomUUID(),
          severity: threshold.severity,
          message: `Metric ${metric.name} violated threshold: ${threshold.description}`,
          source: 'threshold',
          timestamp: new Date(),
          status: 'active',
          metadata: { metric, threshold }
        })
      }
    }
  }

  private async getThresholds(metricName: string): Promise<any[]> {
    // Implement threshold retrieval logic
    return []
  }

  private isThresholdViolated(value: number, threshold: any): boolean {
    // Implement threshold violation check
    return false
  }

  private async notifyStakeholders(alert: Alert): Promise<void> {
    // Implement stakeholder notification logic
  }

  async getAllHealthChecks(): Promise<HealthCheck[]> {
    try {
      return Array.from(this.healthChecks.values())
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'MonitoringEngine.getAllHealthChecks' }
      )
      return []
    }
  }

  async getLatestMetrics(): Promise<any[]> {
    try {
      const latestMetrics = []
      const now = new Date()
      const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

      for (const [metricName, metricList] of this.metrics.entries()) {
        const values = metricList.filter(m => m.timestamp >= lastHour)
        if (values.length > 0) {
          latestMetrics.push({
            metricName,
            ...values[values.length - 1]
          })
        }
      }

      return latestMetrics
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'MonitoringEngine.getLatestMetrics' }
      )
      return []
    }
  }

  async getMetricHistory(
    metricName: string,
    timeframe: TimeFrame
  ): Promise<MetricValue[]> {
    try {
      const metrics = this.metrics.get(metricName) || []
      return this.filterMetricsByTimeframe(metrics, timeframe)
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'MonitoringEngine.getMetricHistory' }
      )
      return []
    }
  }

  private filterMetricsByTimeframe(
    metrics: MonitoringMetric[],
    timeframe: TimeFrame
  ): MonitoringMetric[] {
    if ('start' in timeframe) {
      return metrics.filter(m => 
        m.timestamp >= timeframe.start && 
        m.timestamp <= timeframe.end
      )
    } else {
      const now = new Date()
      const start = new Date(now.getTime() - this.convertTimeframeToMs(timeframe))
      return metrics.filter(m => m.timestamp >= start)
    }
  }

  private convertTimeframeToMs(timeframe: { last: number; unit: string }): number {
    const units = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000
    }
    return timeframe.last * units[timeframe.unit as keyof typeof units]
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.status === 'active')
  }
} 