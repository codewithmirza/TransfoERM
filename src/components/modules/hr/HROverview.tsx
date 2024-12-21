'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users,
  UserPlus,
  FileText,
  Calendar,
  AlertCircle,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface HRStats {
  totalEmployees: number
  activeEmployees: number
  onLeave: number
  departments: {
    name: string
    employeeCount: number
    avgTenure: number
  }[]
  upcomingReviews: {
    id: string
    name: string
    department: string
    reviewDate: string
  }[]
  leaveRequests: {
    id: string
    employeeName: string
    type: 'vacation' | 'sick' | 'personal' | 'other'
    startDate: string
    endDate: string
    status: 'pending' | 'approved' | 'rejected'
  }[]
}

export function HROverview() {
  const [stats, setStats] = useState<HRStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    departments: [],
    upcomingReviews: [],
    leaveRequests: []
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchHRStats()
  }, [])

  const fetchHRStats = async () => {
    try {
      const response = await fetch('https://transfoerm.manwaarullahb.workers.dev/api/hr/summary')
      const data = await response.json()
      
      if (data.success) {
        setStats({
          totalEmployees: data.totalEmployees || 0,
          activeEmployees: data.activeEmployees || 0,
          onLeave: data.onLeave || 0,
          departments: data.departments || [],
          upcomingReviews: data.upcomingReviews || [],
          leaveRequests: data.leaveRequests || []
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch HR statistics',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`https://transfoerm.manwaarullahb.workers.dev/api/hr/leave/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Leave request ${action}ed successfully`,
        })
        fetchHRStats() // Refresh data
      } else {
        throw new Error('Failed to update leave request')
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <h3 className="text-2xl font-bold">{stats.totalEmployees}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Employees</p>
              <h3 className="text-2xl font-bold">{stats.activeEmployees}</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">On Leave</p>
              <h3 className="text-2xl font-bold">{stats.onLeave}</h3>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Department Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Department Overview</h3>
        <div className="space-y-4">
          {stats.departments.map((dept) => (
            <div key={dept.name} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{dept.name}</p>
                <p className="text-sm text-gray-500">
                  {dept.employeeCount} employees • Avg. Tenure: {dept.avgTenure.toFixed(1)} years
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming Reviews */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Upcoming Reviews</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchHRStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="space-y-4">
          {stats.upcomingReviews.map((review) => (
            <div key={review.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{review.name}</p>
                <p className="text-sm text-gray-500">
                  {review.department} • Due: {new Date(review.reviewDate).toLocaleDateString()}
                </p>
              </div>
              <Button size="sm">
                Schedule
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Leave Requests */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Pending Leave Requests</h3>
        </div>
        <div className="space-y-4">
          {stats.leaveRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{request.employeeName}</p>
                <p className="text-sm text-gray-500">
                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave •{' '}
                  {new Date(request.startDate).toLocaleDateString()} to{' '}
                  {new Date(request.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {request.status === 'pending' ? (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-green-600"
                      onClick={() => handleLeaveRequest(request.id, 'approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600"
                      onClick={() => handleLeaveRequest(request.id, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <span className={`text-sm font-medium ${
                    request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 