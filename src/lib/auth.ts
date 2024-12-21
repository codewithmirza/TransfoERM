import { Env } from '@/types/cloudflare'
import { verifyFirebaseToken, type AuthResult } from './firebase/auth'

export async function verifyAuth(request: Request, env: Env): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { success: false, error: 'No token provided' }
  }

  const token = authHeader.split(' ')[1]
  return verifyFirebaseToken(token, env.FIREBASE_API_KEY)
}

export const auth = {
  verifyAuth
} 