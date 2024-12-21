import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'

interface UseWebSocketOptions {
  onMessage?: (message: any) => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectCount, setReconnectCount] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  const {
    onMessage,
    reconnectAttempts = 5,
    reconnectInterval = 5000
  } = options

  const connect = useCallback(() => {
    if (!user) return

    const ws = new WebSocket(
      `wss://transfoerm.manwaarullahb.workers.dev/websocket?userId=${user.uid}`
    )

    ws.onopen = () => {
      setIsConnected(true)
      setReconnectCount(0)
      
      // Subscribe to user-specific channels
      ws.send(JSON.stringify({
        type: 'subscribe',
        channel: `user:${user.uid}`
      }))
    }

    ws.onclose = () => {
      setIsConnected(false)
      
      // Attempt to reconnect
      if (reconnectCount < reconnectAttempts) {
        setTimeout(() => {
          setReconnectCount(prev => prev + 1)
          connect()
        }, reconnectInterval)
      } else {
        toast({
          title: 'Connection Lost',
          description: 'Failed to reconnect to notification service',
          variant: 'destructive'
        })
      }
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        onMessage?.(message)
      } catch (error) {
        console.error('WebSocket message error:', error)
      }
    }

    setSocket(ws)

    // Cleanup on unmount
    return () => {
      ws.close()
    }
  }, [user, reconnectCount, reconnectAttempts, reconnectInterval, onMessage])

  useEffect(() => {
    connect()
  }, [connect])

  const send = useCallback((message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }, [socket])

  const subscribe = useCallback((channel: string) => {
    send({
      type: 'subscribe',
      channel
    })
  }, [send])

  const unsubscribe = useCallback((channel: string) => {
    send({
      type: 'unsubscribe',
      channel
    })
  }, [send])

  return {
    isConnected,
    send,
    subscribe,
    unsubscribe
  }
} 