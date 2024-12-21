'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { ExtendedUser, UserData } from '@/types/user'

interface AuthContextType {
  user: ExtendedUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, data: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserData>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.data()
        
        // Combine Firebase user with Firestore data
        setUser({
          ...firebaseUser,
          ...userData,
        } as ExtendedUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const updateProfile = async (data: Partial<UserData>) => {
    if (!user) throw new Error('No user logged in')

    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), data)

    // Update Firebase profile if name is changed
    if (data.displayName) {
      await updateFirebaseProfile(user, {
        displayName: data.displayName,
      })
    }

    // Update local state
    setUser(prev => prev ? { ...prev, ...data } : null)
  }

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    signUp: async (email: string, password: string, data: any) => {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        ...data,
      })
    },
    signOut: () => auth.signOut(),
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 