'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Brain } from 'lucide-react'
import { AIService } from '@/lib/services/ai'

interface InsightResponse {
  insights: string[]
  status: string
}

interface AIInsightsProps {
  module: string
  data?: any
}

export function AIInsights({ module, data }: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const aiService = AIService.getInstance()
        const result = await aiService.generateInsights(module, data) as InsightResponse
        if (result.status === 'success' && Array.isArray(result.insights)) {
          setInsights(result.insights)
        }
      } catch (error) {
        console.error('Failed to fetch insights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [module, data])

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-xl border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>
      <div className="space-y-2">
        {loading ? (
          <p className="text-white/60">Loading insights...</p>
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <p key={index} className="text-white/80">{insight}</p>
          ))
        ) : (
          <p className="text-white/60">No insights available</p>
        )}
      </div>
    </Card>
  )
} 