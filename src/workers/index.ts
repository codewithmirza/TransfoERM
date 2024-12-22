/// <reference types="@cloudflare/workers-types" />

import { Env } from '@/types/cloudflare'
import { handleAIRequest } from './ai/index'
import { handleAnalyticsRequest } from './analytics'
import { handleUploadRequest } from './upload'
import { handleAuth } from './auth'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const url = new URL(request.url)

    try {
      // Add CORS headers to all responses
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }

      if (url.pathname.startsWith('/api/auth')) {
        const response = await handleAuth(request, env)
        // Add CORS headers to the response
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }

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
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }
  }
}
