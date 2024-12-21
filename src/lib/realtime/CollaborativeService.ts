import { RealtimeService, RealtimeMessage } from './RealtimeService'

export abstract class CollaborativeService {
  protected realtimeService: RealtimeService
  protected moduleId: string

  constructor(moduleId: string) {
    this.realtimeService = RealtimeService.getInstance()
    this.moduleId = moduleId
  }

  protected broadcast(type: string, payload: any): void {
    const message: RealtimeMessage = {
      type,
      payload,
      userId: 'system',
      timestamp: Date.now()
    }
    this.realtimeService.broadcast(this.moduleId, message)
  }

  protected broadcastAll(type: string, payload: any): void {
    const message: RealtimeMessage = {
      type,
      payload,
      userId: 'system',
      timestamp: Date.now()
    }
    this.realtimeService.broadcastAll(message)
  }
} 