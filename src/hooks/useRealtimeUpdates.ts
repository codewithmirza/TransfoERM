'use client'

import { useState, useEffect } from 'react'
import { RealtimeUpdate } from '@/types/realtime'

interface UseRealtimeUpdatesProps {
  onUpdate?: (update: RealtimeUpdate) => void
}

export function useRealtimeUpdates({ onUpdate }: UseRealtimeUpdatesProps = {}) {
  const [lastUpdate, setLastUpdate] = useState<RealtimeUpdate | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket('wss://transfoerm.manwaarullahb.workers.dev/ws')

    ws.onmessage = (event) => {
      const update: RealtimeUpdate = JSON.parse(event.data)
      setLastUpdate(update)
      if (onUpdate) {
        onUpdate(update)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [onUpdate])

  return {
    lastUpdate,
    socket
  }
} 