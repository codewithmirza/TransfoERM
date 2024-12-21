'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react'

interface Metric {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: any
  color: string
}

export function MetricsGrid() {
  const metrics: Metric[] = [
    {
      title: 'Total Revenue',
      value: '$52,000',
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-500'
    },
    {
      title: 'Active Users',
      value: '2,345',
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      color: 'text-green-500'
    },
    {
      title: 'Sales',
      value: '456',
      change: '+23.4%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-purple-500'
    },
    {
      title: 'Growth',
      value: '15.2%',
      change: '+4.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-yellow-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/5 rounded-lg">
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div>
              <p className="text-sm text-white/60">{metric.title}</p>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 