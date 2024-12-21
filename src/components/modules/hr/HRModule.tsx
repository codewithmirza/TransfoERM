'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from "@/lib/utils"
import { Users, Award, Calendar, Briefcase, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'

interface Employee {
  id: string
  name: string
  position: string
  department: string
  status: 'active' | 'onboarding' | 'review'
  timeline: TimelineEvent[]
  avatar: string
}

interface TimelineEvent {
  id: string
  type: 'onboarding' | 'promotion' | 'review' | 'training'
  date: Date
  title: string
  description: string
}

export function HRModule() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [timelineZoom, setTimelineZoom] = useState(1)

  // Sample data
  const employees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      position: 'Senior Developer',
      department: 'Engineering',
      status: 'active',
      avatar: 'JD',
      timeline: [
        {
          id: 't1',
          type: 'onboarding',
          date: new Date('2023-01-15'),
          title: 'Started at TransfoERM',
          description: 'Joined as Junior Developer'
        },
        {
          id: 't2',
          type: 'promotion',
          date: new Date('2023-06-01'),
          title: 'Promotion',
          description: 'Promoted to Senior Developer'
        },
        {
          id: 't3',
          type: 'review',
          date: new Date('2023-12-15'),
          title: 'Performance Review',
          description: 'Exceeded expectations'
        }
      ]
    }
    // Add more employees...
  ]

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "h-[600px]"
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Employee Lifecycle</h2>
          </div>
          <button className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Employee List */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            {employees.map((employee) => (
              <motion.div
                key={employee.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedEmployee(employee.id)}
                className={cn(
                  "p-4 rounded-lg border transition-all cursor-pointer",
                  "bg-white/5 border-white/10",
                  selectedEmployee === employee.id && "border-purple-500/50 bg-purple-500/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">{employee.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{employee.name}</h3>
                    <p className="text-white/60 text-sm">{employee.position}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline View */}
          <div className="col-span-2 border-l border-white/10 pl-6">
            {selectedEmployee ? (
              <EmployeeTimeline
                employee={employees.find(e => e.id === selectedEmployee)!}
                zoom={timelineZoom}
                onZoomChange={setTimelineZoom}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-white/40">
                Select an employee to view their timeline
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function EmployeeTimeline({ employee, zoom, onZoomChange }: { 
  employee: Employee
  zoom: number
  onZoomChange: (zoom: number) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{employee.name}'s Journey</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onZoomChange(zoom - 0.5)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
          >
            -
          </button>
          <button
            onClick={() => onZoomChange(zoom + 0.5)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative" style={{ transform: `scale(${zoom})` }}>
        {employee.timeline.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 mb-6"
          >
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-purple-500" />
              {index < employee.timeline.length - 1 && (
                <div className="absolute top-4 left-2 w-0.5 h-16 bg-purple-500/20" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {event.type === 'onboarding' && <Briefcase className="w-4 h-4 text-purple-400" />}
                {event.type === 'promotion' && <Award className="w-4 h-4 text-purple-400" />}
                {event.type === 'review' && <Calendar className="w-4 h-4 text-purple-400" />}
                <h4 className="text-white font-medium">{event.title}</h4>
              </div>
              <p className="text-white/60 text-sm">{event.description}</p>
              <p className="text-white/40 text-xs mt-1">
                {event.date.toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 