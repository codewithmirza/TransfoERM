'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface VoiceContextType {
  isListening: boolean
  toggleListening: () => void
  startListening: () => void
  stopListening: () => void
  transcript: string
  error: string | null
}

const VoiceCommandContext = createContext<VoiceContextType>({} as VoiceContextType)

export function VoiceCommandProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize speech recognition
  const SpeechRecognition = typeof window !== 'undefined' 
    ? window.SpeechRecognition || window.webkitSpeechRecognition 
    : null
  const recognition = SpeechRecognition ? new SpeechRecognition() : null

  if (recognition) {
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setTranscript(transcript)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error)
      setIsListening(false)
      toast({
        title: 'Voice Recognition Error',
        description: `Error: ${event.error}`,
        variant: 'destructive',
      })
    }
  }

  const startListening = useCallback(() => {
    if (!recognition) {
      toast({
        title: 'Not Supported',
        description: 'Voice recognition is not supported in your browser.',
        variant: 'destructive',
      })
      return
    }

    setIsListening(true)
    setError(null)
    recognition.start()
    toast({
      title: 'Listening',
      description: 'Voice commands are now active.',
    })
  }, [recognition])

  const stopListening = useCallback(() => {
    if (!recognition) return
    
    setIsListening(false)
    recognition.stop()
    toast({
      title: 'Stopped Listening',
      description: 'Voice commands are now inactive.',
    })
  }, [recognition])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const value = {
    isListening,
    toggleListening,
    startListening,
    stopListening,
    transcript,
    error,
  }

  return (
    <VoiceCommandContext.Provider value={value}>
      {children}
    </VoiceCommandContext.Provider>
  )
}

export const useVoiceCommands = () => useContext(VoiceCommandContext) 