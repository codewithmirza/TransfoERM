import { useState, useCallback } from 'react'
import { RealtimeService } from '@/lib/realtime/RealtimeService'
import type { RealtimeMessage } from '@/types/realtime'
import { useRealtime } from './useRealtime'

interface DocumentState {
  content: string
  version: number
  lastModified: number
}

export function useCollaborativeDocument(documentId: string) {
  const [document, setDocument] = useState<DocumentState>({
    content: '',
    version: 0,
    lastModified: Date.now()
  })

  const handleDocumentMessage = useCallback((message: RealtimeMessage) => {
    if (message.type === 'document:update' && message.payload.documentId === documentId) {
      setDocument(message.payload.content)
    }
  }, [documentId])

  const { isConnected, send } = useRealtime({
    onMessage: handleDocumentMessage,
    onConnect: () => requestLatestVersion()
  })

  const updateDocument = useCallback((content: string) => {
    send({
      type: 'document:update',
      payload: {
        documentId,
        content: {
          content,
          version: document.version + 1,
          lastModified: Date.now()
        }
      },
      userId: 'system', // Should come from auth context
      timestamp: Date.now()
    })
  }, [documentId, document.version, send])

  const requestLatestVersion = useCallback(() => {
    send({
      type: 'document:sync',
      payload: { documentId },
      userId: 'system',
      timestamp: Date.now()
    })
  }, [documentId, send])

  return {
    document,
    isConnected,
    updateDocument
  }
} 