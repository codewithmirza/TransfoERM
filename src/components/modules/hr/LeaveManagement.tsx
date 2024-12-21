'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Select } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import type { LeaveRequest } from '@/types/hr'
import { motion } from 'framer-motion'

export function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('/api/hr/leave-requests')
      const result = await response.json() as { success: boolean; data: LeaveRequest[] }
      if (result.success) {
        setLeaveRequests(result.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch leave requests',
        variant: 'destructive'
      })
    }
  }

  const handleLeaveRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/hr/leave-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        fetchLeaveRequests()
        toast({
          title: 'Success',
          description: `Leave request ${action}ed successfully`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} leave request`,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Leave Management</h2>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Request Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Leave Requests</h3>
          <div className="space-y-4">
            {leaveRequests.map(request => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{request.employeeId}</h4>
                    <p className="text-sm text-gray-500">
                      {request.type} Leave • {new Date(request.startDate).toLocaleDateString()} to{' '}
                      {new Date(request.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveRequest(request.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleLeaveRequest(request.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Calendar</h3>
          <Calendar />
        </Card>
      </div>
    </div>
  )
} 