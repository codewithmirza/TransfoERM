import { useEffect, useRef } from 'react'
import { Editor } from '@tiptap/core'
import { useEditor } from '@/providers/EditorProvider'
import { CollaborationUser } from '@/types/editor'

interface CollaborativeCursorProps {
  editor: Editor
  user: CollaborationUser
  position: { from: number; to: number }
}

export function CollaborativeCursor({ editor, user, position }: CollaborativeCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cursorRef.current) return

    const { from, to } = position
    const view = editor.view
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)

    cursorRef.current.style.left = `${start.left}px`
    cursorRef.current.style.top = `${start.top}px`
    cursorRef.current.style.height = `${end.bottom - start.top}px`
  }, [editor, position])

  return (
    <div
      ref={cursorRef}
      className="absolute w-[2px] pointer-events-none"
      style={{
        backgroundColor: user.color,
        transition: 'all 0.1s ease-in-out'
      }}
    >
      <div
        className="absolute top-0 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
        style={{
          backgroundColor: user.color,
          transform: 'translateY(-100%)'
        }}
      >
        {user.name}
      </div>
    </div>
  )
} 