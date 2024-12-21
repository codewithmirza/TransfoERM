export interface SyncOperation {
  id: string
  moduleId: string
  timestamp: number
  data: any
  type: 'create' | 'update' | 'delete'
  metadata?: Record<string, any>
}

export interface SyncState {
  lastUpdate: number
  data: any
  version?: number
  conflicts?: SyncOperation[]
}

export interface SyncConfig {
  retryAttempts?: number
  retryDelay?: number
  conflictResolution?: 'server-wins' | 'client-wins' | 'manual'
} 