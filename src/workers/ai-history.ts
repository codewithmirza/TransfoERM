import type { Env } from '@/types/cloudflare'
import { corsHeaders } from './cors'

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      throw new Error('User ID is required')
    }

    // Get command history from D1
    const commands = await env.DB.prepare(`
      SELECT 
        ac.id,
        ac.command,
        ac.interpreted_action as action,
        ac.success,
        ac.feedback as suggested_response,
        ac.created_at as timestamp
      FROM ai_commands ac
      WHERE ac.user_id = ?
      ORDER BY ac.created_at DESC
      LIMIT 50
    `).bind(userId).all()

    return new Response(
      JSON.stringify({ success: true, commands: commands.results }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
} 