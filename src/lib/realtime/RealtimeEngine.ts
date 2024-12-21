import { EventEmitter } from 'events'
import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'
import { WebSocket } from 'ws'

export type RealtimeEvent = {
  type: string
  data: any
  timestamp: Date
  source: string
}

export type SubscriptionOptions = {
  filter?: (event: RealtimeEvent) => boolean
  transform?: (event: RealtimeEvent) => any
  batchSize?: number
  batchInterval?: number
}

export class RealtimeEngine extends EventEmitter {
  private static instance: RealtimeEngine
  private errorHandler: ErrorHandler
  private logger: Logger
  private connections: Map<string, WebSocket>
  private subscriptions: Map<string, Set<string>>
  private eventBuffer: Map<string, RealtimeEvent[]>

  private constructor() {
    super()
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
    this.connections = new Map()
    this.subscriptions = new Map()
    this.eventBuffer = new Map()
  }

  static getInstance(): RealtimeEngine {
    if (!RealtimeEngine.instance) {
      RealtimeEngine.instance = new RealtimeEngine()
    }
    return RealtimeEngine.instance
  }

  async connect(clientId: string, url: string): Promise<void> {
    try {
      const ws = new WebSocket(url)
      
      ws.on('open', () => {
        this.connections.set(clientId, ws)
        this.emit('clientConnected', { clientId, timestamp: new Date() })
      })

      ws.on('message', (data: string) => {
        this.handleMessage(clientId, data)
      })

      ws.on('error', async (error) => {
        await this.errorHandler.handleError(
          error,
          ErrorSeverity.HIGH,
          { context: 'RealtimeEngine.connect', clientId }
        )
      })

      ws.on('close', () => {
        this.connections.delete(clientId)
        this.emit('clientDisconnected', { clientId, timestamp: new Date() })
      })
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.HIGH,
        { context: 'RealtimeEngine.connect', clientId }
      )
      throw error
    }
  }

  async subscribe(
    clientId: string,
    eventType: string,
    options: SubscriptionOptions = {}
  ): Promise<void> {
    try {
      const subs = this.subscriptions.get(clientId) || new Set()
      subs.add(eventType)
      this.subscriptions.set(clientId, subs)

      if (options.batchSize) {
        this.startEventBuffering(clientId, eventType, options)
      }

      await this.logger.log(LogLevel.INFO, 'Client subscribed to event', {
        clientId,
        eventType,
        options
      })
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'RealtimeEngine.subscribe', clientId, eventType }
      )
      throw error
    }
  }

  async publish(event: RealtimeEvent): Promise<void> {
    try {
      this.emit('eventPublished', event)

      for (const [clientId, subs] of this.subscriptions.entries()) {
        if (subs.has(event.type)) {
          const connection = this.connections.get(clientId)
          if (connection && connection.readyState === WebSocket.OPEN) {
            connection.send(JSON.stringify(event))
          }
        }
      }
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.MEDIUM,
        { context: 'RealtimeEngine.publish', event }
      )
    }
  }

  private handleMessage(clientId: string, data: string): void {
    try {
      const message = JSON.parse(data)
      this.emit('messageReceived', { clientId, message, timestamp: new Date() })
    } catch (error) {
      this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.LOW,
        { context: 'RealtimeEngine.handleMessage', clientId, data }
      )
    }
  }

  private startEventBuffering(
    clientId: string,
    eventType: string,
    options: SubscriptionOptions
  ): void {
    const bufferKey = `${clientId}:${eventType}`
    this.eventBuffer.set(bufferKey, [])

    setInterval(() => {
      const buffer = this.eventBuffer.get(bufferKey) || []
      if (buffer.length >= (options.batchSize || 1)) {
        const connection = this.connections.get(clientId)
        if (connection && connection.readyState === WebSocket.OPEN) {
          connection.send(JSON.stringify({
            type: 'batch',
            events: buffer,
            timestamp: new Date()
          }))
          this.eventBuffer.set(bufferKey, [])
        }
      }
    }, options.batchInterval || 1000)
  }
} 