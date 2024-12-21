'use client'

import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import type { CommandHistory as CommandHistoryType } from '@/types/ai'

interface CommandHistoryProps {
  history: CommandHistoryType[]
  onSelect?: (item: CommandHistoryType) => void
}

export function CommandHistory({ history, onSelect }: CommandHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/60">Recent Commands</h3>
      <div className="space-y-1">
        {history.map((item) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            onClick={() => onSelect?.(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/80">{item.command}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </div>
            {item.response && (
              <p className="mt-1 text-xs text-white/40 truncate">
                {item.response}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
} 