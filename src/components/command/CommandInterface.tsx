'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Command, Send, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useVoiceCommands } from '@/lib/voice/VoiceCommandContext'

interface CommandInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandInterface({ isOpen, onClose }: CommandInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { isListening, startListening, stopListening, executeCommand } = useVoiceCommands()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setIsProcessing(true)
    await executeCommand(inputValue)
    setInputValue('')
    setIsProcessing(false)
  }

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
      // When voice command is detected, it will be set as input value
      // This could be handled through the VoiceCommandContext
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Command Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-full max-w-2xl z-50"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn(
              "flex items-center gap-3 mb-4 p-4",
              "bg-black/40 backdrop-blur-xl rounded-lg",
              "border border-white/10"
            )}>
              <Command className="w-6 h-6 text-purple-400" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">Command Center</h2>
                <p className="text-sm text-white/60">
                  Type a command or use voice input
                </p>
              </div>
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-3 h-3 rounded-full bg-red-500"
                />
              )}
            </div>

            {/* Command Input */}
            <div className={cn(
              "bg-black/40 backdrop-blur-xl",
              "border border-white/10 rounded-lg p-4"
            )}>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Type a command or use voice input..."}
                    className={cn(
                      "w-full bg-white/5 rounded-lg px-4 py-3",
                      "text-white placeholder:text-white/40",
                      "border border-white/10",
                      "focus:outline-none focus:border-purple-500/50",
                      "transition-colors"
                    )}
                    disabled={isListening}
                  />
                  {isListening && (
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </motion.div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVoiceCommand}
                  className={cn(
                    "p-3 rounded-lg transition-all",
                    isListening
                      ? "bg-red-500/20 border-red-500/40 text-red-400"
                      : "bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                  )}
                >
                  <Mic className="w-5 h-5" />
                </button>

                <button
                  type="submit"
                  disabled={isProcessing || !inputValue.trim()}
                  className={cn(
                    "p-3 rounded-lg transition-all",
                    "bg-blue-500/10 border border-blue-500/20",
                    "text-blue-400 hover:bg-blue-500/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>

              {/* Command Suggestions */}
              <div className="mt-4 space-y-2">
                <p className="text-xs text-white/40">Try saying or typing:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Show sales dashboard",
                    "Create workflow",
                    "Analyze revenue",
                    "Open notifications"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-sm",
                        "bg-white/5 border border-white/10",
                        "text-white/60 hover:text-white/80",
                        "transition-colors"
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 