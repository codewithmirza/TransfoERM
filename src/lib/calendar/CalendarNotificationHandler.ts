import { NotificationSystem, NotificationType, NotificationPriority } from '../notifications/NotificationSystem'
import { addMinutes, formatDistanceToNow } from 'date-fns'

export interface CalendarEventNotification {
  eventId: string
  title: string
  startTime: Date
  endTime?: Date
  location?: string
  description?: string
  attendees?: string[]
  notifyBefore: number // minutes
}

export class CalendarNotificationHandler {
  private static instance: CalendarNotificationHandler
  private notificationSystem: NotificationSystem
  private eventTimers: Map<string, NodeJS.Timeout>

  private constructor() {
    this.notificationSystem = NotificationSystem.getInstance()
    this.eventTimers = new Map()
  }

  static getInstance(): CalendarNotificationHandler {
    if (!CalendarNotificationHandler.instance) {
      CalendarNotificationHandler.instance = new CalendarNotificationHandler()
    }
    return CalendarNotificationHandler.instance
  }

  scheduleEventNotification(event: CalendarEventNotification) {
    // Clear any existing timer for this event
    this.clearEventTimer(event.eventId)

    const notificationTime = new Date(event.startTime.getTime() - (event.notifyBefore * 60000))
    const now = new Date()

    if (notificationTime > now) {
      const timer = setTimeout(() => {
        this.sendEventNotification(event)
      }, notificationTime.getTime() - now.getTime())

      this.eventTimers.set(event.eventId, timer)

      // Schedule a reminder notification
      this.scheduleReminderNotification(event)
    }
  }

  private scheduleReminderNotification(event: CalendarEventNotification) {
    const reminderTime = addMinutes(event.startTime, -5) // 5 minutes before
    const now = new Date()

    if (reminderTime > now) {
      const timer = setTimeout(() => {
        this.sendReminderNotification(event)
      }, reminderTime.getTime() - now.getTime())

      this.eventTimers.set(`${event.eventId}-reminder`, timer)
    }
  }

  private sendEventNotification(event: CalendarEventNotification) {
    this.notificationSystem.addNotification({
      title: `Upcoming: ${event.title}`,
      message: `Event starts in ${event.notifyBefore} minutes${event.location ? ` at ${event.location}` : ''}`,
      type: 'event' as NotificationType,
      priority: 'medium' as NotificationPriority,
      actions: [
        {
          label: 'View Details',
          action: () => this.handleViewEventDetails(event),
          style: 'primary'
        },
        {
          label: 'Snooze',
          action: () => this.handleSnoozeEvent(event),
          style: 'secondary'
        }
      ],
      metadata: {
        eventId: event.eventId,
        startTime: event.startTime,
        type: 'calendar_event'
      }
    })
  }

  private sendReminderNotification(event: CalendarEventNotification) {
    this.notificationSystem.addNotification({
      title: `Starting Soon: ${event.title}`,
      message: `Event starts in 5 minutes${event.location ? ` at ${event.location}` : ''}`,
      type: 'reminder' as NotificationType,
      priority: 'high' as NotificationPriority,
      actions: [
        {
          label: 'Join Now',
          action: () => this.handleJoinEvent(event),
          style: 'primary'
        }
      ],
      metadata: {
        eventId: event.eventId,
        startTime: event.startTime,
        type: 'calendar_reminder'
      }
    })
  }

  private handleViewEventDetails(event: CalendarEventNotification) {
    // Implement view event details logic
    console.log('Viewing event details:', event)
  }

  private handleSnoozeEvent(event: CalendarEventNotification) {
    // Reschedule notification for 5 minutes later
    const snoozedEvent = {
      ...event,
      notifyBefore: 5
    }
    this.scheduleEventNotification(snoozedEvent)
  }

  private handleJoinEvent(event: CalendarEventNotification) {
    // Implement join event logic (e.g., open video call link)
    console.log('Joining event:', event)
  }

  clearEventTimer(eventId: string) {
    const timer = this.eventTimers.get(eventId)
    if (timer) {
      clearTimeout(timer)
      this.eventTimers.delete(eventId)
    }

    const reminderTimer = this.eventTimers.get(`${eventId}-reminder`)
    if (reminderTimer) {
      clearTimeout(reminderTimer)
      this.eventTimers.delete(`${eventId}-reminder`)
    }
  }

  clearAllTimers() {
    this.eventTimers.forEach(timer => clearTimeout(timer))
    this.eventTimers.clear()
  }
} 