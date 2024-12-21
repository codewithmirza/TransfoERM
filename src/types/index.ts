// Consolidate all types here
import type { D1Database, KVNamespace, R2Bucket } from '@cloudflare/workers-types'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// AI Types
export interface AiCommandRequest {
  command: string
  userId: string
  context?: Record<string, any>
}

export interface AiCommandResult {
  input: string
  output: string
  module: string
  confidence: number
  suggestions: string[]
  action?: string
  parameters?: Record<string, any>
  suggestedResponse?: string
  metadata?: Record<string, any>
}

export interface AiAnalysisResult {
  insights: string[]
  trends: {
    label: string
    value: number
    change: number
  }[]
  recommendations: string[]
  alerts: {
    level: 'info' | 'warning' | 'error'
    message: string
  }[]
}

// Workflow Types
export interface SimpleWorkflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  lastRun: string
}

export interface Workflow extends SimpleWorkflow {
  org_id: string
  config: {
    steps: WorkflowStep[]
  }
  created_by: string
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  id: string
  type: string
  config: Record<string, any>
}

export interface Env {
  DB: D1Database
  CACHE: KVNamespace
  STORAGE: R2Bucket
  AI: any
}

// Add missing types
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface SignupData {
  email: string
  password: string
  name: string
  company: string
}

export interface AiResponse {
  response: string
  [key: string]: any
}

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  status: 'active' | 'inactive' | 'pending'
  value: number
  notes?: string
  created_at: string
  updated_at: string
}

// Add CommandHistoryItem interface
export interface CommandHistoryItem extends AiCommandResult {
  id: string
  timestamp: string
  action: string
  suggestedResponse: string
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  category: string
  price: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  date: string
  category: string
}
