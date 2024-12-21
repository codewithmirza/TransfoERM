'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useCollaborativeDocument } from '@/hooks/useCollaborativeDocument'

interface EditorContextType {
  document: {
    content: string
    version: number
    lastModified: number
  }
  isConnected: boolean
  updateDocument: (content: string) => void
}

const EditorContext = createContext<EditorContextType | null>(null)

interface EditorProviderProps {
  children: ReactNode
  documentId: string
}

export function EditorProvider({ children, documentId }: EditorProviderProps) {
  const { document, isConnected, updateDocument } = useCollaborativeDocument(documentId)

  return (
    <EditorContext.Provider value={{
      document,
      isConnected,
      updateDocument
    }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
} 