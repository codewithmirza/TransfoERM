import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'
import { ModuleAnalysis } from '@/lib/ai/ModuleAnalysis'

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { module, data, timeframe } = await request.json()
    const analyzer = new ModuleAnalysis(env)

    let result
    switch (module) {
      case 'finance':
        result = await analyzer.analyzeFinance({
          transactions: data.transactions,
          budgets: data.budgets,
          timeframe: timeframe || 'monthly'
        })
        break

      case 'inventory':
        result = await analyzer.analyzeInventory({
          items: data.items,
          movements: data.movements,
          timeframe: timeframe || 'daily'
        })
        break

      case 'hr':
        result = await analyzer.analyzeHR({
          employees: data.employees,
          leaveRequests: data.leaveRequests,
          timeframe: timeframe || 'monthly'
        })
        break

      case 'sales':
        result = await analyzer.analyzeSales({
          sales: data.sales,
          items: data.items,
          timeframe: timeframe || 'weekly'
        })
        break

      default:
        throw new Error('Invalid module specified')
    }

    // Cache the analysis result
    const cacheKey = `analysis:${module}:${JSON.stringify(data)}`
    await env.CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: 3600 // 1 hour cache
    })

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    console.error('AI Analysis Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
} 