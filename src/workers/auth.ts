import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, ...data } = await request.json()

    if (type === 'login') {
      // Handle login
      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(data.email).first()

      if (!user) {
        throw new Error('User not found')
      }

      return new Response(
        JSON.stringify({ success: true, user }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    if (type === 'signup') {
      // Handle signup
      const result = await env.DB.prepare(`
        INSERT INTO users (id, email, name, company, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(
        data.id,
        data.email,
        data.name,
        data.company
      ).run()

      if (!result.success) {
        throw new Error('Failed to create user')
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    throw new Error('Invalid auth type')
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