import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'
import { WebSocketHandler } from './websocket'
import type { D1Result, D1Meta } from '@cloudflare/workers-types'

interface FinancialTransaction {
  id: string
  type: 'income' | 'expense' | 'investment'
  amount: number
  category: string
  description: string
  date: string
  status: 'pending' | 'completed' | 'cancelled'
  created_by: string
}

interface D1InsertMeta extends D1Meta {
  last_row_id: number
  changes: number
  duration: number
  size_after: number
  rows_read: number
  rows_written: number
  changed_db: boolean
  [key: string]: unknown
}

type D1InsertResult = D1Result & {
  meta: D1InsertMeta
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method === 'GET' && request.url.endsWith('/summary')) {
    // Sample finance data
    const summary = {
      totalRevenue: 150000,
      totalExpenses: 85000,
      netProfit: 65000,
      recentTransactions: [
        { id: 1, type: 'income', amount: 5000, category: 'Sales', date: '2024-02-10' },
        { id: 2, type: 'expense', amount: 2000, category: 'Supplies', date: '2024-02-09' },
        { id: 3, type: 'income', amount: 7500, category: 'Services', date: '2024-02-08' }
      ],
      metrics: {
        profitMargin: 43.33,
        cashFlow: 25000,
        outstandingInvoices: 15000
      }
    }

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json()
      console.log('Finance request body:', body)
      
      if (!body.type || !body.amount || !body.category || !body.created_by || !body.org_id) {
        console.log('Missing required fields:', { body })
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields',
            required: ['type', 'amount', 'category', 'created_by', 'org_id'],
            received: body
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        )
      }

      const result = await env.DB.prepare(`
        INSERT INTO finance_transactions (
          type,
          amount,
          category,
          description,
          created_by,
          org_id,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        body.type,
        body.amount,
        body.category,
        body.description || '',
        body.created_by,
        body.org_id,
        'completed'
      ).run()

      console.log('Finance transaction created:', result)

      return new Response(
        JSON.stringify({ 
          success: true, 
          id: result.meta.last_row_id 
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    } catch (error) {
      console.error('Finance Error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create finance entry',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }

  // Handle other finance endpoints...
  return new Response('Not Found', { status: 404 })
} 