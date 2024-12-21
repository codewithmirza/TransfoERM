import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CursorPosition {
  x: number
  y: number
  user: {
    name: string
    color: string
  }
  timestamp: number
}

interface CursorOverlayProps {
  cursors: Map<string, CursorPosition>
}

export function CursorOverlay({ cursors }: CursorOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Clean up stale cursors
    const cleanup = setInterval(() => {
      cursors.forEach((cursor, userId) => {
        const age = Date.now() - cursor.timestamp
        if (age > 5000) { // Remove cursors older than 5 seconds
          cursors.delete(userId)
        }
      })
    }, 1000)

    return () => clearInterval(cleanup)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
    >
      <AnimatePresence>
        {Array.from(cursors.entries()).map(([userId, cursor]) => (
          <motion.div
            key={userId}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute flex items-center gap-2"
            style={{
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Cursor */}
            <div
              className="w-4 h-4 transform rotate-45"
              style={{ backgroundColor: cursor.user.color }}
            />
            
            {/* Name tag */}
            <div
              className="px-2 py-1 text-xs text-white rounded"
              style={{ backgroundColor: cursor.user.color }}
            >
              {cursor.user.name}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 