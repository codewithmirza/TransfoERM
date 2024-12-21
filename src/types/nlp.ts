export interface CommandIntent {
  type: 'create' | 'read' | 'update' | 'delete' | 'custom'
  target: string
  parameters: Record<string, any>
  confidence: number
}

export interface CommandResult {
  success: boolean
  data?: any
  error?: string
  executionId?: string
} 