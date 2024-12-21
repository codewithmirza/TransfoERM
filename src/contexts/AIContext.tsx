'use client'

import { createContext, useContext, ReactNode } from 'react'
import { LlamaService } from '@/lib/ai/LlamaService'

interface AIContextType {
  complete: (prompt: string) => Promise<string>
  analyze: (data: any) => Promise<any>
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: ReactNode }) {
  const ai = LlamaService.getInstance()

  const value = {
    complete: ai.complete.bind(ai),
    analyze: ai.run.bind(ai)
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}

export function useAIContext() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAIContext must be used within an AIProvider')
  }
  return context
} 