import type { 
  VectorizeIndex as CloudflareVectorizeIndex, 
  VectorizeMatches,
  VectorFloatArray,
  VectorizeQueryOptions,
  VectorizeIndexDetails,
  VectorizeVectorMutation,
  VectorizeVector,
  VectorizeIndexConfig,
  VectorizeDistanceMetric
} from '@cloudflare/workers-types'

export interface CustomVectorizeIndexConfig {
  dimensions: number
  metric: VectorizeDistanceMetric
  similarity?: string
  indexing?: string
  pq?: boolean
}

export type {
  VectorizeMatches,
  VectorizeVectorMutation,
  VectorizeVector,
  VectorizeIndexConfig,
  VectorizeIndexDetails,
  VectorFloatArray,
  VectorizeQueryOptions
}

export interface D1Database {
  prepare: (query: string) => D1PreparedStatement
  exec: (query: string) => Promise<D1Result>
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result[]>
}

export interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement
  first: <T = any>(col?: string) => Promise<T | null>
  run: () => Promise<D1Result>
  all: <T = any>() => Promise<T[]>
}

export interface D1Result {
  success: boolean
  error?: string
  results?: any[]
  lastRowId?: number
  changes?: number
}

export interface KVNamespace {
  get: (key: string) => Promise<string | null>
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>
  delete: (key: string) => Promise<void>
}

export interface VectorizeIndex {
  index: string
  dimensions: number
  query: (vector: number[] | VectorFloatArray, options?: VectorizeQueryOptions) => Promise<VectorizeMatches>
  describe: () => Promise<VectorizeIndexDetails>
  deleteByIds: (ids: string[]) => Promise<VectorizeVectorMutation>
  getByIds: (ids: string[]) => Promise<VectorizeVector[]>
  insert: (vectors: VectorizeVector[]) => Promise<VectorizeVectorMutation>
  upsert: (vectors: VectorizeVector[]) => Promise<VectorizeVectorMutation>
}

export interface AIService {
  complete: (prompt: string) => Promise<string>
  run: (config: any) => Promise<any>
  model: string
  maxTokens: number
}

export interface Env {
  DATABASE_URL: string
  API_KEY: string
  ENVIRONMENT: 'development' | 'production' | 'test'
  DB: D1Database
  CACHE: {
    defaultTTL: number
    namespace: string
    get: (key: string) => Promise<string | null>
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>
  }
  AI: AIService
  KV: KVNamespace & {
    namespace: string
    ttl: number
  }
  VECTORIZE: VectorizeIndex
  QUEUE: {
    name: string
    batchSize: number
    retryLimit: number
  }
  AUTH: {
    secret: string
    expiresIn: string
  }
  STORAGE: {
    bucket: string
    region: string
  }
  ANALYTICS: {
    enabled: boolean
    trackingId: string
  }
} 