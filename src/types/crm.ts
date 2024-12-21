export type CustomerStatus = 'active' | 'inactive' | 'pending'

export interface CustomerFormData {
  id?: string
  name: string
  email: string
  company: string
  status: CustomerStatus
  value: number
  notes?: string
}

export interface Customer extends CustomerFormData {
  id: string
  createdAt: string
  updatedAt: string
}

export interface CustomerFilter {
  status?: CustomerStatus
  search?: string
  minValue?: number
  maxValue?: number
}
