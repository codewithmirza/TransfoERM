'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import type { AppNotification } from '@/types/notifications'

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  // Set up WebSocket connection
  const { isConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'notification') {
        handleNewNotification(message.data)
      }
    }
  })

  const handleNewNotification = (notification: AppNotification) => {
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)
    
    // Show toast for new notification
    toast({
      title: notification.type.charAt(0).toUpperCase() + notification.type.slice(1),
      description: notification.message,
      variant: notification.type === 'critical' ? 'destructive' : 'default'
    })
  }

  const fetchNotifications = async () => {
    if (!user) return

    try {
      const response = await fetch(
        `https://transfoerm.manwaarullahb.workers.dev/api/notifications?userId=${user.uid}`
      )
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n: AppNotification) => !n.read).length)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `https://transfoerm.manwaarullahb.workers.dev/api/notifications/${id}/read`,
        { method: 'POST' }
      )
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(
        `https://transfoerm.manwaarullahb.workers.dev/api/notifications/${id}`,
        { method: 'DELETE' }
      )
      
      if (response.ok) {
        const wasUnread = notifications.find(n => n.id === id)?.read === false
        setNotifications(prev => prev.filter(n => n.id !== id))
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  // Show connection status
  useEffect(() => {
    if (!isConnected) {
      toast({
        title: 'Connection Status',
        description: 'Reconnecting to notification service...',
        variant: 'default'
      })
    }
  }, [isConnected])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      deleteNotification,
      refresh: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 