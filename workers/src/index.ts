/// <reference types="@cloudflare/workers-types" />

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Context, Next } from 'hono'
import type { Env } from '@/types/cloudflare'
import { verifyFirebaseToken } from '@/lib/firebase/auth'

// Define the type for our custom variables in the context
type Variables = {
  userId: string
}

// Create a Hono instance with both Bindings and Variables types
const app = new Hono<{ Bindings: Env; Variables: Variables }>()

app.use('*', cors())

// Enhanced auth middleware with token verification
app.use('/api/*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const token = auth.split(' ')[1]
  const authResult = await verifyFirebaseToken(token, c.env.FIREBASE_API_KEY)
  
  if (!authResult.success) {
    return c.json({ error: authResult.error || 'Authentication failed' }, 401)
  }

  // Now TypeScript knows about the userId variable
  c.set('userId', authResult.userId!)
  await next()
})

// User routes
app.post('/api/users', async (c) => {
  const { id, email, name, company } = await c.req.json()
  
  try {
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, name, company) VALUES (?, ?, ?, ?)'
    )
    .bind(id, email, name, company)
    .run()
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

app.put('/api/users', async (c) => {
  const { id, name, company } = await c.req.json()
  
  try {
    await c.env.DB.prepare(
      'UPDATE users SET name = ?, company = ? WHERE id = ?'
    )
    .bind(name, company, id)
    .run()
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to update user' }, 500)
  }
})

app.get('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  
  try {
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    )
    .bind(id)
    .first()
    
    return c.json(user)
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500)
  }
})

export default app 