import { useCallback } from 'react'
import type { Env } from '@/types/env'

export function useEnv(): Env {
  return {
    DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL || '',
    API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
    ENVIRONMENT: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    DB: {
      prepare: (query: string) => ({
        bind: (...values: any[]) => ({} as any),
        first: async <T = any>(col?: string) => null,
        run: async () => ({ success: true }),
        all: async <T = any>() => []
      }),
      exec: async (query: string) => ({ success: true }),
      batch: async (statements) => []
    },
    CACHE: {
      defaultTTL: 3600,
      namespace: 'client-cache',
      get: async (key: string) => null,
      put: async (key: string, value: string) => {}
    },
    AI: {
      complete: async (prompt: string) => '',
      run: async (config: any) => ({}),
      model: '@cf/meta/llama-2-7b-chat-int8',
      maxTokens: 1000
    },
    KV: {
      namespace: 'client-kv',
      ttl: 86400,
      get: async (key: string) => null,
      put: async (key: string, value: string) => {},
      delete: async (key: string) => {}
    },
    VECTORIZE: {
      index: 'client-vectors',
      dimensions: 1536,
      query: async (vector, options) => ({ matches: [], count: 0 }),
      describe: async () => ({ 
        id: 'client-index',
        name: 'client-vectors',
        dimensions: 1536,
        vectorsCount: 0,
        config: {
          dimensions: 1536,
          metric: 'cosine' as VectorizeDistanceMetric
        }
      }),
      deleteByIds: async (ids) => ({ ids, count: ids.length }),
      getByIds: async (ids) => ids.map(id => ({
        id,
        values: new Array(1536).fill(0)
      })),
      insert: async (vectors) => ({ ids: vectors.map(v => v.id), count: vectors.length }),
      upsert: async (vectors) => ({ ids: vectors.map(v => v.id), count: vectors.length })
    },
    QUEUE: {
      name: 'client-queue',
      batchSize: 10,
      retryLimit: 3
    },
    AUTH: {
      secret: process.env.NEXT_PUBLIC_AUTH_SECRET || '',
      expiresIn: '24h'
    },
    STORAGE: {
      bucket: 'client-storage',
      region: 'us-east-1'
    },
    ANALYTICS: {
      enabled: true,
      trackingId: process.env.NEXT_PUBLIC_ANALYTICS_ID || ''
    }
  }
} 