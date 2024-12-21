'use client'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopNav } from '@/components/dashboard/TopNav'
import { cn } from "@/lib/utils"
import { useState, useEffect } from 'react'
import { CommandInterface } from '@/components/command/CommandInterface'
import { VoiceCommandProvider } from '@/lib/voice/VoiceCommandContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showCommandInterface, setShowCommandInterface] = useState(false)

  // Keyboard shortcut for command interface
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandInterface(true)
      }
      if (e.key === 'Escape') {
        setShowCommandInterface(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <VoiceCommandProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Ambient background effects */}
        <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
        
        {/* Main layout */}
        <div className="relative flex min-h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 ml-80">
            {/* Top Navigation */}
            <TopNav onCommandOpen={() => setShowCommandInterface(true)} />

            {/* Main content */}
            <main className="relative p-6 overflow-x-hidden">
              {/* Content background effects */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-blue-500/[0.02] to-black/0" />
              
              {/* Actual content */}
              <div className="relative z-10">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Command Interface */}
        <CommandInterface 
          isOpen={showCommandInterface} 
          onClose={() => setShowCommandInterface(false)} 
        />
      </div>
    </VoiceCommandProvider>
  )
}
