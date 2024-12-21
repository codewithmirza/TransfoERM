import type { AIResponse } from '@/types/ai'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    model?: string
    processingTime?: number
  }
}

export interface ChatResponseData {
  content: string
  metadata?: {
    model: string
    confidence: number
    processingTime: number
  }
}

export interface ChatResponse extends AIResponse<ChatResponseData> {}

export interface ChatRequest {
  message: string
  userId?: string
  context?: {
    history?: ChatMessage[]
    module?: string
    preferences?: Record<string, any>
  }
} 