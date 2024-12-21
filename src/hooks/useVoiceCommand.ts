'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceCommandResult } from '@/types/realtime'

interface UseVoiceCommandProps {
  onResult?: (result: VoiceCommandResult) => void
  language?: string
}

export function useVoiceCommand({ onResult, language = 'en-US' }: UseVoiceCommandProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language

      recognition.onresult = (event) => {
        const last = event.results.length - 1
        const result = event.results[last]
        const transcript = result[0].transcript
        
        setTranscript(transcript)
        
        if (onResult) {
          onResult({
            transcript,
            confidence: result[0].confidence,
            isFinal: result.isFinal
          })
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognition)
    }
  }, [language, onResult])

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start()
        setIsListening(true)
      } catch (error) {
        console.error('Failed to start speech recognition:', error)
      }
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: !!recognition
  }
} 