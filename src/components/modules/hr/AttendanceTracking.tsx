'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from "@/lib/utils"
import { Clock, Calendar, UserCheck, UserX, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: 'present' | 'absent' | 'late' | 'half-day'
  workHours: number
  notes?: string
}

interface APIResponse<T> {
  success: boolean
  data: T
}

export function AttendanceTracking() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  // Fetch attendance data
  useEffect(() => {
    fetchAttendanceData()
  }, [selectedDate, view])

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`https://transfoerm.manwaarullahb.workers.dev/api/hr/attendance?date=${selectedDate.toISOString()}&view=${view}`)
      const data = await response.json() as APIResponse<AttendanceRecord[]>
      if (data.success) {
        setAttendanceData(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400'
      case 'absent': return 'bg-red-500/20 text-red-400'
      case 'late': return 'bg-yellow-500/20 text-yellow-400'
      case 'half-day': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "h-[600px]"
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Attendance Tracking</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              {['daily', 'weekly', 'monthly'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as typeof view)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm transition-all",
                    view === v ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            <DatePicker
              date={selectedDate}
              onChange={handleDateChange}
              className="bg-white/5 border-white/10"
            />

            <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Present', value: '45', icon: UserCheck, color: 'green' },
            { label: 'Absent', value: '3', icon: UserX, color: 'red' },
            { label: 'Late', value: '2', icon: Clock, color: 'yellow' },
            { label: 'On Leave', value: '5', icon: Calendar, color: 'blue' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-lg",
                "bg-white/5 border border-white/10",
                "hover:bg-white/10 transition-colors"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Attendance Table */}
        <div className="bg-white/5 rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Employee</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Check In</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Check Out</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Work Hours</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {record.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-white">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{record.checkIn}</td>
                    <td className="py-3 px-4 text-gray-300">{record.checkOut}</td>
                    <td className="py-3 px-4 text-gray-300">{record.workHours}h</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(record.status)
                      )}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{record.notes || '-'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  )
} 