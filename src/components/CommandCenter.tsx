import { useState, useEffect } from 'react'
import { useVoiceCommands } from '@/hooks/useVoiceCommands'
import { VoiceCommandButton } from './VoiceCommandButton'
import { useAI } from '@/hooks/useAI'

export function CommandCenter() {
  const [command, setCommand] = useState('')
  const { isListening, toggleListening, speak } = useVoiceCommands()
  const { processCommand } = useAI()

  // Visual feedback for voice recognition
  useEffect(() => {
    if (isListening) {
      // Show visual feedback that we're listening
      document.body.classList.add('listening')
    } else {
      document.body.classList.remove('listening')
    }
  }, [isListening])

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-4">
      <div className={`p-4 rounded-lg bg-white shadow-lg transition-all ${
        isListening ? 'ring-2 ring-red-500' : ''
      }`}>
        {isListening ? 'Listening...' : 'Press mic to speak'}
      </div>
      <VoiceCommandButton />
    </div>
  )
} 