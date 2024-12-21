'use client'

import { Card } from '@/components/ui/card'

const activities = [
  {
    id: 1,
    type: 'workflow',
    description: 'New workflow created',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'user',
    description: 'User settings updated',
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    type: 'system',
    description: 'System backup completed',
    timestamp: '6 hours ago',
  },
]

export function RecentActivity() {
  return (
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <p className="text-sm text-gray-500">Latest system events</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
