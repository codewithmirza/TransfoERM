'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TrendingUp, Users, Star, Target, ChevronUp, ChevronDown } from 'lucide-react'
import type { PerformanceMetric } from '@/types/hr'

interface AnalyticsData {
  departmentAverages: Record<string, number>
  skillDistribution: Record<string, number>
  trends: {
    period: string
    score: number
    change: number
  }[]
  topPerformers: {
    employeeId: string
    name: string
    score: number
    department: string
  }[]
  metrics: PerformanceMetric[]
}

export function PerformanceAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<string>('overall')

  useEffect(() => {
    // In a real app, this would fetch from an API
    setData({
      departmentAverages: {
        Engineering: 4.2,
        Marketing: 3.8,
        Sales: 4.0,
        'Customer Support': 3.9
      },
      skillDistribution: {
        'Technical Skills': 4.1,
        Communication: 3.8,
        Leadership: 3.9,
        Innovation: 4.0
      },
      trends: [
        { period: 'Jan', score: 3.8, change: 0 },
        { period: 'Feb', score: 3.9, change: 0.1 },
        { period: 'Mar', score: 4.1, change: 0.2 },
        { period: 'Apr', score: 4.0, change: -0.1 }
      ],
      topPerformers: [
        { employeeId: '1', name: 'John Doe', score: 4.8, department: 'Engineering' },
        { employeeId: '2', name: 'Jane Smith', score: 4.7, department: 'Marketing' },
        { employeeId: '3', name: 'Mike Johnson', score: 4.6, department: 'Sales' }
      ],
      metrics: [
        {
          id: 'technical_skills',
          name: 'Technical Skills',
          category: 'skills',
          weight: 0.3,
          description: 'Technical capabilities assessment'
        },
        {
          id: 'communication',
          name: 'Communication',
          category: 'behavior',
          weight: 0.2,
          description: 'Communication effectiveness'
        }
      ]
    })
  }, [])

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Average Score"
          value={4.1}
          change={0.2}
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Reviews Completed"
          value={42}
          change={8}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Top Performers"
          value={12}
          change={3}
          icon={Star}
          color="amber"
        />
        <MetricCard
          title="Goals Achieved"
          value={85}
          suffix="%"
          change={5}
          icon={Target}
          color="purple"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Department Averages */}
        <Card className={cn(
          "relative overflow-hidden",
          "bg-black/40 backdrop-blur-xl border border-white/10",
          "p-6"
        )}>
          <h3 className="text-lg font-semibold text-white mb-4">Department Performance</h3>
          <div className="space-y-4">
            {Object.entries(data.departmentAverages).map(([dept, score]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-white/60">{dept}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 5) * 100}%` }}
                      className="h-full rounded-full bg-indigo-500"
                    />
                  </div>
                  <span className="text-white font-medium">{score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Distribution */}
        <Card className={cn(
          "relative overflow-hidden",
          "bg-black/40 backdrop-blur-xl border border-white/10",
          "p-6"
        )}>
          <h3 className="text-lg font-semibold text-white mb-4">Skill Distribution</h3>
          <div className="space-y-4">
            {Object.entries(data.skillDistribution).map(([skill, score]) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-white/60">{skill}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 5) * 100}%` }}
                      className="h-full rounded-full bg-purple-500"
                    />
                  </div>
                  <span className="text-white font-medium">{score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className={cn(
        "relative overflow-hidden",
        "bg-black/40 backdrop-blur-xl border border-white/10",
        "p-6"
      )}>
        <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
        <div className="grid grid-cols-3 gap-4">
          {data.topPerformers.map((performer, index) => (
            <motion.div
              key={performer.employeeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-lg",
                "bg-white/5 border border-white/10",
                "hover:bg-white/10 transition-colors"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{performer.name}</h4>
                <span className={cn(
                  "px-2 py-1 rounded text-sm font-medium",
                  "bg-emerald-500/20 text-emerald-400"
                )}>
                  {performer.score.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-white/60">{performer.department}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number
  change: number
  icon: React.ElementType
  color: 'emerald' | 'blue' | 'amber' | 'purple'
  suffix?: string
}

function MetricCard({ title, value, change, icon: Icon, color, suffix = '' }: MetricCardProps) {
  const colorClasses = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-400',
    blue: 'from-blue-500/10 to-blue-500/5 text-blue-400',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-400',
    purple: 'from-purple-500/10 to-purple-500/5 text-purple-400'
  }

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "p-6"
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-20",
        colorClasses[color]
      )} />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/60">{title}</p>
          <Icon className={cn("w-5 h-5", colorClasses[color])} />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h4 className="text-2xl font-semibold text-white">
            {value}{suffix}
          </h4>
          <span className={cn(
            "flex items-center text-sm",
            change > 0 ? "text-emerald-400" : "text-red-400"
          )}>
            {change > 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {Math.abs(change)}{suffix}
          </span>
        </div>
      </div>
    </Card>
  )
} 