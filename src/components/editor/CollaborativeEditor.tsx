'use client'

import { useCallback } from 'react'
import { useCollaborativeDocument } from '@/hooks/useCollaborativeDocument'
import { Editor } from '../ui/editor'
import type { RealtimeMessage } from '@/types/realtime'

interface CollaborativeEditorProps {
  documentId: string
  placeholder?: string
  className?: string
}

export function CollaborativeEditor({ documentId, placeholder, className }: CollaborativeEditorProps) {
  const { document, isConnected, updateDocument } = useCollaborativeDocument(documentId)

  const handleChange = useCallback((content: string) => {
    updateDocument(content)
  }, [updateDocument])

  return (
    <div className={className}>
      {!isConnected && (
        <div className="p-2 bg-yellow-500/10 text-yellow-500 text-sm rounded-lg mb-2">
          Reconnecting...
        </div>
      )}
      <Editor
        value={document.content}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={!isConnected}
      />
    </div>
  )
} 