'use client'

import { AuthProvider } from '@/lib/auth/AuthProvider'
import { Toaster } from '@/components/ui/toaster'
import { Loading } from '@/components/ui/loading'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Loading />
  }

  return (
    <>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster />
    </>
  )
} 