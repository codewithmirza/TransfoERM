'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { MonitoringEngine } from '@/lib/monitoring/MonitoringEngine'
import type { HealthCheck } from '@/types/monitoring'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export function PerformanceMonitor() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])
  const [metrics, setMetrics] = useState<any[]>([])

  useEffect(() => {
    const engine = MonitoringEngine.getInstance()

    const updateInterval = setInterval(() => {
      // Update health checks and metrics
      engine.getAllHealthChecks().then(setHealthChecks)
      engine.getLatestMetrics().then(setMetrics)
    }, 5000)

    return () => clearInterval(updateInterval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthChecks.map((check) => (
          <Card key={check.service} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{check.service}</h3>
              <StatusBadge status={check.status} />
            </div>
            <div className="mt-4 space-y-2">
              <Metric label="Latency" value={`${check.details.latency}ms`} />
              <Metric label="Uptime" value={`${check.details.uptime}%`} />
              <Metric label="Errors" value={check.details.errors} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-medium mb-4">System Metrics</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#0ea5e9"
                name="CPU Usage"
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#8b5cf6"
                name="Memory Usage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: HealthCheck['status'] }) {
  const colors = {
    healthy: 'bg-green-100 text-green-800',
    degraded: 'bg-yellow-100 text-yellow-800',
    unhealthy: 'bg-red-100 text-red-800'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
} 