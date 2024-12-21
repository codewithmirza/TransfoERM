'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { format, addMonths, subMonths, isSameDay } from 'date-fns'

interface Calendar3DEvent {
  id: string
  title: string
  date: Date
  type: 'onboarding' | 'review' | 'training' | 'meeting' | 'task' | 'reminder'
  description?: string
  metadata?: Record<string, any>
}

interface Calendar3DProps {
  events: Calendar3DEvent[]
  onEventClick?: (eventId: string) => void
  onAddEvent?: () => void
}

export function Calendar3D({ events = [], onEventClick, onAddEvent }: Calendar3DProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl",
      "bg-black/40 backdrop-blur-md border border-white/10",
      "before:absolute before:inset-0",
      "before:bg-gradient-to-r before:from-indigo-500/10 before:to-purple-500/10"
    )}>
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Calendar</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white/60" />
            </button>
            <span className="text-white/80 font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white/60" />
            </button>
            {onAddEvent && (
              <button
                onClick={onAddEvent}
                className="ml-4 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 
                         text-indigo-400 hover:bg-indigo-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week days */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white/40 text-sm py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          <AnimatePresence mode="wait">
            {generateCalendarDays(currentMonth).map((day, index) => (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "aspect-square p-2 rounded-lg",
                  "border border-white/10",
                  "hover:border-indigo-500/50 transition-colors cursor-pointer",
                  isSameDay(day, new Date()) && "bg-indigo-500/10 border-indigo-500/20"
                )}
              >
                <div className="text-sm text-white/60">
                  {format(day, 'd')}
                </div>
                {/* Event indicators */}
                {events
                  .filter(event => isSameDay(event.date, day))
                  .map(event => (
                    <motion.div
                      key={event.id}
                      onClick={() => onEventClick?.(event.id)}
                      className={cn(
                        "mt-1 p-1 text-xs rounded-md",
                        "bg-indigo-500/20 text-indigo-400 truncate",
                        "hover:bg-indigo-500/30 cursor-pointer transition-colors"
                      )}
                    >
                      {event.title}
                    </motion.div>
                  ))
                }
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function generateCalendarDays(month: Date): Date[] {
  const start = new Date(month.getFullYear(), month.getMonth(), 1)
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const days: Date[] = []

  // Add days from previous month to start on Sunday
  const startDay = start.getDay()
  for (let i = startDay; i > 0; i--) {
    const date = new Date(start)
    date.setDate(start.getDate() - i)
    days.push(date)
  }

  // Add days of current month
  for (let i = 0; i < end.getDate(); i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push(date)
  }

  // Add days from next month to complete the grid
  const remainingDays = 42 - days.length // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(end)
    date.setDate(end.getDate() + i)
    days.push(date)
  }

  return days
} 