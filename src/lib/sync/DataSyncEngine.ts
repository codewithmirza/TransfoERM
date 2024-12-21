import { RealtimeService } from '../realtime/RealtimeService'
import type { SyncOperation, SyncState, SyncConfig } from '@/types/sync'
import type { RealtimeMessage } from '@/types/realtime'

export class DataSyncEngine {
  private realtimeService: RealtimeService
  private syncState: Map<string, SyncState>
  private pendingOperations: Map<string, SyncOperation[]>
  private config: SyncConfig

  constructor(config: Partial<SyncConfig> = {}) {
    this.realtimeService = RealtimeService.getInstance()
    this.syncState = new Map()
    this.pendingOperations = new Map()
    this.config = {
      retryAttempts: 3,
      retryDelay: 1000,
      conflictResolution: 'server-wins',
      ...config
    }
    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.realtimeService.on('sync:operation', this.handleSyncOperation.bind(this))
    this.realtimeService.on('sync:conflict', this.handleSyncConflict.bind(this))
  }

  async syncData(moduleId: string, data: any, metadata?: Record<string, any>): Promise<void> {
    try {
      const operation = this.createSyncOperation(moduleId, data, metadata)
      await this.applyOperation(operation)
      await this.broadcastOperation(operation)
    } catch (error) {
      console.error('Sync failed:', error)
      await this.handleSyncError(moduleId, error)
      throw error
    }
  }

  private createSyncOperation(
    moduleId: string, 
    data: any, 
    metadata?: Record<string, any>
  ): SyncOperation {
    return {
      id: crypto.randomUUID(),
      moduleId,
      timestamp: Date.now(),
      data,
      type: 'update',
      metadata: {
        ...metadata,
        version: (this.syncState.get(moduleId)?.version || 0) + 1
      }
    }
  }

  private async applyOperation(operation: SyncOperation): Promise<void> {
    const currentState = this.syncState.get(operation.moduleId)
    
    if (currentState && currentState.version! > operation.metadata!.version) {
      await this.handleConflict(operation, currentState)
      return
    }

    this.syncState.set(operation.moduleId, {
      lastUpdate: operation.timestamp,
      data: operation.data,
      version: operation.metadata!.version
    })
  }

  private async handleConflict(operation: SyncOperation, currentState: SyncState): Promise<void> {
    if (this.config.conflictResolution === 'server-wins') {
      // Keep current state
      return
    }

    if (this.config.conflictResolution === 'client-wins') {
      await this.applyOperation(operation)
      return
    }

    // Manual resolution
    const conflicts = currentState.conflicts || []
    conflicts.push(operation)
    this.syncState.set(operation.moduleId, {
      ...currentState,
      conflicts
    })

    await this.broadcastConflict(operation)
  }

  private async broadcastOperation(operation: SyncOperation): Promise<void> {
    const message: RealtimeMessage = {
      type: 'sync:operation',
      payload: operation,
      userId: 'system',
      timestamp: Date.now()
    }
    await this.realtimeService.broadcast(message)
  }

  private async broadcastConflict(operation: SyncOperation): Promise<void> {
    const message: RealtimeMessage = {
      type: 'sync:conflict',
      payload: {
        operation,
        currentState: this.syncState.get(operation.moduleId)
      },
      userId: 'system',
      timestamp: Date.now()
    }
    await this.realtimeService.broadcast(message)
  }

  private async handleSyncOperation(message: RealtimeMessage): Promise<void> {
    const operation = message.payload as SyncOperation
    await this.applyOperation(operation)
  }

  private async handleSyncConflict(message: RealtimeMessage): Promise<void> {
    // Handle conflict resolution based on config
    const { operation, currentState } = message.payload
    if (this.config.conflictResolution === 'server-wins') {
      this.syncState.set(operation.moduleId, currentState)
    }
  }

  private async handleSyncError(moduleId: string, error: any): Promise<void> {
    const pendingOps = this.pendingOperations.get(moduleId) || []
    if (pendingOps.length >= this.config.retryAttempts!) {
      console.error(`Sync failed after ${this.config.retryAttempts} attempts:`, error)
      return
    }

    // Schedule retry
    setTimeout(async () => {
      const state = this.syncState.get(moduleId)
      if (state) {
        await this.syncData(moduleId, state.data)
      }
    }, this.config.retryDelay!)
  }
} 