export interface User {
  id: string
  name: string
  status: 'online' | 'offline' | 'away'
  lastSeen: number
}

export interface Room {
  id: string
  name: string
  type: 'document' | 'whiteboard' | 'chat'
  collaborators: User[]
  createdAt: number
  updatedAt: number
} 