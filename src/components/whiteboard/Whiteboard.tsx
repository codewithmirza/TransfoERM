'use client'

import { useRef, useEffect, useState } from 'react'
import { RealtimeService } from '@/lib/realtime/RealtimeService'
import type { RealtimeMessage } from '@/types/realtime'
import { useRealtime } from '@/hooks/useRealtime'

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

interface WhiteboardProps {
  roomId: string
  className?: string
}

export function Whiteboard({ roomId, className }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)
  const { isConnected, send } = useRealtime({
    onMessage: handleStrokeMessage
  })

  function handleStrokeMessage(message: RealtimeMessage) {
    if (message.type === 'whiteboard:stroke') {
      drawStroke(message.payload.stroke)
    }
  }

  function drawStroke(stroke: Stroke) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width

    stroke.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })

    ctx.stroke()
  }

  // Rest of the component implementation...

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={800}
      height={600}
    />
  )
} 