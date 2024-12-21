import { Env } from '@/types/cloudflare'
import { UserService } from '@/lib/users/UserService'
import { DatabaseWrapper } from '@/lib/database/DatabaseWrapper'
import { corsHeaders } from '@/lib/cors'
import { verifyAuth } from '@/lib/auth'
import type { DBUser } from '@/types/database'

export async function handleUserRequest(request: Request, env: Env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  // Verify authentication
  const authResult = await verifyAuth(request, env)
  if (!authResult.success || !authResult.userId) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      }
    )
  }

  const db = new DatabaseWrapper(env)
  const userService = new UserService(db)

  try {
    if (request.method === 'GET') {
      // List users (admin only)
      const user = await userService.getUser(authResult.userId)
      if (user?.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required')
      }

      const users = await userService.listUsers()
      return new Response(
        JSON.stringify({ success: true, users }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    if (request.method === 'PUT') {
      const userId = new URL(request.url).pathname.split('/').pop()
      if (!userId) throw new Error('User ID required')

      // Only admins can update other users
      if (userId !== authResult.userId) {
        const user = await userService.getUser(authResult.userId)
        if (user?.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required')
        }
      }

      const updates = (await request.json()) as Partial<DBUser>
      if (!updates || typeof updates !== 'object') {
        throw new Error('Invalid update data')
      }

      // Validate updates
      const allowedFields = ['displayName', 'photoUrl', 'role', 'metadata']
      const invalidFields = Object.keys(updates).filter(key => !allowedFields.includes(key))
      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(', ')}`)
      }

      await userService.updateUser(userId, updates)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    if (request.method === 'DELETE') {
      const userId = new URL(request.url).pathname.split('/').pop()
      if (!userId) throw new Error('User ID required')

      // Only admins can delete users
      const user = await userService.getUser(authResult.userId)
      if (user?.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required')
      }

      await userService.deleteUser(userId)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )

  } catch (error) {
    console.error('User API Error:', error)
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