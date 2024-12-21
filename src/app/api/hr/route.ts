import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getHRData } from '@/lib/hr'
import { cors } from '@/lib/cors'

export async function GET(request: NextRequest) {
  const corsHeaders = await cors(request)

  try {
    const data = await getHRData()
    
    return NextResponse.json(
      { success: true, data },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('HR API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch HR data' 
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
}

export async function POST(request: NextRequest) {
  const corsHeaders = await cors(request)

  try {
    const body = await request.json()
    // Handle POST logic here
    
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
} 