'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
}

export function Editor({ value, onChange, placeholder, readOnly, className }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current && !readOnly) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div
      ref={editorRef}
      contentEditable={!readOnly}
      onInput={handleInput}
      data-placeholder={placeholder}
      className={cn(
        "min-h-[200px] p-4 rounded-lg border focus:outline-none focus:ring-2",
        "border-gray-200 dark:border-gray-800",
        "focus:ring-blue-500 dark:focus:ring-blue-400",
        readOnly && "bg-gray-50 dark:bg-gray-900 cursor-not-allowed",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400",
        className
      )}
    />
  )
} 