import { motion, AnimatePresence } from 'framer-motion'
import { Mic } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useVoiceCommands } from '@/lib/voice/VoiceCommandContext'

export function VoiceFeedback() {
  const { isListening, lastCommand } = useVoiceCommands()

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2",
            "bg-black/60 backdrop-blur-xl",
            "border border-white/10 rounded-full",
            "px-6 py-3"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Mic className="w-6 h-6 text-red-400" />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            
            <div className="flex flex-col">
              <motion.div
                className="flex gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-4 bg-white/60"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </motion.div>
              {lastCommand && (
                <p className="text-sm text-white/60 mt-1">
                  "{lastCommand}"
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 