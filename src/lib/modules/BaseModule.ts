import { ModuleConfig } from '@/types/core'

export abstract class BaseModule {
  protected config: ModuleConfig
  protected state: Record<string, any> = {}

  constructor(config: ModuleConfig) {
    this.config = config
  }

  abstract initialize(): Promise<void>
  abstract cleanup(): Promise<void>
  abstract handleAction(action: any): Promise<void>
  
  getState(): Record<string, any> {
    return this.state
  }
} 