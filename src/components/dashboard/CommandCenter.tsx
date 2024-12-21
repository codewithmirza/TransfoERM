'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mic, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { VoiceCommandResult } from '@/types/realtime'

interface CommandCenterProps {
  isListening?: boolean
  onVoiceCommand?: () => void
}

export function CommandCenter({ isListening, onVoiceCommand }: CommandCenterProps) {
  const [command, setCommand] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleVoiceResult = (result: VoiceCommandResult) => {
    if (result.isFinal) {
      setCommand(result.text)
      processCommand(result.text)
    }
  }

  const processCommand = async (text: string) => {
    if (!text.trim() || processing) return

    setProcessing(true)
    try {
      const response = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: text })
      })
      
      const data = await response.json()
      // Handle response
      
    } catch (error) {
      console.error('Command processing error:', error)
    } finally {
      setProcessing(false)
      setCommand('')
    }
  }

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "bg-black/40 backdrop-blur-xl border border-white/10",
      "p-4"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
      
      <form onSubmit={(e) => { e.preventDefault(); processCommand(command); }} className="relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Ask anything or type a command..."
              className="bg-white/5 border-white/10 text-white"
              disabled={processing}
            />
            {processing && (
              <motion.div 
                className="absolute right-3 top-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
              </motion.div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={processing}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Send className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className={cn(
              "border-white/10 text-white",
              isListening && "border-purple-500 text-purple-400"
            )}
            onClick={onVoiceCommand}
          >
            <Mic className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  )
} 