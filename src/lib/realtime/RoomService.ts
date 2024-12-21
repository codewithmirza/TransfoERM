import { RealtimeService } from './RealtimeService'
import type { RealtimeMessage } from '@/types/realtime'

interface RoomState {
  users: Set<string>
  metadata: Record<string, any>
  lastUpdate: number
}

export class RoomService {
  private realtimeService: RealtimeService
  private rooms: Map<string, RoomState>

  constructor() {
    this.realtimeService = RealtimeService.getInstance()
    this.rooms = new Map()
    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.realtimeService.on('room:join', this.handleJoin.bind(this))
    this.realtimeService.on('room:leave', this.handleLeave.bind(this))
  }

  private handleJoin(message: RealtimeMessage): void {
    const { roomId, userId } = message.payload
    const room = this.getOrCreateRoom(roomId)
    room.users.add(userId)
    room.lastUpdate = Date.now()
  }

  private handleLeave(message: RealtimeMessage): void {
    const { roomId, userId } = message.payload
    const room = this.rooms.get(roomId)
    if (room) {
      room.users.delete(userId)
      room.lastUpdate = Date.now()
    }
  }

  private getOrCreateRoom(roomId: string): RoomState {
    let room = this.rooms.get(roomId)
    if (!room) {
      room = {
        users: new Set(),
        metadata: {},
        lastUpdate: Date.now()
      }
      this.rooms.set(roomId, room)
    }
    return room
  }

  async joinRoom(roomId: string, userId: string): Promise<void> {
    await this.realtimeService.broadcast({
      type: 'room:join',
      payload: { roomId, userId },
      userId,
      timestamp: Date.now()
    })
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    await this.realtimeService.broadcast({
      type: 'room:leave',
      payload: { roomId, userId },
      userId,
      timestamp: Date.now()
    })
  }
} 