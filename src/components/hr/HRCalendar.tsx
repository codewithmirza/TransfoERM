'use client'

import { useState, useEffect } from 'react'
import { Calendar3D } from '@/components/calendar/Calendar3D'
import { CalendarNotificationHandler, CalendarEventNotification } from '@/lib/calendar/CalendarNotificationHandler'
import { RecurringEventModal, RecurringEvent } from '@/components/ui/calendar/RecurringEventModal'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface HREvent extends CalendarEventNotification {
  type: 'onboarding' | 'review' | 'training' | 'meeting'
  employeeId?: string
  department?: string
  priority: 'low' | 'medium' | 'high'
}

export function HRCalendar() {
  const [events, setEvents] = useState<HREvent[]>([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [notificationHandler] = useState(() => CalendarNotificationHandler.getInstance())

  useEffect(() => {
    // Schedule notifications for all events
    events.forEach(event => {
      notificationHandler.scheduleEventNotification(event)
    })

    // Cleanup notifications when component unmounts
    return () => {
      events.forEach(event => {
        notificationHandler.clearEventTimer(event.eventId)
      })
    }
  }, [events, notificationHandler])

  const handleRecurringEventSave = (recurringEvent: RecurringEvent) => {
    const newEvent: HREvent = {
      eventId: crypto.randomUUID(),
      title: recurringEvent.title,
      startTime: recurringEvent.startDate,
      endTime: recurringEvent.endDate,
      description: recurringEvent.description,
      notifyBefore: 30, // 30 minutes before
      type: 'meeting',
      priority: 'medium'
    }

    setEvents(prev => [...prev, newEvent])
    setShowEventModal(false)
  }

  const handleEventClick = (eventId: string) => {
    const event = events.find(e => e.eventId === eventId)
    if (event) {
      // Handle event click
      console.log('Event clicked:', event)
    }
  }

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "min-h-[600px]"
    )}>
      <div className="relative z-10">
        <Calendar3D
          events={events.map(event => ({
            id: event.eventId,
            title: event.title,
            date: event.startTime,
            type: event.type,
            description: event.description,
            metadata: {
              priority: event.priority,
              department: event.department
            }
          }))}
          onEventClick={handleEventClick}
          onAddEvent={() => setShowEventModal(true)}
        />
      </div>

      <RecurringEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleRecurringEventSave}
      />
    </Card>
  )
} 