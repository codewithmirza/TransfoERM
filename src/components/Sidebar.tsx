'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Sidebar() {
  const { signOut } = useAuth()
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    // ... rest of your sidebar JSX
    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
    // ... rest of your sidebar JSX
  )
} 