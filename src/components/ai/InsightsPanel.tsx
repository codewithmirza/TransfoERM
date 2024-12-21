'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  AlertTriangle,
  ArrowUpRight,
  Info
} from 'lucide-react'
import type { AIAnalysisResult, AIMetric } from '@/types/ai'

interface MetricData {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface InsightsPanelProps {
  data: AIAnalysisResult
}

export function InsightsPanel({ data }: InsightsPanelProps) {
  const [selectedInsight, setSelectedInsight] = useState<AIAnalysisResult | null>(null)

  const handleInsightClick = (insight: AIAnalysisResult) => {
    setSelectedInsight(insight)
  }

  const metricData: MetricData[] = data.metrics.map(metric => ({
    name: metric,
    value: 0,
    change: 0,
    trend: 'stable'
  }))

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  return (
    <div>
      <div className="grid gap-4">
        {metricData.map((metric, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">{metric.name}</h3>
            <div className="mt-2">
              <span className="text-2xl">{metric.value}</span>
              <span className={`ml-2 ${getChangeColor(metric.change)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Rest of your component */}
    </div>
  )
}
