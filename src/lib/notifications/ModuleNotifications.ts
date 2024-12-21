import type { AppNotification } from '@/types/notifications'
import type { Env } from '@/types/cloudflare'
import { NotificationManager } from './NotificationManager'

export class ModuleNotifications {
  private notificationManager: NotificationManager

  constructor(private env: Env) {
    this.notificationManager = new NotificationManager(env)
  }

  // Finance Module Notifications
  async handleBudgetAlert(data: {
    category: string
    budget: number
    spent: number
    userId?: string
  }): Promise<AppNotification> {
    const percentage = (data.spent / data.budget) * 100
    const severity = percentage >= 90 ? 'critical' : 'warning'

    return await this.notificationManager.createNotification({
      type: severity,
      module: 'finance',
      message: `Budget alert: ${data.category} is at ${percentage.toFixed(1)}% (${data.spent}/${data.budget})`,
      details: {
        category: data.category,
        budget: data.budget,
        spent: data.spent,
        percentage
      },
      user_id: data.userId
    })
  }

  // Inventory Module Notifications
  async handleLowStockAlert(data: {
    itemId: string
    itemName: string
    quantity: number
    reorderPoint: number
    userId?: string
  }): Promise<AppNotification> {
    const severity = data.quantity === 0 ? 'critical' : 'warning'

    return await this.notificationManager.createNotification({
      type: severity,
      module: 'inventory',
      message: `Low stock alert: ${data.itemName} is below reorder point (${data.quantity}/${data.reorderPoint})`,
      details: {
        itemId: data.itemId,
        itemName: data.itemName,
        quantity: data.quantity,
        reorderPoint: data.reorderPoint
      },
      user_id: data.userId
    })
  }

  // HR Module Notifications
  async handleLeaveRequest(data: {
    requestId: string
    employeeName: string
    type: string
    startDate: string
    endDate: string
    managerId?: string
  }): Promise<AppNotification> {
    return await this.notificationManager.createNotification({
      type: 'info',
      module: 'hr',
      message: `New leave request from ${data.employeeName} (${data.type})`,
      details: {
        requestId: data.requestId,
        employeeName: data.employeeName,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate
      },
      user_id: data.managerId
    })
  }

  async handleLeaveApproval(data: {
    requestId: string
    employeeName: string
    status: 'approved' | 'rejected'
    userId: string
  }): Promise<AppNotification> {
    return await this.notificationManager.createNotification({
      type: 'info',
      module: 'hr',
      message: `Your leave request has been ${data.status}`,
      details: {
        requestId: data.requestId,
        status: data.status
      },
      user_id: data.userId
    })
  }

  // Sales Module Notifications
  async handleNewSale(data: {
    saleId: string
    customerName: string
    amount: number
    userId?: string
  }): Promise<AppNotification> {
    return await this.notificationManager.createNotification({
      type: 'info',
      module: 'sales',
      message: `New sale: ${data.customerName} - $${data.amount.toLocaleString()}`,
      details: {
        saleId: data.saleId,
        customerName: data.customerName,
        amount: data.amount
      },
      user_id: data.userId
    })
  }

  async handlePaymentStatus(data: {
    saleId: string
    customerName: string
    status: 'paid' | 'overdue'
    amount: number
    userId?: string
  }): Promise<AppNotification> {
    const severity = data.status === 'overdue' ? 'warning' : 'info'

    return await this.notificationManager.createNotification({
      type: severity,
      module: 'sales',
      message: data.status === 'paid'
        ? `Payment received: ${data.customerName} - $${data.amount.toLocaleString()}`
        : `Payment overdue: ${data.customerName} - $${data.amount.toLocaleString()}`,
      details: {
        saleId: data.saleId,
        customerName: data.customerName,
        status: data.status,
        amount: data.amount
      },
      user_id: data.userId
    })
  }

  // AI Insights Notifications
  async handleAIInsight(data: {
    module: 'finance' | 'inventory' | 'hr' | 'sales'
    insight: string
    confidence: number
    details?: Record<string, any>
    userId?: string
  }): Promise<AppNotification> {
    return await this.notificationManager.createNotification({
      type: 'info',
      module: data.module,
      message: `AI Insight: ${data.insight}`,
      details: {
        confidence: data.confidence,
        ...data.details
      },
      user_id: data.userId
    })
  }

  // System Notifications
  async handleSystemAlert(data: {
    message: string
    severity: 'info' | 'warning' | 'critical'
    module?: 'finance' | 'inventory' | 'hr' | 'sales'
    details?: Record<string, any>
    userId?: string
  }): Promise<AppNotification> {
    return await this.notificationManager.createNotification({
      type: data.severity,
      module: data.module || 'system',
      message: data.message,
      details: data.details || {},
      user_id: data.userId
    })
  }
} 