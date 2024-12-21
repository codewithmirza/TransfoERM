'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { CommandCenter } from '@/components/ai/CommandCenter'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
        <CommandCenter />
      </div>
    </div>
  )
} 