import type { Env } from '../types/cloudflare'
import { corsHeaders } from './cors'

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method === 'POST') {
    try {
      const body = await request.json()
      console.log('Received organization creation request:', body)
      
      // Validate required fields
      if (!body.id || !body.name) {
        console.log('Missing required fields')
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      // Check if organization already exists
      const existing = await env.DB.prepare(`
        SELECT id FROM organizations WHERE id = ?
      `).bind(body.id).first()

      if (existing) {
        console.log('Organization already exists:', body.id)
        return new Response(
          JSON.stringify({ error: 'Organization already exists' }),
          { 
            status: 409,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }

      // Create organization
      await env.DB.prepare(`
        INSERT INTO organizations (id, name) VALUES (?, ?)
      `).bind(body.id, body.name).run()

      console.log('Organization created successfully:', body.id)

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    } catch (error) {
      console.error('Organization Error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create organization' }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }
  }

  // GET /api/organizations
  if (request.method === 'GET') {
    try {
      const organizations = await env.DB.prepare(`
        SELECT * FROM organizations
      `).all()

      return new Response(
        JSON.stringify(organizations.results),
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    } catch (error) {
      console.error('Organization Error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch organizations' }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }
  }

  return new Response('Method not allowed', { 
    status: 405,
    headers: { 
      ...corsHeaders,
      'Access-Control-Allow-Origin': '*'
    }
  })
} 