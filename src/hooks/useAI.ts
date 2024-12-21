import { useCallback } from 'react'
import { AIEngine } from '@/lib/ai/AIEngine'
import type { AIResponse } from '@/types/ai'

export function useAI() {
  const processCommand = useCallback(async (command: string): Promise<AIResponse> => {
    const aiEngine = AIEngine.getInstance()
    return await aiEngine.complete(command)
  }, [])

  return {
    processCommand
  }
} 