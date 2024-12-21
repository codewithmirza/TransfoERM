'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet 
} from 'lucide-react'
import { InsightsPanel } from '@/components/ai/InsightsPanel'
import type { AIAnalysisResult } from '@/types/ai'

interface FinanceStats {
  title: string
  value: string
  change: string
  icon: any // Using any for Lucide icons
  trend: 'up' | 'down'
}

export function Finance() {
  const financeStats: FinanceStats[] = [
    {
      title: 'Total Revenue',
      value: '$678,420',
      change: '+12.5% from last month',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Expenses',
      value: '$234,580',
      change: '+8.2% from last month',
      icon: CreditCard,
      trend: 'down',
    },
    {
      title: 'Profit Margin',
      value: '32.8%',
      change: '+2.4% from last month',
      icon: TrendingUp,
      trend: 'up',
    },
    {
      title: 'Cash Flow',
      value: '$123,890',
      change: '+5.1% from last month',
      icon: Wallet,
      trend: 'up',
    },
  ]

  const analysisData: AIAnalysisResult = {
    type: 'finance',
    timeframe: 'monthly',
    metrics: ['revenue', 'expenses', 'profit'],
    insights: [],
    trends: [],
    recommendations: [],
    alerts: [],
    confidence: 0.95,
    metadata: {
      timestamp: new Date().toISOString(),
      source: 'finance-module',
      model: 'gpt-4'
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financeStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className={`text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <InsightsPanel data={analysisData} />
    </div>
  )
}
