'use client'

import { useEffect, useState } from 'react'
import { RealtimeEngine, RealtimeEvent } from '@/lib/realtime/RealtimeEngine'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export function RealTimeMonitor() {
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const engine = RealtimeEngine.getInstance()
    const clientId = crypto.randomUUID()

    engine.connect(clientId, 'wss://your-websocket-server.com')
      .then(() => {
        setIsConnected(true)
        return engine.subscribe(clientId, 'system-events')
      })
      .catch(console.error)

    const handleEvent = (event: RealtimeEvent) => {
      setEvents(prev => [...prev, event].slice(-100)) // Keep last 100 events
    }

    engine.on('eventPublished', handleEvent)

    return () => {
      engine.removeListener('eventPublished', handleEvent)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Monitor</h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.timestamp.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">{event.type}</p>
                    <p className="text-sm text-gray-500">
                      {event.timestamp.toLocaleTimeString()}
                    </p>
                    <pre className="mt-2 text-sm bg-gray-50 p-2 rounded">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 