import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'

export async function onRequest({ env }: { env: Env }) {
  try {
    const dbResult = await env.DB.prepare('SELECT 1').first()
    await env.CACHE.put('health-check', 'ok')
    
    return new Response(
      JSON.stringify({ 
        status: 'healthy',
        services: {
          database: dbResult ? 'connected' : 'error',
          cache: 'connected',
          ai: env.AI ? 'available' : 'not configured',
          storage: env.STORAGE ? 'available' : 'not configured'
        }
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: 'unhealthy',
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