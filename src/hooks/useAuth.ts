import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  return { loading }
} 