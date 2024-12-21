import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { Env } from '@/types/cloudflare'
import { Database } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    // Get the environment variables
    const env = process.env as unknown as Env

    // Verify authentication
    const authResult = await auth.verifyAuth(request, env)
    if (!authResult.success) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Use the Database interface directly with env.DB
    const db: Database = env.DB as unknown as Database

    // Use the correct method to query the database
    const result = await db.query(
      `SELECT * FROM ${params.type}_metrics ORDER BY timestamp DESC LIMIT 100`
    )

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in metrics API:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 