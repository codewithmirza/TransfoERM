import { NextResponse } from 'next/server';
import { AI_CONFIG } from '@/lib/ai/config';

interface AIRequestBody {
  prompt: string;
  context?: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as AIRequestBody;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: AI_CONFIG.models.analysis,
        messages: [{
          role: 'user',
          content: body.prompt
        }],
        context: body.context,
        max_tokens: AI_CONFIG.maxTokens.analysis
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Analysis failed:', error);
    return NextResponse.json({ error: 'AI Analysis failed' }, { status: 500 });
  }
} 