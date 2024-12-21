import { useVoiceCommands } from '@/hooks/useVoiceCommands'
import { Mic, MicOff } from 'lucide-react'

export function VoiceCommandButton() {
  const { isListening, toggleListening } = useVoiceCommands()

  return (
    <button
      onClick={toggleListening}
      className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg ${
        isListening ? 'bg-red-500' : 'bg-blue-500'
      } text-white`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  )
} 