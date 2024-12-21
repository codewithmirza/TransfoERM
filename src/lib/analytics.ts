import { Env } from '@/types/cloudflare'

interface AnalyticsEvent {
  type: string
  userId?: string
  metadata: Record<string, any>
  timestamp: string
}

export class Analytics {
  constructor(private env: Env) {}

  async trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
    await this.env.DB.prepare(`
      INSERT INTO analytics (
        event_type,
        user_id,
        metadata,
        created_at
      ) VALUES (?, ?, ?, ?)
    `).bind(
      event.type,
      event.userId || null,
      JSON.stringify(event.metadata),
      new Date().toISOString()
    ).run()
  }

  async getStats(timeframe: 'day' | 'week' | 'month' = 'day') {
    const timeframes = {
      day: "datetime('now', '-1 day')",
      week: "datetime('now', '-7 days')",
      month: "datetime('now', '-30 days')"
    }

    return await this.env.DB.prepare(`
      SELECT 
        event_type,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users
      FROM analytics
      WHERE created_at >= ${timeframes[timeframe]}
      GROUP BY event_type
      ORDER BY count DESC
    `).all()
  }
} 