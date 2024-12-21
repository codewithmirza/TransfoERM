import type { ModuleHandler, ModuleConfig, ModuleState } from '@/types/modules'
import type { ModuleType } from '@/types/realtime'
import { EventEmitter } from 'events'

export class ModuleRegistry extends EventEmitter {
  private modules: Map<string, ModuleHandler>
  private moduleStates: Map<string, ModuleState>
  private moduleConfigs: Map<string, ModuleConfig>
  private baseImplementations: Map<ModuleType, string>

  constructor() {
    super()
    this.modules = new Map()
    this.moduleStates = new Map()
    this.moduleConfigs = new Map()
    this.baseImplementations = new Map()
  }

  async registerModule(id: string, module: ModuleHandler): Promise<void> {
    if (this.modules.has(id)) {
      throw new Error(`Module with id ${id} already exists`)
    }

    await module.initialize()
    this.modules.set(id, module)
    this.moduleStates.set(id, await module.getState())
    
    this.emit('moduleRegistered', { id, module })
  }

  getModule(type: ModuleType): ModuleHandler | undefined {
    return Array.from(this.modules.values())
      .find(module => this.moduleConfigs.get(module.id)?.moduleType === type)
  }

  async getModuleState(id: string): Promise<ModuleState | undefined> {
    const module = this.modules.get(id)
    if (!module) return undefined

    const state = await module.getState()
    this.moduleStates.set(id, state)
    return state
  }

  async updateModuleState(id: string, state: Partial<ModuleState>): Promise<void> {
    const currentState = this.moduleStates.get(id)
    if (!currentState) throw new Error(`No state found for module ${id}`)

    const updatedState = { ...currentState, ...state }
    this.moduleStates.set(id, updatedState)
    this.emit('stateUpdated', { id, state: updatedState })
  }

  async registerBaseImplementation(type: ModuleType, code: string): Promise<void> {
    this.baseImplementations.set(type, code)
    this.emit('baseImplementationRegistered', { type, code })
  }

  getBaseImplementation(type: ModuleType): string | undefined {
    return this.baseImplementations.get(type)
  }

  async unregisterModule(id: string): Promise<void> {
    const module = this.modules.get(id)
    if (!module) return

    await module.cleanup()
    this.modules.delete(id)
    this.moduleStates.delete(id)
    this.moduleConfigs.delete(id)
    
    this.emit('moduleUnregistered', { id })
  }

  async getModuleConfig(id: string): Promise<ModuleConfig | undefined> {
    return this.moduleConfigs.get(id)
  }

  setModuleConfig(id: string, config: ModuleConfig): void {
    this.moduleConfigs.set(id, config)
  }

  getAllModules(): Map<string, ModuleHandler> {
    return new Map(this.modules)
  }

  async dispatchAction(moduleId: string, action: any): Promise<void> {
    const module = this.modules.get(moduleId)
    if (!module) throw new Error(`Module ${moduleId} not found`)

    await module.handleAction(action)
    this.moduleStates.set(moduleId, await module.getState())
    this.emit('actionDispatched', { moduleId, action })
  }
} 