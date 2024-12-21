'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react'
import { AnalyticsChart, MetricsGrid } from '@/components/analytics'
import { AIInsights } from '@/components/shared/AIInsights'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <MetricsGrid />
      
      <div className="grid md:grid-cols-2 gap-6">
        <AnalyticsChart />
        <AIInsights module="analytics" />
      </div>
    </div>
  )
}
