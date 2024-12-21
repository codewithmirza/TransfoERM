'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { MonitoringPanel as PanelType } from '@/types/monitoring'

interface MonitoringPanelProps {
  panel: PanelType
}

export function MonitoringPanel({ panel }: MonitoringPanelProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Fetch initial data and setup real-time updates
  }, [panel])

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{panel.title}</h3>
        <div className="flex items-center gap-2">
          {/* Add panel controls */}
        </div>
      </div>

      <div className="h-[300px]">
        {panel.type === 'graph' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              {panel.metrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey="value"
                  stroke={getColor(index)}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {/* Add other panel types */}
      </div>
    </Card>
  )
}

function getColor(index: number): string {
  const colors = [
    '#2563eb', // blue-600
    '#16a34a', // green-600
    '#dc2626', // red-600
    '#9333ea', // purple-600
    '#ea580c', // orange-600
  ]
  return colors[index % colors.length]
} 