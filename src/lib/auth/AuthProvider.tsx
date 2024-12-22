'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { AuthResponse } from '@/types/api'
import { API_URL } from '@/lib/config'

interface User {
  id: string
  email: string
  name: string
  company?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in to:', `${API_URL}/api/auth/signin`)
      
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('Response status:', response.status)
      const data = (await response.json()) as AuthResponse
      console.log('Response data:', data)
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to sign in')
      }

      localStorage.setItem('token', data.data.token)
      setUser(data.data.user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Detailed signin error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to sign in')
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: userData.name,
          company: userData.company
        })
      })

      const data = (await response.json()) as AuthResponse
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to sign up')
      }

      localStorage.setItem('token', data.data.token)
      setUser(data.data.user)
      router.push('/dashboard')
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to sign up')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user data
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then((response: unknown) => {
          const data = response as AuthResponse
          if (data.success && data.data?.user) {
            setUser(data.data.user)
            router.push('/dashboard')
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 