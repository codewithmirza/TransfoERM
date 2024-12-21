import { useState, useEffect, useCallback } from 'react'
import { RealtimeService } from '@/lib/realtime/RealtimeService'
import type { RealtimeMessage } from '@/types/realtime'
import { useRealtime } from './useRealtime'

interface PresenceState {
  users: Map<string, UserPresence>
  lastUpdate: number
}

interface UserPresence {
  userId: string
  status: 'online' | 'away' | 'offline'
  lastSeen: number
  metadata?: Record<string, any>
}

export function usePresence(roomId: string) {
  const [users, setUsers] = useState<Map<string, UserPresence>>(new Map())
  const realtimeService = RealtimeService.getInstance()

  const handlePresenceMessage = useCallback((message: RealtimeMessage) => {
    if (message.type === 'presence:update') {
      const { userId, status, metadata } = message.payload
      setUsers(prev => {
        const next = new Map(prev)
        next.set(userId, {
          userId,
          status,
          lastSeen: Date.now(),
          metadata
        })
        return next
      })
    }
  }, [])

  const { isConnected, send } = useRealtime({
    onMessage: handlePresenceMessage,
    onConnect: () => updatePresence('online'),
    onDisconnect: () => updatePresence('offline')
  })

  const updatePresence = useCallback((status: UserPresence['status']) => {
    send({
      type: 'presence:update',
      payload: {
        roomId,
        status,
        timestamp: Date.now()
      },
      userId: 'system', // Should come from auth context
      timestamp: Date.now()
    })
  }, [roomId, send])

  useEffect(() => {
    if (isConnected) {
      updatePresence('online')
    }
    return () => {
      updatePresence('offline')
    }
  }, [isConnected, updatePresence])

  return {
    users,
    isConnected,
    updatePresence
  }
} 