'use client'

import { Card } from '@/components/ui/card'
import { GitBranch, Play, Pause, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Workflow() {
  const workflowStats = [
    {
      title: 'Active Workflows',
      value: '23',
      change: '5 running now',
      icon: GitBranch,
    },
    {
      title: 'Running',
      value: '5',
      change: '2 critical',
      icon: Play,
    },
    {
      title: 'Paused',
      value: '3',
      change: 'Maintenance',
      icon: Pause,
    },
    {
      title: 'Completed',
      value: '156',
      change: 'This month',
      icon: CheckCircle,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Workflow Automation</h2>
        <Button className="bg-teal-600 hover:bg-teal-700">Create Workflow</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {workflowStats.map((stat, index) => (
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

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Workflows</h3>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Workflow List Placeholder</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Workflow Analytics</h3>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Analytics Chart Placeholder</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
