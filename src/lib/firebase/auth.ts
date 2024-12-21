import { Env } from '@/types/cloudflare'

interface FirebaseAuthResponse {
  users: Array<{
    localId: string
    email: string
    emailVerified: boolean
    displayName?: string
    providerUserInfo: Array<{
      providerId: string
      displayName?: string
      photoUrl?: string
      federatedId: string
    }>
    photoUrl?: string
    validSince: string
    disabled: boolean
    lastLoginAt: string
    createdAt: string
  }>
}

export interface AuthResult {
  success: boolean
  userId?: string
  error?: string
}

interface FirebaseSignInResponse {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
}

export async function loginWithEmail(email: string, password: string, apiKey: string): Promise<AuthResult> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    )

    if (!response.ok) {
      const errorData = await response.json() as { error?: { message?: string } }
      throw new Error(errorData.error?.message || 'Login failed')
    }

    const data = await response.json() as FirebaseSignInResponse
    return {
      success: true,
      userId: data.localId
    }
  } catch (error) {
    console.error('Login Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    }
  }
}

export async function signupWithEmail(email: string, password: string, apiKey: string): Promise<AuthResult> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      }
    )

    if (!response.ok) {
      const errorData = await response.json() as { error?: { message?: string } }
      throw new Error(errorData.error?.message || 'Signup failed')
    }

    const data = await response.json() as FirebaseSignInResponse
    return {
      success: true,
      userId: data.localId
    }
  } catch (error) {
    console.error('Signup Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed'
    }
  }
}

export async function logoutUser(): Promise<AuthResult> {
  // Firebase handles token invalidation on the client side
  return {
    success: true
  }
}

export async function verifyFirebaseToken(token: string, apiKey: string): Promise<AuthResult> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
      }
    )

    if (!response.ok) {
      const errorData = await response.json() as { error?: { message?: string } }
      throw new Error(errorData.error?.message || 'Token verification failed')
    }

    const data = await response.json() as FirebaseAuthResponse
    return {
      success: true,
      userId: data.users[0].localId
    }
  } catch (error) {
    console.error('Firebase Auth Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    }
  }
} 