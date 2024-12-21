import { EventEmitter } from 'events'
import { 
  UserContext,
  Priority,
  NotificationCategory,
  NotificationContent,
  OptimizedConfig,
  AppNotification
} from '@/types/notifications'
import { AINotificationEngine } from '../ai/AINotificationEngine'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'
export type NotificationType = 'event' | 'reminder' | 'alert' | 'update'

export interface SystemNotification extends AppNotification {
  title: string
  priority: NotificationPriority
  timestamp: Date
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary' | 'danger'
}

interface AINotificationConfig {
  userContext: UserContext;
  priority: Priority;
  category: NotificationCategory;
  content: NotificationContent;
}

export class NotificationSystem {
  private static instance: NotificationSystem
  private emitter: EventEmitter
  private notifications: Map<string, SystemNotification>
  private maxNotifications: number
  private aiEngine: AINotificationEngine;

  private constructor() {
    this.emitter = new EventEmitter()
    this.notifications = new Map()
    this.maxNotifications = 100
    this.aiEngine = new AINotificationEngine();
    this.setupEventListeners()
  }

  static getInstance(): NotificationSystem {
    if (!NotificationSystem.instance) {
      NotificationSystem.instance = new NotificationSystem()
    }
    return NotificationSystem.instance
  }

  private setupEventListeners() {
    this.emitter.on('notification:new', this.handleNewNotification.bind(this))
    this.emitter.on('notification:read', this.markAsRead.bind(this))
    this.emitter.on('notification:clear', this.clearNotification.bind(this))
  }

  private handleNewNotification(notification: Partial<SystemNotification>) {
    // Check if we need to remove old notifications
    if (this.notifications.size >= this.maxNotifications) {
      const oldestNotification = Array.from(this.notifications.values())
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0]
      this.notifications.delete(oldestNotification.id)
    }

    // Convert to SystemNotification
    const systemNotification: SystemNotification = {
      id: notification.id || crypto.randomUUID(),
      type: notification.type || 'info',
      module: notification.module || 'system',
      message: notification.message || '',
      details: notification.details || {},
      timestamp: new Date(),
      read: false,
      title: notification.title || '',
      priority: notification.priority || 'medium',
      user_id: notification.user_id
    }

    // Add new notification
    this.notifications.set(systemNotification.id, systemNotification)

    // Show browser notification if permitted
    this.showBrowserNotification(systemNotification)

    // Emit update event
    this.emitter.emit('notifications:updated', Array.from(this.notifications.values()))
  }

  private async showBrowserNotification(notification: SystemNotification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
        tag: notification.id
      })
    }
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  addNotification(notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: SystemNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    }
    this.emitter.emit('notification:new', newNotification)
    return newNotification
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.get(notificationId)
    if (notification) {
      notification.read = true
      this.notifications.set(notificationId, notification)
      this.emitter.emit('notifications:updated', Array.from(this.notifications.values()))
    }
  }

  clearNotification(notificationId: string) {
    this.notifications.delete(notificationId)
    this.emitter.emit('notifications:updated', Array.from(this.notifications.values()))
  }

  clearAll() {
    this.notifications.clear()
    this.emitter.emit('notifications:updated', [])
  }

  getUnreadCount(): number {
    return Array.from(this.notifications.values()).filter(n => !n.read).length
  }

  getAllNotifications(): SystemNotification[] {
    return Array.from(this.notifications.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  subscribe(callback: (notifications: SystemNotification[]) => void): () => void {
    this.emitter.on('notifications:updated', callback)
    return () => this.emitter.off('notifications:updated', callback)
  }

  subscribeToNew(callback: (notification: SystemNotification) => void): () => void {
    this.emitter.on('notification:new', callback)
    return () => this.emitter.off('notification:new', callback)
  }

  async sendNotification(config: AINotificationConfig): Promise<void> {
    const optimizedConfig = await this.aiEngine.optimizeDelivery({
      ...config,
      timing: await this.aiEngine.predictBestTime(config.userContext),
      channel: await this.aiEngine.selectOptimalChannel(config.userContext)
    });

    const enhancedContent = await this.aiEngine.enhanceContent(
      optimizedConfig.content,
      config.userContext
    );

    await this.deliver(enhancedContent, optimizedConfig);
  }

  private async deliver(content: NotificationContent, config: OptimizedConfig): Promise<void> {
    // Implementation of actual delivery logic
  }
} 