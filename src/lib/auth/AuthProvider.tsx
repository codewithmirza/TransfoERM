'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { onAuthStateChanged, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthErrorHandler } from '@/lib/auth/AuthErrorHandler'
import { useToast } from '@/components/ui/use-toast'

interface AuthContextType {
  user: any
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
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
    } catch (error) {
      const errorMessage = AuthErrorHandler.handleFirebaseError(error)
      throw new Error(errorMessage)
    }
  }

  const signUp = async (email: string, password: string, data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      // Here you could also store additional user data in Firestore
    } catch (error) {
      const errorMessage = AuthErrorHandler.handleFirebaseError(error)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        const errorMessage = AuthErrorHandler.handleFirebaseError(error)
        setError(errorMessage)
        setLoading(false)
        
        toast({
          title: 'Authentication Error',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    )

    // Check online status
    const handleOnline = () => {
      setError(null)
      if (process.env.NODE_ENV === 'development') {
        connectAuthEmulator(auth, 'http://localhost:9099')
      }
    }

    const handleOffline = () => {
      setError('You are currently offline. Some features may be unavailable.')
      toast({
        title: 'Connection Lost',
        description: 'You are offline. Please check your internet connection.',
        variant: 'destructive'
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      unsubscribe()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp }}>
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 