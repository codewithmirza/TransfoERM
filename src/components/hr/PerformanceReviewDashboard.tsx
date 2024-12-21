'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { PerformanceReview } from './PerformanceReview'
import { PerformanceReviewService } from '@/lib/services/PerformanceReviewService'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import type { PerformanceReviewTemplate } from '@/types/hr'

interface ReviewStats {
  completed: number
  pending: number
  overdue: number
  averageScore: number
}

export function PerformanceReviewDashboard() {
  const [stats, setStats] = useState<ReviewStats>({
    completed: 0,
    pending: 0,
    overdue: 0,
    averageScore: 0
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [reviewService] = useState(() => PerformanceReviewService.getInstance())

  const templates: PerformanceReviewTemplate[] = [
    {
      id: 'dev-review',
      name: 'Developer Review',
      department: 'Engineering',
      metrics: [
        {
          id: 'technical_skills',
          name: 'Technical Skills',
          category: 'skills',
          weight: 0.3,
          description: 'Assessment of technical capabilities and knowledge'
        },
        {
          id: 'communication',
          name: 'Communication',
          category: 'behavior',
          weight: 0.2,
          description: 'Effectiveness in written and verbal communication'
        }
      ],
      requiredFields: ['strengths', 'improvements', 'goals']
    },
    {
      id: 'manager-review',
      name: 'Manager Review',
      department: 'Management',
      metrics: [
        {
          id: 'leadership',
          name: 'Leadership',
          category: 'skills',
          weight: 0.4,
          description: 'Ability to lead and inspire teams'
        },
        {
          id: 'strategic_thinking',
          name: 'Strategic Thinking',
          category: 'skills',
          weight: 0.3,
          description: 'Capacity for strategic planning and execution'
        }
      ],
      requiredFields: ['strengths', 'improvements', 'goals', 'team_feedback']
    }
  ]

  useEffect(() => {
    // Fetch and update stats
    updateStats()
  }, [])

  const updateStats = async () => {
    // In a real app, this would fetch from an API
    setStats({
      completed: 12,
      pending: 5,
      overdue: 2,
      averageScore: 4.2
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Completed Reviews"
          value={stats.completed}
          icon={CheckCircle}
          trend={+15}
          color="emerald"
        />
        <StatsCard
          title="Pending Reviews"
          value={stats.pending}
          icon={Users}
          trend={-2}
          color="blue"
        />
        <StatsCard
          title="Overdue Reviews"
          value={stats.overdue}
          icon={AlertCircle}
          trend={+1}
          color="red"
        />
        <StatsCard
          title="Average Score"
          value={stats.averageScore}
          icon={TrendingUp}
          trend={+0.3}
          color="purple"
          decimals={1}
        />
      </div>

      {/* Templates and Review Form */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <Card className={cn(
          "lg:col-span-1",
          "bg-black/40 backdrop-blur-xl border border-white/10",
          "p-6"
        )}>
          <h3 className="text-lg font-semibold text-white mb-4">Review Templates</h3>
          <div className="space-y-3">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  "w-full p-4 rounded-lg text-left transition-all",
                  "border border-white/10 hover:border-purple-500/30",
                  "bg-white/5 hover:bg-purple-500/10",
                  selectedTemplate === template.id && "border-purple-500/50 bg-purple-500/10"
                )}
              >
                <h4 className="font-medium text-white">{template.name}</h4>
                <p className="text-sm text-white/60">{template.department}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Review Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedTemplate ? (
              <motion.div
                key={selectedTemplate}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PerformanceReview
                  template={templates.find(t => t.id === selectedTemplate)!}
                  onComplete={updateStats}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full"
              >
                <p className="text-white/60">Select a template to start a review</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  icon: React.ElementType
  trend: number
  color: 'emerald' | 'blue' | 'red' | 'purple'
  decimals?: number
}

function StatsCard({ title, value, icon: Icon, trend, color, decimals = 0 }: StatsCardProps) {
  const colorClasses = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-400',
    blue: 'from-blue-500/10 to-blue-500/5 text-blue-400',
    red: 'from-red-500/10 to-red-500/5 text-red-400',
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
            {value.toFixed(decimals)}
          </h4>
          <span className={cn(
            "text-sm",
            trend > 0 ? "text-emerald-400" : "text-red-400"
          )}>
            {trend > 0 ? '+' : ''}{trend.toFixed(decimals)}
          </span>
        </div>
      </div>
    </Card>
  )
} 