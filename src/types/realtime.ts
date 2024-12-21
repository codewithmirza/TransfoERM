export interface VoiceCommandResult {
  text: string
  confidence: number
  isFinal: boolean
  error?: string
  transcript?: string
}

export interface RealtimeUpdate {
  type: 'voice' | 'command' | 'system'
  data: any
  timestamp: number
  source: string
  metadata?: Record<string, any>
}

export interface RealtimeOptions {
  channel: string
  interval?: number
  retryAttempts?: number
  retryDelay?: number
}

export interface RealtimeConnection {
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  lastUpdate: number
  error?: Error
}

export interface RealtimeMessage<T = any> {
  id: string
  type: string
  data: T
  timestamp: number
  sender: string
  channel: string
}

export interface RealtimeSubscription {
  channel: string
  callback: (message: RealtimeMessage) => void
  options?: {
    history?: number
    filter?: (message: RealtimeMessage) => boolean
  }
}

export interface RealtimePresence {
  userId: string
  status: 'online' | 'away' | 'offline'
  lastSeen: number
  metadata?: Record<string, any>
}

export type RealtimeEventType = 
  | 'connect'
  | 'disconnect'
  | 'message'
  | 'presence'
  | 'error'
  | 'reconnect'
  | 'subscribe'
  | 'unsubscribe'

export interface RealtimeEvent {
  type: RealtimeEventType
  timestamp: number
  data?: any
  error?: Error
}

export interface RealtimeState {
  connection: RealtimeConnection
  subscriptions: Map<string, RealtimeSubscription>
  presence: Map<string, RealtimePresence>
  events: RealtimeEvent[]
}