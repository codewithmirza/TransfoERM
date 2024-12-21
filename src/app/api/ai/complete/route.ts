import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { Env } from '@/types/cloudflare'

interface AICompletionRequest {
  prompt: string;
}

export async function POST(request: Request) {
  try {
    // Get the environment variables
    const env = process.env as unknown as Env

    // Verify authentication using the correct method
    const authResult = await auth.verifyAuth(request, env)
    if (!authResult.success) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Parse and validate the request body
    const body = await request.json()
    if (!isValidAICompletionRequest(body)) {
      return new NextResponse('Invalid request body', { status: 400 })
    }

    const { prompt } = body

    // ... handle the AI completion

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in AI completion:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

function isValidAICompletionRequest(body: unknown): body is AICompletionRequest {
  return (
    typeof body === 'object' &&
    body !== null &&
    'prompt' in body &&
    typeof (body as AICompletionRequest).prompt === 'string'
  )
} 