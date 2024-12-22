import { Env } from '@/types/cloudflare'
import { nanoid } from 'nanoid'
import { hash, compare } from 'bcryptjs'
import { sign } from '@tsndr/cloudflare-worker-jwt'
import { parseD1Result } from '@/lib/db/utils'

interface SignupRequest {
  email: string
  password: string
  name: string
  company?: string
}

interface SigninRequest {
  email: string
  password: string
}

interface UserRow {
  id: string
  email: string
  password: string
  name: string
  company?: string
}

export async function handleAuth(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth', '')

  try {
    // Signup Handler
    if (path === '/signup' && request.method === 'POST') {
      const { email, password, name, company } = await request.json() as SignupRequest

      // Validate required fields
      if (!email || !password || !name) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Required fields are missing' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Check if user exists
      const existingUser = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(email).first<UserRow>()

      if (existingUser) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Email already registered' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Create new user
      const userId = nanoid()
      const hashedPassword = await hash(password, 10)

      await env.DB.prepare(
        'INSERT INTO users (id, email, password, name, company) VALUES (?, ?, ?, ?, ?)'
      ).bind(userId, email, hashedPassword, name, company).run()

      // Generate JWT token with exp claim
      const token = await sign(
        { 
          userId, 
          email,
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
        }, 
        env.JWT_SECRET
      )

      return new Response(JSON.stringify({
        success: true,
        data: {
          token,
          user: {
            id: userId,
            email,
            name,
            company
          }
        }
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    }

    // Signin Handler
    if (path === '/signin' && request.method === 'POST') {
      const { email, password } = await request.json() as SigninRequest

      const stmt = env.DB.prepare('SELECT * FROM users WHERE email = ?')
      const result = await stmt.bind(email).first()

      const dbUser = parseD1Result<UserRow>(result)

      if (!dbUser) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Invalid credentials' 
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const user: UserRow = {
        id: dbUser.id,
        email: dbUser.email,
        password: dbUser.password,
        name: dbUser.name,
        company: dbUser.company
      }

      if (!(await compare(password, user.password))) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Invalid credentials' 
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Generate JWT token with exp claim
      const token = await sign(
        { 
          userId: user.id, 
          email,
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
        }, 
        env.JWT_SECRET
      )

      return new Response(JSON.stringify({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company
          }
        }
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    }

    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: 'Not found' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Auth error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
} 