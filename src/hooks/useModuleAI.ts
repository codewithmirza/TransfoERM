import { useState, useEffect } from 'react'
import type { AIAnalysisResult, AIResponse } from '@/types/ai'
import type { ModuleType } from '@/types/modules'
import type { TimeframeType } from '@/types/common'

interface UseModuleAIProps {
  module: ModuleType
  data: Record<string, any> | null
  timeframe: TimeframeType
  refreshInterval?: number
}

interface UseModuleAIResult {
  insights: AIAnalysisResult | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useModuleAI({ module, data, timeframe }: UseModuleAIProps): UseModuleAIResult {
  const [insights, setInsights] = useState<AIAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refresh = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, timeframe, data })
      })
      
      const result = await response.json() as AIResponse<AIAnalysisResult>
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }
      
      setInsights(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to analyze data'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data) {
      refresh()
    }
  }, [data, module, timeframe])

  return { insights, loading, error, refresh }
}

export { type TimeframeType } 