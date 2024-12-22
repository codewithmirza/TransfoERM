import type { User } from './user'

export interface APIResponse<T = any> {
  success: boolean
  data: T
  error?: string
  metadata?: {
    timestamp: number
    processingTime?: number
  }
}

export interface APIRequest<T = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  body?: T
  headers?: Record<string, string>
  query?: Record<string, string>
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, any>
  stack?: string
}

export interface PaginatedResponse<T> extends APIResponse<T> {
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface APIEndpoint {
  path: string
  method: string
  auth?: boolean
  rateLimit?: {
    requests: number
    window: number
  }
  cache?: {
    ttl: number
    strategy: 'cache-first' | 'network-first'
  }
}

export interface UserResponse {
  success: boolean
  error?: string
  users: User[]
}

export interface UserUpdateResponse {
  success: boolean
  error?: string
  user: User
}

export interface SearchResponse {
  success: boolean
  results: Array<{
    id: string
    metadata: any
    score: number
  }>
}

export interface ErrorResponse {
  success: boolean
  error: string
}

export interface CommandResponse {
  id: string
  content: string
  timestamp: string
  type: 'user' | 'assistant'
  response: string
}

export interface ApiResponse<T = any> {
  success: boolean
  error?: string
  data?: T
}

export interface AuthResponse extends ApiResponse {
  data?: {
    token: string
    user: {
      id: string
      email: string
      name: string
      company?: string
    }
  }
} 