import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'
import { WebSocketHandler } from './websocket'

interface InventoryMovement {
  id: number
  item_id: number
  type: 'in' | 'out'
  quantity: number
  created_by: string
  created_at: string
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const url = new URL(request.url)
  const path = url.pathname

  // POST /api/inventory/movement - Must check this first
  if (request.method === 'POST' && path.endsWith('/movement')) {
    try {
      const body = await request.json()
      console.log('Inventory movement request:', body)
      
      // Validate required fields
      if (!body.item_id || !body.type || !body.quantity || !body.created_by) {
        console.log('Missing required fields:', { body })
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields',
            required: ['item_id', 'type', 'quantity', 'created_by'],
            received: body
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        )
      }

      // Validate movement type
      if (!['in', 'out'].includes(body.type)) {
        return new Response(
          JSON.stringify({ error: 'Invalid movement type. Must be "in" or "out"' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        )
      }

      // Start transaction
      const result = await env.DB.prepare(`
        INSERT INTO inventory_movements (
          item_id,
          type,
          quantity,
          created_by
        ) VALUES (?, ?, ?, ?)
      `).bind(
        body.item_id,
        body.type,
        body.quantity,
        body.created_by
      ).run()

      console.log('Inventory movement created:', result)

      // Notify via WebSocket
      const ws = new WebSocketHandler(env)
      await ws.broadcast('inventory', {
        type: 'inventory_movement',
        data: {
          id: result.meta.last_row_id,
          item_id: body.item_id,
          movement_type: body.type,
          quantity: body.quantity
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
      console.error('Inventory Movement Error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create inventory movement',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }

  // GET /api/inventory/summary
  if (request.method === 'GET' && path.endsWith('/summary')) {
    try {
      // Try to get from cache first
      const cached = await env.CACHE.get('inventory:summary')
      if (cached) return new Response(cached, {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })

      // Get real data from D1
      const items = await env.DB.prepare(`
        SELECT 
          i.*,
          COALESCE(SUM(CASE WHEN m.type = 'in' THEN m.quantity ELSE -m.quantity END), 0) as current_quantity
        FROM inventory_items i
        LEFT JOIN inventory_movements m ON i.id = m.item_id
        GROUP BY i.id
      `).all()

      const lowStock = await env.DB.prepare(`
        SELECT COUNT(*) as count
        FROM inventory_items i
        LEFT JOIN (
          SELECT 
            item_id,
            SUM(CASE WHEN type = 'in' THEN quantity ELSE -quantity END) as current_qty
          FROM inventory_movements
          GROUP BY item_id
        ) m ON i.id = m.item_id
        WHERE COALESCE(m.current_qty, 0) <= i.reorder_point
      `).first()

      const recentMovements = await env.DB.prepare(`
        SELECT m.*, i.name as item_name
        FROM inventory_movements m
        JOIN inventory_items i ON m.item_id = i.id
        ORDER BY m.created_at DESC
        LIMIT 5
      `).all()

      const summary = {
        totalItems: items.results.length,
        lowStock: lowStock ? lowStock.count : 0,
        totalValue: items.results.reduce((acc: number, item: any) => 
          acc + (item.current_quantity || 0), 0),
        recentMovements: recentMovements.results,
        categories: items.results.reduce((acc: any, item: any) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {})
      }

      // Cache for 5 minutes
      await env.CACHE.put('inventory:summary', JSON.stringify(summary), {
        expirationTtl: 300
      })

      return new Response(JSON.stringify(summary), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    } catch (error) {
      console.error('Inventory Error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch inventory summary' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }

  // POST /api/inventory - Create new item
  if (request.method === 'POST') {
    try {
      const body = await request.json()
      
      // Validate required fields
      if (!body.name || !body.sku || !body.category || !body.orgId || !body.userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        )
      }

      // Insert the item
      const result = await env.DB.prepare(`
        INSERT INTO inventory_items (
          name,
          sku,
          quantity,
          category,
          location,
          reorder_point,
          org_id,
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        body.name,
        body.sku,
        body.quantity || 0,
        body.category,
        body.location || '',
        body.reorderPoint || 0,
        body.orgId,
        body.userId
      ).run()

      // Record initial stock movement if quantity > 0
      if (body.quantity > 0) {
        await env.DB.prepare(`
          INSERT INTO inventory_movements (
            item_id,
            type,
            quantity,
            created_by
          ) VALUES (?, ?, ?, ?)
        `).bind(
          result.meta.last_row_id,
          'in',
          body.quantity,
          body.userId
        ).run()
      }

      // Invalidate cache
      await env.CACHE.delete('inventory:summary')

      // Notify via WebSocket
      const ws = new WebSocketHandler(env)
      await ws.broadcast('inventory', {
        type: 'inventory_update',
        data: {
          action: 'create',
          item: {
            id: result.meta.last_row_id,
            name: body.name,
            quantity: body.quantity || 0
          }
        }
      })

      return new Response(JSON.stringify({ 
        success: true, 
        id: result.meta.last_row_id 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    } catch (error) {
      console.error('Inventory Error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create inventory item' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }

  return new Response('Not Found', { status: 404 })
} 