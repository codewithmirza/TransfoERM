'use client'

import { Bell, Mic, Search, Command, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useVoiceCommands } from '@/lib/voice/VoiceCommandContext'
import { Notifications } from './Notifications'

interface TopNavProps {
  onCommandOpen: () => void
  onSettingsOpen: () => void
}

export function TopNav({ onCommandOpen, onSettingsOpen }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const { isListening, toggleListening } = useVoiceCommands()

  return (
    <div className="sticky top-0 z-30 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6">
        {/* Search trigger */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-white/60 hover:text-white"
          onClick={onCommandOpen}
        >
          <Search className="h-4 w-4" />
          <span className="text-sm">Search...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 text-[10px] font-medium text-white/40">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <div className="ml-auto flex items-center gap-2">
          {/* Voice command button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-white/60 hover:text-white hover:bg-white/5",
              isListening && "text-red-400 hover:text-red-400"
            )}
            onClick={toggleListening}
          >
            <Mic className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={onSettingsOpen}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showNotifications && (
          <Notifications onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
