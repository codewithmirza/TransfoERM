import { MonitoringEngine } from '../monitoring/MonitoringEngine'
import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'
import type { HealthCheck, MonitoringMetric, Alert } from '@/types/monitoring'
import crypto from 'crypto'

export class MonitoringService {
  private static instance: MonitoringService
  private monitoringEngine: MonitoringEngine
  private errorHandler: ErrorHandler
  private logger: Logger

  private constructor() {
    this.monitoringEngine = MonitoringEngine.getInstance()
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    checks: HealthCheck[]
    alerts: Alert[]
  }> {
    try {
      const checks = await this.monitoringEngine.getAllHealthChecks()
      const alerts = await this.monitoringEngine.getActiveAlerts()

      const status = this.determineOverallStatus(checks, alerts)

      return {
        status,
        checks,
        alerts
      }
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.HIGH,
        { context: 'MonitoringService.getSystemHealth' }
      )
      throw error
    }
  }

  async getPerformanceMetrics(): Promise<{
    current: Record<string, number>
    historical: MonitoringMetric[]
  }> {
    try {
      const latestMetrics = await this.monitoringEngine.getLatestMetrics()
      const historicalData = await this.monitoringEngine.getMetricHistory('system', {
        last: 24,
        unit: 'hours'
      })

      const historical: MonitoringMetric[] = historicalData.map(data => ({
        id: crypto.randomUUID(),
        name: 'system',
        value: data.value,
        timestamp: data.timestamp,
        type: 'gauge',
        labels: data.tags || {}
      }))

      return {
        current: this.transformMetrics(latestMetrics),
        historical
      }
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'MonitoringService.getPerformanceMetrics' }
      )
      throw error
    }
  }

  private determineOverallStatus(
    checks: HealthCheck[],
    alerts: Alert[]
  ): 'healthy' | 'degraded' | 'unhealthy' {
    if (checks.some(check => check.status === 'unhealthy') ||
        alerts.some(alert => alert.severity === 'critical')) {
      return 'unhealthy'
    }

    if (checks.some(check => check.status === 'degraded') ||
        alerts.some(alert => alert.severity === 'high')) {
      return 'degraded'
    }

    return 'healthy'
  }

  private transformMetrics(metrics: MonitoringMetric[]): Record<string, number> {
    return metrics.reduce((acc, metric) => {
      acc[metric.name] = metric.value
      return acc
    }, {} as Record<string, number>)
  }
} 