'use client'

import { ReactNode } from 'react'
import { AIProvider } from '@/contexts/AIContext'
import { DesignProvider } from '@/contexts/DesignContext'
import { AuthProvider } from '@/lib/auth-context'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <DesignProvider>
      <AIProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </AIProvider>
    </DesignProvider>
  )
} 