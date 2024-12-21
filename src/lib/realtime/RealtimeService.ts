import type { RealtimeMessage, RealtimeEventHandler } from '@/types/realtime'

export interface WebSocketConnection {
  id: string
  ws: WebSocket
  userId: string
  metadata?: {
    moduleType?: string
    permissions?: string[]
    lastActivity?: number
  }
}

export interface RealtimeState {
  modules: Map<string, any>;
  users: Map<string, any>;
  lastSync: number;
}

export class RealtimeService {
  private static instance: RealtimeService
  private handlers: Map<string, RealtimeEventHandler[]>
  private connections: Map<string, WebSocketConnection>
  private state: RealtimeState
  private ws: WebSocket | null

  private constructor() {
    this.handlers = new Map()
    this.connections = new Map()
    this.state = {
      modules: new Map(),
      users: new Map(),
      lastSync: Date.now()
    }
    this.ws = null
    this.setupHeartbeat()
  }

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService()
    }
    return RealtimeService.instance
  }

  private setupHeartbeat(): void {
    setInterval(() => {
      this.connections.forEach(connection => {
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.send(JSON.stringify({
            type: 'heartbeat',
            timestamp: Date.now()
          }))
        }
      })
    }, 30000) // 30 seconds
  }

  async broadcast(message: RealtimeMessage): Promise<void> {
    if (!this.ws) {
      await this.connect()
    }
    this.ws?.send(JSON.stringify(message))
  }

  async broadcastToModule(moduleId: string, message: RealtimeMessage): Promise<void> {
    this.connections.forEach(connection => {
      if (connection.metadata?.moduleType === moduleId && 
          connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify(message))
      }
    })
  }

  addConnection(connection: WebSocketConnection): void {
    this.connections.set(connection.id, connection)
    this.broadcastPresenceUpdate(connection, 'connected')
  }

  removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      this.broadcastPresenceUpdate(connection, 'disconnected')
      this.connections.delete(connectionId)
    }
  }

  private async broadcastPresenceUpdate(
    connection: WebSocketConnection, 
    status: 'connected' | 'disconnected'
  ): Promise<void> {
    await this.broadcast({
      type: 'presence:update',
      payload: {
        userId: connection.userId,
        status,
        metadata: connection.metadata,
        timestamp: Date.now()
      },
      userId: connection.userId,
      timestamp: Date.now()
    })
  }

  handleMessage(connectionId: string, message: RealtimeMessage): void {
    // Update last activity
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.metadata = {
        ...connection.metadata,
        lastActivity: Date.now()
      }
    }

    // Handle message
    const handlers = this.handlers.get(message.type) || []
    handlers.forEach(handler => handler(message))
  }

  on(type: string, handler: RealtimeEventHandler): void {
    const handlers = this.handlers.get(type) || []
    handlers.push(handler)
    this.handlers.set(type, handlers)
  }

  private async connect(): Promise<void> {
    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)
    return new Promise((resolve) => {
      this.ws!.onopen = () => resolve()
    })
  }
} 