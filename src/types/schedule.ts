export interface Schedule {
  type?: 'recurring' | 'one-time' | 'conditional'
  value?: string // For cron expressions or interval values
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly'
  startTime?: Date
  endTime?: Date
  timezone?: string
  repeatCount?: number
  metadata?: Record<string, any>
} 