'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { VoiceRecognition } from './VoiceRecognition'
import { toast } from '@/components/ui/use-toast'

type CommandType = 'navigation' | 'action' | 'query' | 'workflow' | 'module'

interface VoiceCommand {
  type: CommandType
  trigger: string[]
  action: (params?: string[]) => void
  description: string
}

interface VoiceContextType {
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  executeCommand: (command: string) => void
  lastCommand?: string
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceCommandProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [lastCommand, setLastCommand] = useState<string>()
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null)
  const router = useRouter()

  // Define all available voice commands
  const commands: VoiceCommand[] = [
    // Navigation Commands
    {
      type: 'navigation',
      trigger: ['go to', 'open', 'show'],
      action: (params) => {
        const destination = params?.[0]
        switch (destination?.toLowerCase()) {
          case 'dashboard':
            router.push('/dashboard')
            break
          case 'finance':
            router.push('/dashboard/finance')
            break
          case 'sales':
            router.push('/dashboard/sales')
            break
          case 'hr':
            router.push('/dashboard/hr')
            break
          case 'workflow':
            router.push('/dashboard/workflow')
            break
        }
      },
      description: 'Navigate to different sections'
    },

    // Module Control Commands
    {
      type: 'module',
      trigger: ['expand', 'collapse', 'maximize', 'minimize'],
      action: (params) => {
        const moduleId = params?.[0]
        // Implement module expansion/collapse logic
        console.log(`Module action: ${params?.[0]} ${moduleId}`)
      },
      description: 'Control module display'
    },

    // Workflow Commands
    {
      type: 'workflow',
      trigger: ['create workflow', 'start workflow', 'automate'],
      action: (params) => {
        // Implement workflow creation/automation logic
        console.log(`Workflow action: ${params?.join(' ')}`)
      },
      description: 'Manage workflows'
    },

    // Query Commands
    {
      type: 'query',
      trigger: ['show me', 'analyze', 'report'],
      action: (params) => {
        // Implement data query and analysis logic
        console.log(`Query action: ${params?.join(' ')}`)
      },
      description: 'Data queries and analysis'
    },

    // Action Commands
    {
      type: 'action',
      trigger: ['refresh', 'update', 'sync'],
      action: (params) => {
        // Implement various actions
        console.log(`Action: ${params?.join(' ')}`)
      },
      description: 'Perform system actions'
    }
  ]

  // Handle voice recognition result
  const handleVoiceResult = useCallback((transcript: string) => {
    setLastCommand(transcript)
    executeCommand(transcript)
  }, [])

  // Initialize voice recognition
  useEffect(() => {
    const recognition = new VoiceRecognition(
      handleVoiceResult,
      () => {
        setIsListening(true)
        toast({
          title: "Listening...",
          description: "Speak your command",
        })
      },
      () => {
        setIsListening(false)
        toast({
          title: "Stopped listening",
        })
      },
      (error) => {
        toast({
          title: "Error",
          description: `Voice recognition error: ${error}`,
          variant: "destructive",
        })
        setIsListening(false)
      }
    )
    setVoiceRecognition(recognition)
  }, [handleVoiceResult])

  const startListening = useCallback(() => {
    voiceRecognition?.start()
  }, [voiceRecognition])

  const stopListening = useCallback(() => {
    voiceRecognition?.stop()
  }, [voiceRecognition])

  const executeCommand = (voiceInput: string) => {
    setLastCommand(voiceInput)
    
    // Parse the command
    const words = voiceInput.toLowerCase().split(' ')
    
    for (const command of commands) {
      for (const trigger of command.trigger) {
        if (voiceInput.toLowerCase().includes(trigger.toLowerCase())) {
          // Extract parameters (everything after the trigger)
          const triggerIndex = words.join(' ').indexOf(trigger)
          const params = words.slice(triggerIndex + trigger.split(' ').length)
          
          // Execute the command
          command.action(params)
          return
        }
      }
    }
  }

  return (
    <VoiceContext.Provider value={{
      isListening,
      startListening,
      stopListening,
      executeCommand,
      lastCommand
    }}>
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoiceCommands = () => {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoiceCommands must be used within a VoiceCommandProvider')
  }
  return context
} 