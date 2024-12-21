/// <reference types="@cloudflare/workers-types" />

import { Env } from '@/types/cloudflare'
import { handleAIRequest } from './ai'
import { handleAnalyticsRequest } from './analytics'
import { handleUploadRequest } from './upload'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    try {
      if (url.pathname.startsWith('/api/ai/upload')) {
        return handleUploadRequest(request, env)
      }

      if (url.pathname.startsWith('/api/ai')) {
        return handleAIRequest(request, env)
      }

      if (url.pathname.startsWith('/api/analytics')) {
        return handleAnalyticsRequest(request, env)
      }

      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (error) {
      console.error('Worker Error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}
