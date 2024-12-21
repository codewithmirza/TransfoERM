'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { User } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'
import { setCookie, deleteCookie } from 'cookies-next'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, data: any) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Handle auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email)
      
      if (user) {
        const token = await user.getIdToken()
        // Set both cookie and session storage
        setCookie('auth-token', token)
        sessionStorage.setItem('auth-token', token)
        setUser(user)
      } else {
        deleteCookie('auth-token')
        sessionStorage.removeItem('auth-token')
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      setCookie('auth-token', token)
      sessionStorage.setItem('auth-token', token)
      setUser(userCredential.user)
      console.log('Sign in successful, redirecting to dashboard')
      router.push('/dashboard')
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, data: any) => {
    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      setCookie('auth-token', token)
      sessionStorage.setItem('auth-token', token)
      setUser(userCredential.user)
      console.log('Sign up successful, redirecting to dashboard')
      router.push('/dashboard')
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      deleteCookie('auth-token')
      sessionStorage.removeItem('auth-token')
      setUser(null)
      console.log('Logout successful, redirecting to home')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" suppressHydrationWarning>
        <div className="text-center" suppressHydrationWarning>
          <div 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" 
            suppressHydrationWarning 
          />
          <p className="mt-4" suppressHydrationWarning>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
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