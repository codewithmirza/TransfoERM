import { auth } from '../firebase/config'
import { User } from 'firebase/auth'

// Export the auth instance directly
export { auth }

export interface AuthConfig {
  user: User | null
  loading: boolean
}

export const getAuthConfig = async (): Promise<AuthConfig> => {
  const user = auth.currentUser
  return {
    user,
    loading: false
  }
} 