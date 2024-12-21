'use client'

import { Card } from '@/components/ui/card'
import {
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  Target,
  TrendingUp,
  Users,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Analytics() {
  const analyticsStats = [
    {
      title: 'Total Users',
      value: '24.5K',
      change: '+12% this month',
      icon: Users,
    },
    {
      title: 'Page Views',
      value: '1.2M',
      change: '+8% this week',
      icon: Activity,
    },
    {
      title: 'Conversion Rate',
      value: '3.8%',
      change: '+2.1% avg',
      icon: Target,
    },
    {
      title: 'Active Markets',
      value: '12',
      change: '3 new regions',
      icon: Globe,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="space-x-4">
          <Button variant="outline">Export Data</Button>
          <Button className="bg-teal-600 hover:bg-teal-700">Create Report</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-teal-600">{stat.change}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <stat.icon className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Performance Trends</h3>
            <Button variant="outline" size="sm">
              Last 30 Days
            </Button>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Performance Chart Placeholder</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Traffic Sources</h3>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Traffic Chart Placeholder</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">User Demographics</h3>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
          <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Demographics Chart Placeholder</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Conversion Funnel</h3>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
          <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Funnel Chart Placeholder</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
