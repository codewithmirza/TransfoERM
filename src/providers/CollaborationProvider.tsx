'use client'

import { createContext, useContext, ReactNode, useCallback } from 'react'
import { usePresence } from '@/hooks/usePresence'
import type { UserPresence } from '@/types/realtime'

interface CollaborationContextType {
  users: Map<string, UserPresence>
  connected: boolean
  join: (roomId: string) => void
  leave: (roomId: string) => void
  updateStatus: (status: UserPresence['status']) => void
}

const CollaborationContext = createContext<CollaborationContextType | null>(null)

interface CollaborationProviderProps {
  children: ReactNode
  roomId: string
}

export function CollaborationProvider({ children, roomId }: CollaborationProviderProps) {
  const { users, isConnected, updatePresence } = usePresence(roomId)

  const join = useCallback((roomId: string) => {
    updatePresence('online')
  }, [updatePresence])

  const leave = useCallback((roomId: string) => {
    updatePresence('offline')
  }, [updatePresence])

  const updateStatus = useCallback((status: UserPresence['status']) => {
    updatePresence(status)
  }, [updatePresence])

  return (
    <CollaborationContext.Provider value={{
      users,
      connected: isConnected,
      join,
      leave,
      updateStatus
    }}>
      {children}
    </CollaborationContext.Provider>
  )
}

export function useCollaboration() {
  const context = useContext(CollaborationContext)
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider')
  }
  return context
} 