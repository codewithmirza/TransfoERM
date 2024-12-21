import { Env } from '@/types'
import { hash, compare } from 'bcryptjs'
import { nanoid } from 'nanoid'
import { LoginRequest, LoginResponse } from '../../types/auth'

interface User {
  id: string
  email: string
  password: string
  name: string
  company?: string
}

interface SignupRequest extends LoginRequest {
  name: string
  company: string
}

interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  company?: string;
}

export async function handleAuth(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url)
    const path = url.pathname.replace('/api/auth', '')

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    if (path === '/login' && request.method === 'POST') {
      const body = (await request.json()) as LoginRequest
      const { email, password } = body

      // Validate inputs
      if (!email || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Email and password are required',
          } as LoginResponse),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      console.log('Login attempt:', { hasEmail: !!email, hasPassword: !!password })

      const userQuery = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first<UserRow>()

      const userResult = userQuery as unknown as UserRow | null

      if (!userResult || !(await compare(password, userResult.password))) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      }

      return new Response(
        JSON.stringify({
          success: true,
          token: 'your_jwt_token_here',
        } as LoginResponse),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (path === '/signup' && request.method === 'POST') {
      const { email, password, name, company } = (await request.json()) as SignupRequest

      if (!email || !password || !name) {
        return new Response(JSON.stringify({ error: 'Required fields are missing' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const existingUserResult = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first<UserRow>()

      if (existingUserResult) {
        return new Response(JSON.stringify({ error: 'Email already registered' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const userId = nanoid()
      const hashedPassword = await hash(password, 10)

      const insertResult = await env.DB.prepare(
        'INSERT INTO users (id, email, password, name, company) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(userId, email, hashedPassword, name, company)
        .run()

      if (!insertResult.success) {
        return new Response(JSON.stringify({ error: 'Failed to create user' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(
        JSON.stringify({
          id: userId,
          email,
          name,
          company,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response('Not found', { status: 404 })
  } catch (error) {
    console.error('Auth error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      } as LoginResponse),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
