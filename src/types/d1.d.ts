declare module '@cloudflare/workers-types' {
  // Override the problematic D1Result type
  export interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    error?: never;
  }
} 