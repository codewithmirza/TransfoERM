'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { AnalyticsEngine } from '@/lib/analytics/AnalyticsEngine'
import type { AnalyticsReport } from '@/types/analytics'
import { useEnv } from '@/hooks/useEnv'

export function RealTimeAnalyticsDashboard() {
  const [report, setReport] = useState<AnalyticsReport | null>(null)
  const [loading, setLoading] = useState(true)
  const env = useEnv()
  const engine = AnalyticsEngine.getInstance(env)

  useEffect(() => {
    let mounted = true

    async function fetchReport() {
      if (!mounted) return

      setLoading(true)
      try {
        const newReport = await engine.generateReport()
        setReport(newReport)
      } catch (error) {
        console.error('Failed to fetch analytics report:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
    const interval = setInterval(fetchReport, 60000) // Update every minute

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!report) {
    return <div>No data available</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium">Active Users</h3>
          <p className="text-2xl font-bold">{report.activeUsers}</p>
        </div>
      </Card>
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium">Page Views</h3>
          <p className="text-2xl font-bold">{report.pageViews}</p>
        </div>
      </Card>
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium">Session Duration</h3>
          <p className="text-2xl font-bold">{report.avgSessionDuration}s</p>
        </div>
      </Card>
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium">Bounce Rate</h3>
          <p className="text-2xl font-bold">{report.bounceRate}%</p>
        </div>
      </Card>
    </div>
  )
} 