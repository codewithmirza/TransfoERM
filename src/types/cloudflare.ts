import type { D1Database } from '@cloudflare/workers-types'

// Create our own D1 types to avoid conflicts
export interface D1Response {
  success: boolean;
  error?: string;
}

export interface D1Result<T = unknown> extends D1Response {
  results: T[];
}

export interface Env {
  DB: D1Database
  JWT_SECRET: string
  FIREBASE_API_KEY: string
  [key: string]: unknown
}

// Export a type assertion function to handle D1 results
export function assertD1Result<T>(value: any): asserts value is D1Result<T> {
  if (!value || typeof value !== 'object' || !('results' in value)) {
    throw new Error('Invalid D1Result')
  }
} 