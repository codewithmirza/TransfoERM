'use client'

import { useState } from 'react'
import { useRAG } from '@/hooks/useRAG'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  complete?: boolean
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const { streamQuery, loading } = useRAG({
    onChunk: (content) => {
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        
        if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.complete) {
          lastMessage.content += content
          return newMessages
        }
        
        return [...newMessages, { role: 'assistant', content, complete: false }]
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input, complete: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      await streamQuery(input)
      // Mark the last message as complete
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage) {
          lastMessage.complete = true
        }
        return newMessages
      })
    } catch (error) {
      console.error('Chat Error:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-4">
      <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              } ${!message.complete ? 'animate-pulse' : ''}`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </Card>
  )
} 