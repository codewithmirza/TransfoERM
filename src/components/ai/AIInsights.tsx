'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Brain, Sparkles, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAI } from '@/hooks/useAI'
import { AIInsight } from '@/types/ai'

interface AIInsightsProps {
  module: string
  data?: any
}

export function AIInsights({ module, data }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const { generateInsights } = useAI()

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true)
        const result = await generateInsights(module, data)
        setInsights(result.insights)
      } catch (error) {
        console.error('Failed to fetch insights:', error)
        setInsights([{
          message: 'Unable to generate insights at this time.',
          type: 'alert'
        }])
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [module, data, generateInsights])

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-xl border border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <Brain className="w-5 h-5 text-purple-400" />
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/20"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <h3 className="text-lg font-semibold text-white">AI Insights</h3>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center gap-2 text-white/60">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Analyzing data...</span>
            </div>
          ) : insights.length > 0 ? (
            insights.map((insight, index) => (
              <motion.div
                key={insight.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <p className="text-white/80">{insight.message}</p>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-white/60">
              <AlertTriangle className="w-4 h-4" />
              <span>No insights available</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 