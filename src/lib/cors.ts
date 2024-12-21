import type { NextRequest } from 'next/server'

export async function cors(request: NextRequest) {
  const origin = request.headers.get('origin') || '*'
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
} 