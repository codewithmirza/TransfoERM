import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'
import { WebSocketHandler } from './websocket'

interface HRRequest {
  id: number
  type: string
  employee_id: string
  start_date: string
  end_date: string
  reason?: string
  status: string
  org_id: string
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  // GET /api/hr/summary
  if (request.method === 'GET' && request.url.endsWith('/summary')) {
    try {
      // Try to get from cache first
      const cached = await env.CACHE.get('hr:summary')
      if (cached) return new Response(cached, {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })

      const requests = await env.DB.prepare(`
        SELECT 
          hr.*,
          u.name as employee_name
        FROM hr_requests hr
        JOIN users u ON hr.employee_id = u.id
        ORDER BY hr.created_at DESC
        LIMIT 5
      `).all()

      const pendingCount = await env.DB.prepare(`
        SELECT COUNT(*) as count
        FROM hr_requests
        WHERE status = 'pending'
      `).first<{ count: number }>()

      const summary = {
        recentRequests: requests.results,
        metrics: {
          pendingRequests: pendingCount?.count ?? 0,
          approvedLastWeek: 12,
          averageProcessingTime: '2.5 days'
        }
      }

      // Cache for 5 minutes
      await env.CACHE.put('hr:summary', JSON.stringify(summary), {
        expirationTtl: 300
      })

      return new Response(JSON.stringify(summary), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    } catch (error) {
      console.error('HR Error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch HR summary' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }

  // POST /api/hr/requests
  if (request.method === 'POST') {
    try {
      const body = await request.json()
      console.log('HR request body:', body)
      
      // Validate required fields
      if (!body.type || !body.employee_id || !body.start_date || !body.end_date || !body.org_id) {
        console.log('Missing required fields:', { body })
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields',
            required: ['type', 'employee_id', 'start_date', 'end_date', 'org_id'],
            received: body
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        )
      }

      const result = await env.DB.prepare(`
        INSERT INTO hr_requests (
          type,
          employee_id,
          start_date,
          end_date,
          reason,
          org_id,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        body.type,
        body.employee_id,
        body.start_date,
        body.end_date,
        body.reason || '',
        body.org_id,
        'pending'
      ).run()

      console.log('HR request created:', result)

      // Notify via WebSocket
      const ws = new WebSocketHandler(env)
      await ws.broadcast('hr', {
        type: 'hr_request_created',
        data: {
          id: result.meta.last_row_id,
          type: body.type,
          employeeId: body.employee_id
        }
      })

      return new Response(JSON.stringify({ 
        success: true, 
        id: result.meta.last_row_id 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    } catch (error) {
      console.error('HR Error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create HR request',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }

  return new Response('Not Found', { status: 404 })
} 