import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'
import { WebSocketHandler } from './websocket'

interface SalesOrder {
  id: number
  customer_name: string
  order_type: string
  amount: number
  payment_method: string
  status: string
  notes?: string
  created_by: string
  org_id: string
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  // GET /api/sales/summary
  if (request.method === 'GET' && request.url.endsWith('/summary')) {
    try {
      // Try to get from cache first
      const cached = await env.CACHE.get('sales:summary')
      if (cached) return new Response(cached, {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })

      // Get real data from D1
      const recentOrders = await env.DB.prepare(`
        SELECT 
          s.*,
          u.name as created_by_name
        FROM sales_orders s
        JOIN users u ON s.created_by = u.id
        ORDER BY s.created_at DESC
        LIMIT 5
      `).all()

      const totalSales = await env.DB.prepare(`
        SELECT SUM(amount) as total
        FROM sales_orders
        WHERE status = 'completed'
      `).first()

      const metrics = await env.DB.prepare(`
        SELECT 
          COUNT(DISTINCT CASE WHEN status = 'completed' THEN created_by END) as active_customers,
          AVG(CASE WHEN status = 'completed' THEN amount END) as avg_order_value
        FROM sales_orders
      `).first()

      const summary = {
        totalSales: totalSales?.total || 0,
        recentOrders: recentOrders.results,
        metrics: {
          monthlyGrowth: 15, // TODO: Calculate from historical data
          activeCustomers: metrics?.active_customers || 0,
          averageOrderValue: metrics?.avg_order_value || 0
        },
        topProducts: [
          { name: 'Product A', sales: 50000 }, // TODO: Get from actual data
          { name: 'Product B', sales: 35000 },
          { name: 'Product C', sales: 25000 }
        ]
      }

      // Cache for 5 minutes
      await env.CACHE.put('sales:summary', JSON.stringify(summary), {
        expirationTtl: 300
      })

      return new Response(JSON.stringify(summary), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    } catch (error) {
      console.error('Sales Error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch sales summary' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }

  // POST /api/sales/orders
  if (request.method === 'POST') {
    try {
      const body = await request.json()
      console.log('Sales request body:', body)
      
      // Validate required fields
      if (!body.customerName || !body.orderType || !body.amount || !body.paymentMethod || !body.created_by || !body.org_id) {
        console.log('Missing required fields:', { body })
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields',
            required: ['customerName', 'orderType', 'amount', 'paymentMethod', 'created_by', 'org_id'],
            received: body
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        )
      }

      const result = await env.DB.prepare(`
        INSERT INTO sales_orders (
          customer_name,
          order_type,
          amount,
          payment_method,
          notes,
          created_by,
          org_id,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        body.customerName,
        body.orderType,
        body.amount,
        body.paymentMethod,
        body.notes || '',
        body.created_by,
        body.org_id,
        'pending'
      ).run()

      console.log('Sales order created:', result)

      // Notify via WebSocket
      const ws = new WebSocketHandler(env)
      await ws.broadcast('sales', {
        type: 'order_created',
        data: {
          id: result.meta.last_row_id,
          customerName: body.customerName,
          amount: body.amount
        }
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          id: result.meta.last_row_id 
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    } catch (error) {
      console.error('Sales Error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create sales order',
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