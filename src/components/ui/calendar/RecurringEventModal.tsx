'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'

interface RecurringEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: RecurringEvent) => void
}

export interface RecurringEvent {
  title: string
  startDate: Date
  endDate?: Date
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[]
  endAfterOccurrences?: number
  description?: string
}

export function RecurringEventModal({ isOpen, onClose, onSave }: RecurringEventModalProps) {
  const [event, setEvent] = useState<RecurringEvent>({
    title: '',
    startDate: new Date(),
    frequency: 'weekly',
    interval: 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(event)
    onClose()
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Create Recurring Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Title</label>
            <Input
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="w-full"
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker
                date={event.startDate}
                onChange={(date) => date && setEvent({ ...event, startDate: date })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date (Optional)</label>
              <DatePicker
                date={event.endDate}
                onChange={(date) => setEvent({ ...event, endDate: date })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select
              value={event.frequency}
              onValueChange={(value: RecurringEvent['frequency']) => 
                setEvent({ ...event, frequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interval</label>
            <Input
              type="number"
              min={1}
              value={event.interval}
              onChange={(e) => setEvent({ ...event, interval: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {event.frequency === 'weekly' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Days of Week</label>
              <div className="flex gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const days = event.daysOfWeek || []
                      const newDays = days.includes(index)
                        ? days.filter(d => d !== index)
                        : [...days, index]
                      setEvent({ ...event, daysOfWeek: newDays })
                    }}
                    className={cn(
                      "p-2 rounded-full w-10 h-10",
                      "border border-gray-200 hover:border-gray-300",
                      event.daysOfWeek?.includes(index) && "bg-primary text-white"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              className={cn(
                "w-full min-h-[100px] p-2 rounded-md",
                "border border-gray-200",
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              placeholder="Add event description..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
} 