'use client'
import { useAuth } from '@/contexts/auth-context'

export function TestAuth() {
  const { user } = useAuth()
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Auth Status:</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
} 