import { NextResponse } from 'next/server'
import { KnowledgeBase } from '@/lib/knowledge/KnowledgeBase'
import type { Env } from '@/types/env'
import { getEnv } from '@/lib/env'

export async function POST(request: Request) {
  const env = getEnv()
  const kb = KnowledgeBase.getInstance(env)
  const data = await request.json() as { id: string; content: string; metadata?: Record<string, any> }
  
  await kb.addDocument(data)
  return NextResponse.json({ success: true })
} 