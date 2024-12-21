export const Environment = {
  // Cloudflare Configuration
  CLOUDFLARE_API_TOKEN: process.env.CF_API_TOKEN || '',
  CLOUDFLARE_ACCOUNT_ID: process.env.CF_ACCOUNT_ID || 'e4b47f3f23d7780292903835f5f9bddb',
  CF_PROJECT_NAME: process.env.CF_PROJECT_NAME || 'transfoerm',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PORT: process.env.API_PORT || 3000,
  
  // Database (D1)
  DB_NAME: process.env.DB_NAME || 'transfoerm-db',
  
  // Cache (KV)
  CACHE_NAMESPACE: process.env.CACHE_NAMESPACE || 'TRANSFOERM_CACHE',
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret',
  
  // Feature Flags
  ENABLE_AI: process.env.ENABLE_AI === 'true',
  ENABLE_PROCESS_MINING: process.env.ENABLE_PROCESS_MINING === 'true',
  ENABLE_REAL_TIME_ANALYTICS: process.env.ENABLE_REAL_TIME_ANALYTICS === 'true',

  isProduction(): boolean {
    return this.NODE_ENV === 'production'
  },

  isDevelopment(): boolean {
    return this.NODE_ENV === 'development'
  },

  isTest(): boolean {
    return this.NODE_ENV === 'test'
  }
} 