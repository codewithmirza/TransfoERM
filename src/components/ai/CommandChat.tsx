'use client'

import { useState } from 'react'
import { Mic, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CommandResponse } from '@/types/api'
import { nanoid } from 'nanoid'

interface Message {
  id: string
  content: string
  timestamp: string
  type: 'user' | 'assistant'
}

export function CommandChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = {
      id: nanoid(),
      content: input,
      timestamp: new Date().toISOString(),
      type: 'user'
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')

    try {
      const response = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })

      const data: CommandResponse = await response.json()
      
      const assistantMessage: Message = {
        id: nanoid(),
        content: data.response,
        timestamp: new Date().toISOString(),
        type: 'assistant'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  async function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser.')
      return
    }

    setIsListening(true)
    // Voice recognition implementation
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col p-4 shadow-xl">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={startVoiceRecognition}
          disabled={isListening}
        >
          <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your command..."
          disabled={isProcessing || isListening}
        />
        <Button type="submit" disabled={isProcessing || !input.trim()}>
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Card>
  )
}
