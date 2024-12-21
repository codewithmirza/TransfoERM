import { CollaborativeService } from './CollaborativeService'

interface User {
  id: string
  name: string
  status: 'online' | 'offline' | 'away'
  lastSeen: number
}

interface PresenceState {
  users: Map<string, User>
  version: number
}

export class PresenceService extends CollaborativeService {
  private state: PresenceState

  constructor(moduleId: string) {
    super(moduleId)
    this.state = {
      users: new Map(),
      version: 0
    }
  }

  updateUserStatus(userId: string, status: User['status']): void {
    const user = this.state.users.get(userId)
    if (user) {
      this.state.users.set(userId, {
        ...user,
        status,
        lastSeen: Date.now()
      })
      this.broadcast('presence:update', { userId, status })
    }
  }

  addUser(user: User): void {
    this.state.users.set(user.id, user)
    this.broadcast('presence:join', { user })
  }

  removeUser(userId: string): void {
    this.state.users.delete(userId)
    this.broadcast('presence:leave', { userId })
  }

  getOnlineUsers(): User[] {
    return Array.from(this.state.users.values())
      .filter(user => user.status === 'online')
  }

  getState(): PresenceState {
    return {
      users: new Map(this.state.users),
      version: this.state.version
    }
  }
} 