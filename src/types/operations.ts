export interface Operation {
  type: 'insert' | 'delete' | 'retain'
  chars?: string
  count?: number
  position?: number
  timestamp?: number
  userId?: string
}

export interface Transform {
  clientOp: Operation[]
  serverOp: Operation[]
}

export interface DocumentState {
  content: string
  version: number
  operations: Operation[]
  collaborators: Set<string>
  lastModified: Date
}

export interface DocumentUpdate {
  operations: Operation[]
  version: number
  userId: string
  timestamp: number
}

export interface OperationResult {
  success: boolean
  error?: string
  state?: DocumentState
}

export interface CollaborativeDocument {
  id: string
  content: string
  version: number
  operations: Operation[]
  collaborators: Set<string>
  lastModified: Date
  metadata: Record<string, any>
} 