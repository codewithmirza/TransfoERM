import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import type { AppNotification } from '@/types/notifications'

export function useNotifications(refreshInterval = 60000) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchNotifications = async () => {
    if (!user) return

    try {
      const response = await fetch(
        `https://transfoerm.manwaarullahb.workers.dev/api/notifications?userId=${user.uid}`
      )
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const fetchUnreadCount = async () => {
    if (!user) return

    try {
      const response = await fetch(
        `https://transfoerm.manwaarullahb.workers.dev/api/notifications/unread?userId=${user.uid}`
      )
      const data = await response.json()
      setUnreadCount(data.count || 0)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(
        `https://transfoerm.manwaarullahb.workers.dev/api/notifications/${notificationId}/read`,
        { method: 'POST' }
      )
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive'
      })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(
        `https://transfoerm.manwaarullahb.workers.dev/api/notifications/${notificationId}`,
        { method: 'DELETE' }
      )
      const wasUnread = notifications.find(n => n.id === notificationId)?.read === false
      setNotifications(notifications.filter(n => n.id !== notificationId))
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive'
      })
    }
  }

  // Initial fetch
  useEffect(() => {
    if (user) {
      Promise.all([
        fetchNotifications(),
        fetchUnreadCount()
      ]).finally(() => setLoading(false))
    }
  }, [user])

  // Set up polling
  useEffect(() => {
    if (!user || !refreshInterval) return

    const interval = setInterval(() => {
      fetchUnreadCount()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [user, refreshInterval])

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markAsRead,
    deleteNotification
  }
} 