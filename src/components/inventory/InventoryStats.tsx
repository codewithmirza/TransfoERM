'use client'

import { Card } from '@/components/ui/card'
import { Package, AlertTriangle, TrendingUp, BarChart } from 'lucide-react'

export function InventoryStats() {
  const stats = [
    {
      title: 'Total Items',
      value: '2,345',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Low Stock',
      value: '12',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Recent Movements',
      value: '89',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Monthly Trend',
      value: '+12%',
      icon: BarChart,
      color: 'purple'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
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
  )
} 