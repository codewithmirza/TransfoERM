export interface User {
  id: string
  uid: string
  email: string
  name: string
  company?: string
  role: 'admin' | 'user'
  displayName?: string
  photoUrl?: string
  metadata: {
    createdAt: string
    lastLoginAt: string
    apiQuota?: number
    apiUsage?: number
  }
} 