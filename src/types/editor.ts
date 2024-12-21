import { Editor as TipTapEditor } from '@tiptap/core'

export type Editor = TipTapEditor

export interface EditorProps {
  documentId: string
  initialContent?: string
  onUpdate?: (editor: Editor) => void
  onSelectionUpdate?: (editor: Editor) => void
  readOnly?: boolean
}

export interface CollaborationUser {
  name: string
  color: string
  avatar?: string
}

export interface EditorState {
  content: string
  version: number
  timestamp: number
}

export interface EditorUpdate {
  type: 'update' | 'selection'
  content?: string
  selection?: {
    from: number
    to: number
  }
  user: CollaborationUser
  timestamp: number
}

export interface CollaborativeDocument {
  id: string
  content: string
  version: number
  timestamp: number
} 