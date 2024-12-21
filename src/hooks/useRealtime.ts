import { useState, useEffect, useCallback } from 'react'
import { RealtimeService } from '@/lib/realtime/RealtimeService'
import type { RealtimeMessage } from '@/types/realtime'

interface UseRealtimeOptions {
  onMessage?: (message: RealtimeMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const realtimeService = RealtimeService.getInstance()

  const handleMessage = useCallback((message: RealtimeMessage) => {
    options.onMessage?.(message)
  }, [options])

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)
    const connectionId = crypto.randomUUID()

    ws.onopen = () => {
      setIsConnected(true)
      realtimeService.addConnection({
        id: connectionId,
        ws,
        userId: 'anonymous' // Replace with actual user ID from auth context
      })
      options.onConnect?.()
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as RealtimeMessage
        realtimeService.handleMessage(connectionId, message)
        handleMessage(message)
      } catch (error) {
        console.error('Failed to handle message:', error)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      realtimeService.removeConnection(connectionId)
      options.onDisconnect?.()
    }

    return () => {
      ws.close()
    }
  }, [realtimeService, handleMessage, options])

  const send = useCallback((message: RealtimeMessage) => {
    realtimeService.broadcast(message)
  }, [realtimeService])

  return {
    isConnected,
    send
  }
} 