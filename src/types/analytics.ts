export interface AnalyticsReport {
  activeUsers: number
  pageViews: number
  avgSessionDuration: number
  bounceRate: number
}

export type TimeFrame = 'day' | 'week' | 'month'

export interface AnalyticsStat {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

export interface AnalyticsResponse {
  success: boolean
  error?: string
  data: AnalyticsStat[]
} 