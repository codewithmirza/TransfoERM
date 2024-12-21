import { Env } from './types/env'
import { Router } from '@/router'
import { handleError } from '@/lib/error'
import { AppError } from '@/lib/error'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Add CORS headers
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    const router = new Router(env)
    
    try {
      const response = await router.handle(request, ctx)
      
      // Add CORS headers to response
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      }

      // Create new response with CORS headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          ...corsHeaders,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        return handleError(error)
      }
      return handleError(new AppError('Unknown error occurred', 'UNKNOWN_ERROR'))
    }
  }
} 