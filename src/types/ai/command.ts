export interface CommandResult {
  success: boolean
  error?: string
  workflow?: Workflow
}

export interface Intent {
  type: 'create' | 'update' | 'delete' | 'query'
  module: string
  action: string
  confidence: number
}

export interface Entity {
  type: string
  value: any
  metadata?: Record<string, any>
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse<T = any> {
  success: boolean
  data: T
  error?: string
}

export interface AnalysisResult {
  intent: Intent
  entities: Entity[]
  confidence: number
  suggestions?: string[]
} 