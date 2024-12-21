'use client'

import { Bell, Mic, Search, Command, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useVoiceCommands } from '@/lib/voice/VoiceCommandContext'
import { Notifications } from './Notifications'

interface TopNavProps {
  onCommandOpen: () => void;
}

export function TopNav({ onCommandOpen }: TopNavProps) {
  const { isListening } = useVoiceCommands();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 h-16 px-6 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10">
        {/* Left section - Command Trigger */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onCommandOpen}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-white/5 border border-white/10",
            "text-white/60 hover:text-white/80 transition-colors"
          )}
        >
          <Command className="w-4 h-4" />
          <span>Command</span>
          <kbd className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded">⌘K</kbd>
        </motion.button>

        {/* Right section - Actions */}
        <div className="flex items-center gap-4">
          {/* Voice Command */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "p-2 rounded-lg border transition-all",
              isListening 
                ? "bg-red-500/20 border-red-500/40 text-red-400" 
                : "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
            )}
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-medium text-white flex items-center justify-center">
                4
              </span>
            </button>
          </motion.div>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <Notifications onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
