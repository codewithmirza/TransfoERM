'use client'

import { useState, useCallback } from 'react'
import { AIService } from '@/lib/services/ai'
import { AIInsight, AIContext, AIAnalysisResult, AIRequest } from '@/types/ai'

interface AIResult {
  insights: AIInsight[]
  confidence: number
  metadata?: Record<string, any>
}

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false)
  const aiService = AIService.getInstance()

  const generateInsights = useCallback(async (module: string, data?: any): Promise<AIResult> => {
    setIsProcessing(true)
    try {
      const request: AIRequest = {
        prompt: 'Generate insights',
        context: {
          timestamp: new Date(),
          type: 'insight_generation',
          module,
          data,
          metadata: {
            source: 'useAI hook'
          }
        }
      }

      const result = await aiService.analyze(request.prompt, request)

      return {
        insights: result.insights || [],
        confidence: result.confidence || 0,
        metadata: result.metadata
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [aiService])

  return {
    isProcessing,
    generateInsights
  }
} 