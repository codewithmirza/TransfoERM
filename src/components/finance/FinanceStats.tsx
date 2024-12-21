'use client'

import { Card } from '@/components/ui/card'
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react'

interface Stat {
  title: string
  value: string
  change: string
  icon: any
  color: string
}

export function FinanceStats() {
  const stats: Stat[] = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: '+12.3%',
      icon: DollarSign,
      color: 'text-blue-500'
    },
    {
      title: 'Expenses',
      value: '$34,200',
      change: '-2.4%',
      icon: CreditCard,
      color: 'text-red-500'
    },
    {
      title: 'Balance',
      value: '$90,300',
      change: '+15.2%',
      icon: Wallet,
      color: 'text-green-500'
    },
    {
      title: 'Growth',
      value: '+22.4%',
      change: '+5.1%',
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/5 rounded-lg">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-white/60">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className={`text-xs ${
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 