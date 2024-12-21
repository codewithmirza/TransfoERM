import type { AppNotification } from '@/types/notifications'
import type { Env } from '@/types/cloudflare'

export class NotificationManager {
  constructor(private env: Env) {}

  async createNotification(data: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): Promise<AppNotification> {
    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()

    const notification: AppNotification = {
      id,
      ...data,
      timestamp,
      read: false,
      details: data.details || {}
    }

    // Store in D1
    await this.env.DB.prepare(`
      INSERT INTO notifications (
        id, type, module, message, details, timestamp, read, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      notification.id,
      notification.type,
      notification.module,
      notification.message,
      JSON.stringify(notification.details),
      notification.timestamp,
      notification.read,
      notification.user_id || null
    ).run()

    // Store in KV for real-time access
    await this.env.CACHE.put(
      `notification:${id}`,
      JSON.stringify(notification),
      { expirationTtl: 86400 } // 24 hours
    )

    return notification
  }

  async getNotifications(userId?: string, limit = 50): Promise<AppNotification[]> {
    const query = userId
      ? `SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY timestamp DESC LIMIT ?`
      : `SELECT * FROM notifications WHERE user_id IS NULL ORDER BY timestamp DESC LIMIT ?`

    const params = userId ? [userId, limit] : [limit]
    const result = await this.env.DB.prepare(query).bind(...params).all()

    return (result.results || []).map(row => ({
      id: String(row.id),
      type: row.type as AppNotification['type'],
      module: row.module as AppNotification['module'],
      message: String(row.message),
      details: JSON.parse(String(row.details || '{}')),
      timestamp: String(row.timestamp),
      read: Boolean(row.read),
      user_id: row.user_id ? String(row.user_id) : undefined
    }))
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.env.DB.prepare(`
      UPDATE notifications SET read = true WHERE id = ?
    `).bind(notificationId).run()

    const notification = await this.env.CACHE.get(`notification:${notificationId}`)
    if (notification) {
      const data = JSON.parse(notification)
      await this.env.CACHE.put(
        `notification:${notificationId}`,
        JSON.stringify({ ...data, read: true })
      )
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.env.DB.prepare(`
      DELETE FROM notifications WHERE id = ?
    `).bind(notificationId).run()

    await this.env.CACHE.delete(`notification:${notificationId}`)
  }

  async getUnreadCount(userId?: string): Promise<number> {
    const query = userId
      ? `SELECT COUNT(*) as count FROM notifications WHERE (user_id = ? OR user_id IS NULL) AND read = false`
      : `SELECT COUNT(*) as count FROM notifications WHERE user_id IS NULL AND read = false`

    const params = userId ? [userId] : []
    const result = await this.env.DB.prepare(query).bind(...params).first()

    return Number(result?.count || 0)
  }
}

export type { AppNotification } 