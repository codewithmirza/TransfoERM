import type { Env } from './cloudflare'

export interface DatabaseService {
  readonly env: Env
  transaction<T>(callback: (tx: D1Transaction) => Promise<T>): Promise<T>
  query<T = any>(query: string, params?: any[]): Promise<T[]>
  queryOne<T = any>(query: string, params?: any[]): Promise<T | null>
  execute(query: string, params?: any[]): Promise<D1Result>
}

export interface D1QueryResult<T = any> extends D1Result<T> {}

export interface DBUser {
  id: string
  email: string
  display_name?: string
  photo_url?: string
  role: 'admin' | 'user'
  metadata: {
    createdAt: string
    lastLoginAt: string
    apiQuota: number
    apiUsage: number
  }
  created_at: string
  updated_at: string
}

export interface DBCustomer {
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

export interface D1Transaction {
  commit(): Promise<void>
  rollback(): Promise<void>
  prepare(query: string): D1PreparedStatement
}

export interface D1Result<T = any> {
  success: boolean
  error?: string
  results: T[]
  meta?: {
    last_row_id?: number
    changes?: number
  }
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement
  first<T = any>(column?: string): Promise<T>
  run<T = any>(): Promise<D1Result<T>>
  all<T = any>(): Promise<D1Result<T>>
} 