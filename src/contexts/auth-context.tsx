'use client'

import { createContext, useContext, useState } from 'react'
import type { User } from '@/types/user'
import type { AuthResponse, APIResponse } from '@/types/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (email: string, password: string, data: any) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json() as AuthResponse
      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }
      
      const transformedUser: User = {
        ...data.data.user,
        name: data.data.user.displayName || '',
        metadata: {
          ...data.data.user.metadata,
          apiQuota: data.data.user.metadata?.apiQuota || 0,
          apiUsage: data.data.user.metadata?.apiUsage || 0
        }
      }
      
      setUser(transformedUser)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await fetch('/api/auth/logout')
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, data: any) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...data })
      })
      
      const result = await response.json() as AuthResponse
      if (!result.success) {
        throw new Error(result.error || 'Signup failed')
      }
      
      const transformedUser: User = {
        ...result.data.user,
        name: result.data.user.displayName || '',
        metadata: {
          ...result.data.user.metadata,
          apiQuota: result.data.user.metadata?.apiQuota || 0,
          apiUsage: result.data.user.metadata?.apiUsage || 0
        }
      }
      
      setUser(transformedUser)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Signup failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json() as APIResponse
      if (!data.success) {
        throw new Error(data.error || 'Password reset failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Password reset failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json() as AuthResponse
      if (!result.success) {
        throw new Error(result.error || 'Profile update failed')
      }
      
      const transformedUser: User = {
        ...result.data.user,
        name: result.data.user.displayName || '',
        metadata: {
          ...result.data.user.metadata,
          apiQuota: result.data.user.metadata?.apiQuota || 0,
          apiUsage: result.data.user.metadata?.apiUsage || 0
        }
      }
      
      setUser(transformedUser)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Profile update failed'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signUp,
    resetPassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 