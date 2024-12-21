import { EventEmitter } from 'events'
import type { ModuleConfig } from '@/types/core'

export abstract class Module extends EventEmitter {
  protected id: string
  protected type: string
  protected name: string
  protected version: string

  constructor(config: ModuleConfig) {
    super()
    this.id = config.id
    this.type = config.type
    this.name = config.name
    this.version = config.version
  }

  abstract getServices(): Record<string, any>

  getId(): string {
    return this.id
  }

  getType(): string {
    return this.type
  }

  getName(): string {
    return this.name
  }

  getVersion(): string {
    return this.version
  }
} 