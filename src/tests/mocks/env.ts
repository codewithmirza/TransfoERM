import type { Env } from '@/types/env'

export const mockEnv: Env = {
  DATABASE_URL: 'test-db-url',
  API_KEY: 'test-api-key',
  ENVIRONMENT: 'test',
  DB: {
    prepare: () => ({} as any)
  } as any,
  KV: {
    get: async () => null,
    put: async () => {}
  } as any,
  STORAGE: {
    get: async () => null,
    put: async () => ({} as any)
  } as any,
  AI: {
    complete: async () => '',
    run: async () => ({}),
    model: 'test-model',
    maxTokens: 1000
  },
  QUEUE: {
    send: async () => {}
  } as any,
  CACHE: {
    get: async () => undefined,
    put: async () => {}
  } as any,
  AUTH: {
    user: async () => null
  } as any,
  ANALYTICS: {
    track: async () => {}
  } as any
} 