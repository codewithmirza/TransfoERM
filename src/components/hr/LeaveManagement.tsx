'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User } from 'lucide-react'

interface LeaveRequest {
  id: string
  employeeName: string
  type: string
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'rejected'
}

export function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Leave Management</h3>
        <Button variant="outline" size="sm">
          New Request
        </Button>
      </div>
      <div className="space-y-4">
        {leaveRequests.length > 0 ? (
          leaveRequests.map((request) => (
            <div key={request.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-white">{request.employeeName}</p>
                  <p className="text-sm text-white/60">{request.type}</p>
                </div>
                <span className={`text-sm ${
                  request.status === 'approved' ? 'text-green-400' :
                  request.status === 'rejected' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/60 text-center py-4">No leave requests</p>
        )}
      </div>
    </Card>
  )
} 