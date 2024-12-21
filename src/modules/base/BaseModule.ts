import { EventEmitter } from 'events'
import type { ModuleConfig } from '@/types/core'
import { DataSyncEngine } from '@/lib/sync/DataSyncEngine'
import { WorkflowEngineProvider } from '@/lib/workflow/WorkflowEngineProvider'
import type { WorkflowEngine } from '@/lib/workflow/WorkflowEngine'

export abstract class BaseModule extends EventEmitter {
  protected config: ModuleConfig
  protected syncEngine: DataSyncEngine
  protected workflowEngine: WorkflowEngine
  protected initialized: boolean = false

  constructor(config: ModuleConfig) {
    super()
    this.config = config
    this.syncEngine = new DataSyncEngine()
    this.workflowEngine = WorkflowEngineProvider.getInstance()
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    // Initialize module-specific resources
    await this.setupWorkflows()
    await this.setupPermissions()
    
    this.initialized = true
  }

  protected abstract setupWorkflows(): Promise<void>
  protected abstract setupPermissions(): Promise<void>

  async destroy(): Promise<void> {
    this.initialized = false
    this.removeAllListeners()
  }
} 