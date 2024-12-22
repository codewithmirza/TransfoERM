import { User as FirebaseUser } from 'firebase/auth'

export interface UserData {
  displayName: string | null
  email: string | null
  company: string | null
  designation: string | null
  industry: string | null
  companySize: string | null
  phone: string | null
}

export interface ExtendedUser extends Omit<FirebaseUser, keyof UserData>, UserData {}

export interface User {
  id: string
  email: string
  name: string
  company?: string
  metadata?: {
    apiQuota?: number
    apiUsage?: number
  }
} 