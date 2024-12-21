'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, FileText, DollarSign, Plus } from 'lucide-react'
import { AIInsights } from '@/components/shared/AIInsights'

interface HRStats {
  totalEmployees: number
  activeLeaveRequests: number
  upcomingReviews: number
  monthlyPayroll: string
}

export function HRDashboard() {
  const [stats, setStats] = useState<HRStats>({
    totalEmployees: 0,
    activeLeaveRequests: 0,
    upcomingReviews: 0,
    monthlyPayroll: '$0'
  })

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Leave Requests',
      value: stats.activeLeaveRequests,
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Upcoming Reviews',
      value: stats.upcomingReviews,
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Monthly Payroll',
      value: stats.monthlyPayroll,
      icon: DollarSign,
      color: 'yellow'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">HR Dashboard</h2>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-4 bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-4">
              <div className={`p-2 bg-${stat.color}-500/10 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
              <div>
                <p className="text-sm text-white/60">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AIInsights module="hr" data={stats} />
      </div>
    </div>
  )
} 