'use client'

import { Card } from '@/components/ui/card'
import { Users, UserPlus, Calendar, Award, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HR() {
  const hrStats = [
    {
      title: 'Total Employees',
      value: '156',
      change: '+3 this month',
      icon: Users,
    },
    {
      title: 'Open Positions',
      value: '12',
      change: '4 urgent',
      icon: UserPlus,
    },
    {
      title: 'Time Off Requests',
      value: '8',
      change: 'Pending approval',
      icon: Calendar,
    },
    {
      title: 'Performance Reviews',
      value: '23',
      change: 'Due this month',
      icon: Award,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Human Resources</h2>
        <div className="space-x-4">
          <Button variant="outline">View Calendar</Button>
          <Button className="bg-teal-600 hover:bg-teal-700">Add Employee</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hrStats.map((stat, index) => (
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Applications</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Applications List Placeholder</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Employee Directory</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Directory Placeholder</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upcoming Reviews</h3>
          <Button variant="outline" size="sm">
            Schedule Review
          </Button>
        </div>
        <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Reviews Calendar Placeholder</p>
        </div>
      </Card>
    </div>
  )
}
