/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLOUDFLARE_API_TOKEN: string
      CLOUDFLARE_ACCOUNT_ID: string
      VECTORIZE_INDEX_NAME: string
    }
  }
}

interface D1Database {
  prepare: (query: string) => D1PreparedStatement
  dump: () => Promise<ArrayBuffer>
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result[]>
  exec: (query: string) => Promise<D1Result>
}

interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement
  first: <T = any>(colName?: string) => Promise<T>
  run: () => Promise<D1Result>
  all: <T = any>() => Promise<{ results: T[] }>
}

interface D1Result {
  success: boolean
  error?: string
  results?: any[]
  lastRowId?: number
  changes?: number
}

export interface Env {
  DB: D1Database
  CACHE: KVNamespace
  STORAGE: R2Bucket
  AI: any
  VECTORIZE: any
  ENVIRONMENT: string
  CLOUDFLARE_API_TOKEN: string
  CLOUDFLARE_ACCOUNT_ID: string
  VECTORIZE_INDEX_NAME: string
}

export type { D1Database, D1PreparedStatement, D1Result } 