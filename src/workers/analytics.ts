import { Env } from '@/types/cloudflare'
import { Analytics } from '@/lib/analytics'
import { corsHeaders } from '@/lib/cors'
import { verifyAuth } from '@/lib/auth'
import { 
  AnalyticsRequest, 
  AnalyticsResponse,
  TimeFrame 
} from '@/types/analytics'

export async function handleAnalyticsRequest(request: Request, env: Env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  // Verify authentication
  const authResult = await verifyAuth(request, env)
  if (!authResult.success) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' } satisfies AnalyticsResponse),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }

  const analytics = new Analytics(env)
  const url = new URL(request.url)

  try {
    if (request.method === 'GET') {
      const timeframe = (url.searchParams.get('timeframe') || 'day') as TimeFrame
      const stats = await analytics.getStats(timeframe)

      return new Response(
        JSON.stringify({ success: true, data: stats } satisfies AnalyticsResponse),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    if (request.method === 'POST') {
      const body = await request.json() as AnalyticsRequest
      
      await analytics.trackEvent({
        type: body.type,
        userId: authResult.userId,
        metadata: body.metadata
      })

      return new Response(
        JSON.stringify({ success: true } satisfies AnalyticsResponse),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' } satisfies AnalyticsResponse),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )

  } catch (error) {
    console.error('Analytics Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      } satisfies AnalyticsResponse),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
} 