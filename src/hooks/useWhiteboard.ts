import { useState, useCallback } from 'react'
import { useRealtime } from './useRealtime'
import { RealtimeMessage } from '@/lib/realtime/RealtimeService'

interface Point {
  x: number
  y: number
}

interface Stroke {
  id: string
  points: Point[]
  color: string
  width: number
}

interface UseWhiteboardOptions {
  onChange?: (strokes: Stroke[]) => void
}

export function useWhiteboard(whiteboardId: string, options: UseWhiteboardOptions = {}) {
  const [strokes, setStrokes] = useState<Stroke[]>([])

  const { send, connected } = useRealtime(whiteboardId, {
    onMessage: (message: RealtimeMessage) => {
      if (message.type === 'whiteboard:stroke') {
        const { stroke } = message.payload
        setStrokes(prev => {
          const next = [...prev, stroke]
          options.onChange?.(next)
          return next
        })
      } else if (message.type === 'whiteboard:clear') {
        setStrokes([])
        options.onChange?.([])
      }
    }
  })

  const addStroke = useCallback((stroke: Stroke) => {
    send('whiteboard:stroke', { stroke })
  }, [send])

  const clear = useCallback(() => {
    send('whiteboard:clear', null)
  }, [send])

  return {
    strokes,
    addStroke,
    clear,
    connected
  }
} 