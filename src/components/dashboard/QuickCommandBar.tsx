'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Command, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface QuickCommandBarProps {
  onCommand?: (command: string) => void
  className?: string
}

export function QuickCommandBar({ onCommand, className }: QuickCommandBarProps) {
  const [open, setOpen] = useState(false)
  const [command, setCommand] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    onCommand?.(command)
    setCommand('')
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
          className
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Quick Command...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
            <Search className="w-5 h-5 text-white/40" />
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type a command or search..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>

          <div className="px-4 pb-4">
            {/* Add your command suggestions/results here */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 