'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from "@/lib/utils"
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { LucideIcon } from 'lucide-react'

interface AnalyticsModuleProps {
  id: string
  title: string
  type: string
  icon: LucideIcon
  color: string
}

export function AnalyticsModule({ id, title, type, icon: Icon, color }: AnalyticsModuleProps) {
  // Sample data for the charts
  const data = Array.from({ length: 20 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 50,
    trend: Math.floor(Math.random() * 100) + 30
  }))

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "h-[400px]"
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 text-${color}-400`} />
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <motion.div
            className={`w-2 h-2 rounded-full bg-${color}-500`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Chart */}
        <div className="h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--${color}-500)`} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={`var(--${color}-500)`} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px"
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={`var(--${color}-500)`}
                fillOpacity={1}
                fill={`url(#gradient-${id})`}
              />
              <Line
                type="monotone"
                dataKey="trend"
                stroke={`var(--${color}-300)`}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Current"
            value={data[data.length - 1].value.toString()}
            trend="+12%"
            color={color}
          />
          <MetricCard
            title="Projected"
            value={data[data.length - 1].trend.toString()}
            trend="+8%"
            color={color}
          />
        </div>
      </div>
    </Card>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend: string
  color: string
}

function MetricCard({ title, value, trend, color }: MetricCardProps) {
  const isPositive = trend.startsWith('+')
  
  return (
    <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-white">{value}</p>
        <p className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-400" : "text-red-400"
        )}>
          {trend}
        </p>
      </div>
    </div>
  )
} 