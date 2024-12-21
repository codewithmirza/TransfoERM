import { useState, useEffect, useCallback } from 'react'
import { VoiceCommandManager } from '@/lib/voice/VoiceCommandManager'
import { useAI } from './useAI'

export function useVoiceCommands() {
  const [voiceManager] = useState(() => new VoiceCommandManager())
  const [isListening, setIsListening] = useState(false)
  const { processCommand } = useAI()

  useEffect(() => {
    // Register AI-powered command processing
    voiceManager.registerCommand('execute', async (command) => {
      const result = await processCommand(command)
      await voiceManager.speak(result.content)
    })

    // Register module-specific commands
    voiceManager.registerCommand('hr', async (action) => {
      switch (action) {
        case 'show employees':
          // Navigate to employees list
          break
        case 'create employee':
          // Open employee creation form
          break
        // Add more HR commands
      }
    })

    // Add more module commands
  }, [voiceManager, processCommand])

  const toggleListening = useCallback(() => {
    if (isListening) {
      voiceManager.stopListening()
      setIsListening(false)
    } else {
      voiceManager.startListening()
      setIsListening(true)
    }
  }, [isListening, voiceManager])

  return {
    isListening,
    toggleListening,
    speak: voiceManager.speak.bind(voiceManager)
  }
} 