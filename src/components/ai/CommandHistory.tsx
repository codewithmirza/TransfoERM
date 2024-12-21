'use client'

import { useEffect, useState } from 'react'

interface Command {
  id: string;
  content: string;
  timestamp: string;
  module: string;
  confidence: number;
  action: string;
  suggestedResponse: string;
}

interface CommandHistoryResponse {
  commands: Command[];
  data?: any;
}

export function CommandHistory() {
  const [history, setHistory] = useState<Command[]>([])
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          '/api/ai/command/history'
        )
        const result = (await response.json()) as CommandHistoryResponse
        setHistory(result.commands || [])
        if (result.data) {
          setData(result.data)
        }
      } catch (error) {
        console.error('Failed to load command history:', error)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div>
      {history.map((command) => (
        <div key={command.id}>
          <span>{command.module}</span>
          <span>{command.action}</span>
          <span>{command.confidence}</span>
          <span>{command.suggestedResponse}</span>
          {/* Rest of your rendering logic */}
        </div>
      ))}
    </div>
  )
} 