'use client'

import { useEffect, useState } from 'react'
import { LineChart, BarChart } from '../charts'
import { AIInsights } from '../shared/AIInsights'
import { StatCard } from '../shared/StatCard'
import { useAI } from '@/hooks/useAI'

export function AnalyticsDashboard() {
  const [insights, setInsights] = useState<any[]>([])
  const { processCommand } = useAI()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    const result = await processCommand('Generate cross-module analytics')
    // Process analytics data
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="1,234" trend="+12%" />
        <StatCard title="Active Sessions" value="456" status="success" />
        <StatCard title="Processing Time" value="123ms" trend="-5%" />
        <StatCard title="AI Accuracy" value="98.5%" status="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Module Performance</h3>
          <LineChart
            data={[
              { name: 'HR', value: 89 },
              { name: 'Inventory', value: 94 },
              { name: 'Finance', value: 91 }
            ]}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Resource Usage</h3>
          <BarChart
            data={[
              { name: 'CPU', value: 65 },
              { name: 'Memory', value: 45 },
              { name: 'Storage', value: 30 }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AIInsights module="analytics" />
      </div>
    </div>
  )
} 