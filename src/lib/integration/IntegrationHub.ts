import type { Schedule } from '@/types/schedule'
import type { IntegrationConfig, DataFlow, IntegrationStatus } from '@/types/integration'
import type { Env } from '@/types/cloudflare'
import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'
import { IntegrationEngine } from './IntegrationEngine'
import { ConnectorFactory } from './ConnectorFramework'
import type { BaseConnector } from './ConnectorFramework'
import type { ConnectorConfig } from '@/types/connector'

export class IntegrationHub {
  private errorHandler: ErrorHandler
  private logger: Logger
  private schedules: Map<string, Schedule>
  private integrationEngine: IntegrationEngine
  private activeConnectors: Map<string, BaseConnector>
  private monitors: Map<string, ReturnType<typeof setInterval>>

  constructor(private env: Env) {
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
    this.schedules = new Map()
    this.integrationEngine = new IntegrationEngine(env)
    this.activeConnectors = new Map()
    this.monitors = new Map()
  }

  async registerIntegration(config: IntegrationConfig): Promise<void> {
    try {
      await this.validateIntegration(config)
      await this.setupConnector(config)
      
      if (config.schedule) {
        await this.registerSchedule(config.id, config.schedule)
      }
      
      await this.startMonitoring(config.id)
      
      await this.logger.log(LogLevel.INFO, 'Integration registered', {
        integrationId: config.id
      })
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.HIGH,
        { config }
      )
      throw error
    }
  }

  async unregisterIntegration(integrationId: string): Promise<void> {
    try {
      await this.stopMonitoring(integrationId)
      await this.removeSchedule(integrationId)
      await this.cleanupConnector(integrationId)
      
      await this.logger.log(LogLevel.INFO, 'Integration unregistered', {
        integrationId
      })
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { integrationId }
      )
      throw error
    }
  }

  private async validateIntegration(config: IntegrationConfig): Promise<void> {
    // Implement validation logic
    if (!config.id || !config.sourceSystem || !config.targetSystem) {
      throw new Error('Invalid integration configuration')
    }

    // Validate data flows
    for (const flow of config.dataFlows) {
      if (!flow.sourceEntity || !flow.targetEntity || !flow.mappings) {
        throw new Error('Invalid data flow configuration')
      }
    }
  }

  private async setupConnector(config: IntegrationConfig): Promise<void> {
    const connectorConfig: ConnectorConfig = {
      id: config.id,
      type: 'rest', // Or determine from config
      name: config.name,
      system: config.sourceSystem,
      credentials: config.credentials || {},
      settings: {
        baseUrl: config.sourceUrl,
        headers: config.headers || {},
        timeout: 30000,
        retryConfig: {
          maxRetries: 3,
          backoff: 1000
        }
      }
    }

    const connector = ConnectorFactory.createConnector(connectorConfig)
    await connector.connect()
    this.activeConnectors.set(config.id, connector)
  }

  private async startMonitoring(integrationId: string): Promise<void> {
    const monitor = setInterval(async () => {
      try {
        const status = await this.checkIntegrationHealth(integrationId)
        await this.updateIntegrationStatus(integrationId, status)
      } catch (error) {
        await this.errorHandler.handleError(
          error as Error,
          ErrorSeverity.MEDIUM,
          { integrationId }
        )
      }
    }, 60000) // Monitor every minute

    this.monitors.set(integrationId, monitor)
  }

  private async stopMonitoring(integrationId: string): Promise<void> {
    const monitor = this.monitors.get(integrationId)
    if (monitor) {
      clearInterval(monitor)
      this.monitors.delete(integrationId)
    }
  }

  private async checkIntegrationHealth(integrationId: string): Promise<IntegrationStatus> {
    // Implement health check logic
    return 'active'
  }

  private async updateIntegrationStatus(integrationId: string, status: IntegrationStatus): Promise<void> {
    // Update integration status in database
    await this.env.DB.prepare(
      'UPDATE integrations SET status = ? WHERE id = ?'
    )
    .bind(status, integrationId)
    .run()
  }

  private async cleanupConnector(integrationId: string): Promise<void> {
    const connector = this.activeConnectors.get(integrationId)
    if (connector) {
      await connector.disconnect()
      this.activeConnectors.delete(integrationId)
    }
  }

  async registerSchedule(integrationId: string, schedule: Schedule): Promise<void> {
    try {
      this.schedules.set(integrationId, schedule)
      await this.handleSchedule(schedule)
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        {
          integrationId,
          scheduleType: schedule.type,
          errorDetails: error instanceof Error ? error.message : 'Unknown error'
        }
      )
      throw error
    }
  }

  async removeSchedule(integrationId: string): Promise<void> {
    this.schedules.delete(integrationId)
  }

  private async handleSchedule(schedule: Schedule): Promise<void> {
    if (schedule.type === 'recurring' && schedule.value) {
      // Handle recurring schedule based on cron or interval
      // Implement scheduling logic here
    } else if (schedule.type === 'one-time' && schedule.startTime) {
      // Handle one-time schedule
      const delay = schedule.startTime.getTime() - Date.now()
      if (delay > 0) {
        setTimeout(() => {
          // Execute integration
        }, delay)
      }
    } else if (schedule.type === 'conditional') {
      // Set up condition monitoring
      // Implement conditional execution logic
    }
  }
} 