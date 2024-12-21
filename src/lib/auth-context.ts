'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  token: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: Error | null
}

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  error: null
}

const AuthContext = createContext<AuthContextType>(defaultContext)

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const auth = getAuth()
    return onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken()
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            token
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication error'))
      } finally {
        setLoading(false)
      }
    })
  }, [])

  return React.createElement(AuthContext.Provider, {
    value: { user, loading, error },
    children
  })
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext } 