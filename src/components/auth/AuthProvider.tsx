import { useState, useEffect, createContext, useContext } from 'react'
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthErrorHandler } from '@/lib/auth/AuthErrorHandler'
import { useToast } from '@/components/ui/use-toast'

interface AuthContextType {
  user: any
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

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
      // Attempt to reconnect Firebase
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
    <AuthContext.Provider value={{ user, loading, error }}>
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