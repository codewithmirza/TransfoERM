import type { AppNotification } from '@/types/notifications'
import type { Env } from '@/types/cloudflare'
import { corsHeaders } from './cors'
import { NotificationManager } from '@/lib/notifications/NotificationManager'
import { ModuleNotifications } from '@/lib/notifications/ModuleNotifications'
import { WebSocketHandler } from './websocket'

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const notificationManager = new NotificationManager(env)
  const moduleNotifications = new ModuleNotifications(env)
  const wsHandler = new WebSocketHandler(env)

  try {
    // Get notifications
    if (request.method === 'GET' && !request.url.includes('/unread')) {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      const limit = parseInt(url.searchParams.get('limit') || '50')

      const notifications = await notificationManager.getNotifications(
        userId || undefined,
        limit
      )

      return new Response(
        JSON.stringify({ success: true, notifications }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Get unread count
    if (request.method === 'GET' && request.url.includes('/unread')) {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')

      const count = await notificationManager.getUnreadCount(userId || undefined)

      return new Response(
        JSON.stringify({ success: true, count }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Create notification
    if (request.method === 'POST') {
      const { type, module, data } = await request.json()

      let notification: AppNotification | undefined

      switch (module) {
        case 'finance':
          if (type === 'budget_alert') {
            notification = await moduleNotifications.handleBudgetAlert(data)
          }
          break

        case 'inventory':
          if (type === 'low_stock') {
            notification = await moduleNotifications.handleLowStockAlert(data)
          }
          break

        case 'hr':
          if (type === 'leave_request') {
            notification = await moduleNotifications.handleLeaveRequest(data)
          } else if (type === 'leave_approval') {
            notification = await moduleNotifications.handleLeaveApproval(data)
          }
          break

        case 'sales':
          if (type === 'new_sale') {
            notification = await moduleNotifications.handleNewSale(data)
          } else if (type === 'payment_status') {
            notification = await moduleNotifications.handlePaymentStatus(data)
          }
          break

        case 'ai':
          notification = await moduleNotifications.handleAIInsight(data)
          break

        default:
          notification = await moduleNotifications.handleSystemAlert({
            message: data.message,
            severity: data.severity || 'info',
            module: data.module,
            details: data.details,
            userId: data.userId
          })
      }

      // Broadcast to WebSocket clients if notification was created
      if (notification) {
        const channels = ['global']
        if (notification.user_id) {
          channels.push(`user:${notification.user_id}`)
        }
        if (notification.module) {
          channels.push(`module:${notification.module}`)
        }

        for (const channel of channels) {
          await wsHandler.broadcast(channel, {
            type: 'notification',
            data: notification
          })
        }
      }

      return new Response(
        JSON.stringify({ success: true, notification }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Mark as read
    if (request.method === 'POST' && request.url.includes('/read')) {
      const url = new URL(request.url)
      const notificationId = url.pathname.split('/').pop()

      if (!notificationId) {
        throw new Error('Notification ID is required')
      }

      await notificationManager.markAsRead(notificationId)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Delete notification
    if (request.method === 'DELETE') {
      const url = new URL(request.url)
      const notificationId = url.pathname.split('/').pop()

      if (!notificationId) {
        throw new Error('Notification ID is required')
      }

      await notificationManager.deleteNotification(notificationId)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    throw new Error('Method not allowed')
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
} 